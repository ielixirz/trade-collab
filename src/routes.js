import React from 'react';

const Chat = React.lazy(() => import('./views/Chat/Chat'));
const Shipment = React.lazy(() => import('./views/Shipment/Shipment'));
const Network = React.lazy(() => import('./views/Network/Network'));
const MockData = React.lazy(() => import('./views/MockData/mockdata'));
const SelectProfile = React.lazy(() => import('./views/Pages/SelectProfile/SelectProfile'));
const TestService = React.lazy(() => import('./views/TestService/testservice'));
const Alert = React.lazy(() => import('./views/Alert/Alert'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/chat/:shipmentkey', name: 'chat', component: Chat },
  { path: '/shipment', name: 'shipment', component: Shipment },
  { path: '/notification', name: 'notification', component: Alert },
  { path: '/network', name: 'network', component: Network },
  { path: '/mockdata', name: 'mockdata', component: MockData },
  { path: '/testservice', name: 'testservice', component: TestService },
  { path: '/selectprofile', name: 'selectprofile', component: SelectProfile },
];

export default routes;
