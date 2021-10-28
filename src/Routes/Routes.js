import { lazy } from 'react';

const Routes = [
    {
        path: '/usermanager',
        component: lazy(() => import('../Components/Forms/UserManagement/a.1/ViewAllUsers')),
        exact: true
    },
    {
        path: 'users',
        component: lazy(() => import('components/Users')),
        exact: true
    }
];

export default Routes;