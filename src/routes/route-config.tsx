import React from 'react';

import Dashboard from '@/pages/dashboard';
import CardMaintenance from '@/pages/card-maintenance';
import CardDetails from '@/pages/card-details';
import NotFound from '@/pages/not-found';

interface RouteConfig {
  path: string;
  element: React.ReactElement;
  label: string;
}

/**
 * Centralized route configuration.
 *
 * Add new routes here — AppRouter will render them automatically.
 * Each route needs a path, element, and label.
 */
export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <Dashboard />,
    label: 'Dashboard',
  },
  {
    path: '/manage/card-maintenance',
    element: <CardMaintenance />,
    label: 'Card Maintenance',
  },
  {
    path: '/manage/card-maintenance/:id',
    element: <CardDetails />,
    label: 'Card Details',
  },
  {
    path: '*',
    element: <NotFound />,
    label: '404 Not Found',
  },
  // Add more routes here:
  // {
  //   path: '/about',
  //   element: <AboutPage />,
  //   label: 'About',
  // },
];
