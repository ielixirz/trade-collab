import {
  FILL_CREDENCIAL,
  SAVE_CREDENCIAL,
  TYPING_TEXT
} from '../constants/constants';

const INITIAL_STATE = {
  user: {},
  loginForm: {
    email: '',
    password: ''
  }
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TYPING_TEXT:
      return {
        ...state,
        text: action.text
      };
    case FILL_CREDENCIAL:
      return {
        ...state,
        loginForm: {
          ...state.loginForm,
          [action.payload]: action.value
        }
      };
    case SAVE_CREDENCIAL:
      return {
        ...state,
        user: action.payload
      };

    default:
      return state;
  }
};
