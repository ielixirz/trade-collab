/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
import { IsExistInvitation } from './invite';
import { IsExistRequest } from './request';

export const CombineIsExistInvitationRequest = (UserKey, CompanyKey) => IsExistInvitation(UserKey, CompanyKey) || IsExistRequest(UserKey, CompanyKey);
