const VALID_EMAIL_REGEX = RegExp(
  '^(([^<>()\\[\\]\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$',
);
export const isValidEmail = email => VALID_EMAIL_REGEX.test(email);

const VALID_NAME_REGEX = RegExp('\\(|!|@|\\*|&|%');
export const isValidName = name => !VALID_NAME_REGEX.test(name);

const VALID_COMPANY_NAME_REGEX = RegExp('[!@#$%^&*(),.?":{}|<>]');
export const isValidCompanyName = company => !VALID_COMPANY_NAME_REGEX.test(company);

const VALID_PASSWORD_REGEX = RegExp('^.{4,24}$');
export const isValidPassword = password => VALID_PASSWORD_REGEX.test(password);

const VALID_ROLE_NAME_REGEX = RegExp('[!@#$%^&*(),.?":{}|<>]');
export const isValidRoleName = role => !VALID_ROLE_NAME_REGEX.test(role);

export const isValidProfileImg = (file) => {
  if (file.type === 'image/png' || file.type === 'image/jpg') {
    return true;
  }
  return false;
};
