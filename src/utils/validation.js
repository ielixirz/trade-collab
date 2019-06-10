const VALID_EMAIL_REGEX = RegExp(
  "^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
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
