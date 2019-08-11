/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { IsExistInvitation } from './invite';
import { IsExistRequest } from './request';

export const CombineIsExistInvitationRequest = (UserKey, CompanyKey) =>
  combineLatest(IsExistInvitation(UserKey, CompanyKey), IsExistRequest(UserKey, CompanyKey)).pipe(
    map(Res => Res[0] || Res[1])
  );
