import React, { Component, useContext, useReducer } from 'react';

import { useDispatch, useMappedState, useCallback } from 'redux-react-hook';

export function Chat() {
  const dispatch = useDispatch();
  const mapState = useCallback(state => ({
    ChatReducer: state.ChatReducer,
    user: state.authReducer.user
  }));
  const moveTab = useCallback(() =>
    dispatch({
      type: 'delete todo',
      index
    })
  );

  return <div />;
}
