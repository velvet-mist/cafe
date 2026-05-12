// Jest/unit-test fallback.
// The repo’s Jest config is currently unable to resolve react-router-dom correctly.
// CRA will still use the real react-router-dom at build/start time.
export { BrowserRouter, Routes, Route, Link, useNavigate } from './reactRouterDomMock';

