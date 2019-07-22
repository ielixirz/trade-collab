/* eslint-disable import/prefer-default-export */
export const TrimLongText = (longText, limit) => {
  if (longText.length > limit) {
    return `${longText.slice(0, limit)}...`;
  }
  return longText;
};
