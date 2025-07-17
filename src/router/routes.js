const routes = [
  {
    path: '/',
    component: () => import('layouts/StartLayout.vue'),
    children: [
      {
        path: '',
        redirect: 'start', // This line redirects / to /start
      },
      {
        path: 'start',
        component: () => import('pages/StartMenu.vue'),
      },
      {
        path: 'kiosk',
        component: () => import('pages/Viewing.vue'),
      },
      {
        path: 'website',
        component: () => import('pages/WebsiteView.vue'),
      },
    ],
  },
]
export default routes
