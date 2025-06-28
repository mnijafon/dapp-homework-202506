import Loading from '@components/common/Loading';
import PageNotFoundView from '@components/common/PageNotFoundView';
import MainLayout from '@/layouts/Layout';
import AIChat from '@pages/AIChat';
import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

const Layout = () => (
    <Suspense fallback={<Loading />}>
        <MainLayout />
    </Suspense>
);

const Homework0614 = lazy(() => import('@pages/Homework0614'));

const Routes: RouteObject[] = [];

const mainRoutes = {
    path: '/',
    element: <Layout />,
    children: [
        { path: '*', element: <PageNotFoundView /> },
        { path: '/0614', element: <Homework0614 /> },
        { path: '/chat', element: <AIChat /> },
        { path: '404', element: <PageNotFoundView /> },
    ],
};

Routes.push(mainRoutes);

export default Routes;
