import { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// Pipe Follow Module Pages
const SpoolFollowPage = lazy(
  () => import('src/pages/dashboard/construction/pipe-follow/spool-follow')
);

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/construction/pipe-follow/spool-follow" replace />,
      },
      {
        path: 'construction',
        children: [
          {
            path: 'pipe-follow',
            children: [
              { path: 'spool-follow', element: <SpoolFollowPage /> },
            ],
          },
        ],
      },
    ],
  },
]; 