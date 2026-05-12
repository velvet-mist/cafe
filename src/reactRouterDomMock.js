const React = require('react');

// Minimal mock to satisfy unit tests without exercising routing.
module.exports = {
  BrowserRouter: ({ children }) => React.createElement(React.Fragment, null, children),
  Routes: ({ children }) => React.createElement(React.Fragment, null, children),
  Route: ({ element }) => element || null,
  Link: ({ children, to }) => React.createElement('a', { href: to }, children),
  useNavigate: () => () => {},
};


