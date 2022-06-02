import { RouteConfig } from 'react-router-config';
import BasicLayout from '@/layout/BasicLayout';
import DashboardLayout from '@/layout/DashboardLayout';
import PreviewLayout from '@/layout/PreviewLayout';
import Editor from '@/pages/Editor';
import Preview from '@/pages/Preview';
import Welcome from '@/pages/Welcome';

const routes: RouteConfig[] = [
  {
    component: BasicLayout,
    routes: [
      {
        path: '/',
        exact: true,
        component: Welcome,
      },
      {
        name: "首页",
        path: "/welcome",
        component: Welcome,
      }
    ]
  },
  {
    path: '/editor/:spaceId/:id',
    component: DashboardLayout,
    routes: [
      {
        name: "编辑仪表盘",
        path: "/editor/:spaceId/:id",
        exact: true,
        component: Editor,
      },
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
];

export default routes.reverse();
