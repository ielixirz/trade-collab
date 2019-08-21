/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React from 'react';
import { DefaultToast, DefaultToastContainer } from 'react-toast-notifications';

export const ToteToastNotification = ({ children, ...props }) => (
  <DefaultToast {...props}>{children}</DefaultToast>
);

export const ToteToastNotificationContainer = ({ children, ...props }) => (
  <DefaultToastContainer
    {...props}
    autoDismiss
    style={{ zIndex: 1021, marginTop: 30, overflow: 'hidden' }}
  >
    {children}
  </DefaultToastContainer>
);
