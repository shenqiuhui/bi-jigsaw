import { lazy } from 'react';
import { RouteConfig } from 'react-router-config';
import BasicLayout from '@/layout/BasicLayout';
import DashboardLayout from '@/layout/DashboardLayout';
import PreviewLayout from '@/layout/PreviewLayout';

const Home = lazy(() => import('@/pages/Home'));
const Preview = lazy(() => import('@/pages/Preview'));
const Editor = lazy(() => import('@/pages/Editor'));

const routes: RouteConfig[] = [
  {
    component: BasicLayout,
    routes: [
      {
        path: '/',
        exact: true,
        component: Home,
      },
      {
        name: "首页",
        path: "/welcome",
        component: Home,
      }
    ]
  },
  {
    path: '/preview/:spaceId/:pageId',
    component: PreviewLayout,
    routes: [
      {
        name: "分享预览",
        path: "/preview/:spaceId/:pageId",
        exact: true,
        component: Preview,
      },
    ]
  },
  {
    path: '/editor/:spaceId/:pageId',
    component: DashboardLayout,
    routes: [
      {
        name: "编辑仪表盘",
        path: "/editor/:spaceId/:pageId",
        exact: true,
        component: Editor,
      },
    ]
  }
];

export default routes.reverse();
