import React from 'react';
import DefaultLayout from './containers/DefaultLayout';
const Dashboard = React.lazy(() => import('./views/Dashboard'));

const Chat = React.lazy(() => import('./views/Chat/Chat'));
const Shipment = React.lazy(() => import('./views/Shipment/Shipment'));
const MockData = React.lazy(() => import('./views/MockData/MockData'));
const TestService = React.lazy(() => import('./views/TestService/TestService'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/chat', name: 'chat', component: Chat },
  { path: '/shipment', name: 'shipment', component: Shipment },
  { path: '/mockdata', name: 'mockdata', component: MockData },
  { path: '/testservice', name: 'testservice', component: TestService }
];

export default routes;
