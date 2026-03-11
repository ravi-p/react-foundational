import React from 'react';

import { Routes, Route } from 'react-router-dom';

import { routes } from '@/routes/route-config';

/**
 * Application Router
 *
 * Renders all routes defined in route-config.ts.
 * Add new routes to route-config.ts, not here.
 */
const AppRouter: React.FC = () => {
  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export default AppRouter;
