import React from 'react';
import { Redirect } from 'react-router-dom';

const Chat = React.lazy(() => import('./views/Chat/Chat'));
const Shipment = React.lazy(() => import('./views/Shipment/Shipment'));
const Network = React.lazy(() => import('./views/Network/Network'));
const MockData = React.lazy(() => import('./views/MockData/mockdata'));
const SelectProfile = React.lazy(() => import('./views/Pages/SelectProfile/SelectProfile'));
const TestService = React.lazy(() => import('./views/TestService/testservice'));
const Alert = React.lazy(() => import('./views/Alert/Alert'));

const validateAuth = (isProfileRequired, props, component) => {
  if (props.auth === undefined || Object.entries(props.auth).length === 0) {
    return <Redirect to="../login" />;
  }
  if (isProfileRequired) {
    if (props.currentProfile === undefined || Object.entries(props.currentProfile).length === 0) {
      return <Redirect to="../selectprofile" />;
    }
  }
  return component;
};

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  {
    path: '/chat/:shipmentkey',
    name: 'chat',
    component: Chat,
    validation: validateAuth,
    isProfileRequired: true,
  },
  {
    path: '/shipment',
    name: 'shipment',
    component: Shipment,
    validation: validateAuth,
    isProfileRequired: true,
  },
  {
    path: '/notification',
    name: 'notification',
    component: Alert,
    validation: validateAuth,
    isProfileRequired: true,
  },
  {
    path: '/network',
    name: 'network',
    component: Network,
    validation: validateAuth,
    isProfileRequired: true,
  },
  { path: '/mockdata', name: 'mockdata', component: MockData },
  { path: '/testservice', name: 'testservice', component: TestService },
  {
    path: '/selectprofile',
    name: 'selectprofile',
    component: SelectProfile,
    validation: validateAuth,
    isProfileRequired: false,
  },
];

export default routes;
