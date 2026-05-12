const React = require('react');

const RouterContext = React.createContext({
  path: '/',
  navigate: () => {},
});

function getPath() {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname || '/';
}

function normalizePath(path) {
  if (!path) return '/';
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

function BrowserRouter({ children }) {
  const [path, setPath] = React.useState(getPath);

  const navigate = React.useCallback((to) => {
    if (!to || typeof window === 'undefined') return;
    window.history.pushState({}, '', to);
    setPath(getPath());
  }, []);

  React.useEffect(() => {
    const onPopState = () => setPath(getPath());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return React.createElement(
    RouterContext.Provider,
    { value: { path, navigate } },
    children
  );
}

function Routes({ children }) {
  const { path } = React.useContext(RouterContext);
  const currentPath = normalizePath(path);
  const routes = React.Children.toArray(children);
  const match =
    routes.find((route) => normalizePath(route.props.path) === currentPath) ||
    routes.find((route) => route.props.path === '*') ||
    routes[0];

  return match ? match.props.element : null;
}

function Route() {
  return null;
}

function Link({ children, to, ...props }) {
  const { navigate } = React.useContext(RouterContext);

  function onClick(event) {
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();
    navigate(to);
  }

  return React.createElement('a', { href: to, onClick, ...props }, children);
}

// Minimal router fallback for the app and unit tests.
module.exports = {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate: () => React.useContext(RouterContext).navigate,
};

