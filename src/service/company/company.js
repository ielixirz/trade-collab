import { collection, doc } from 'rxfire/firestore';
import { from } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { FirebaseApp } from '../firebase';

const CompanyRefPath = () => FirebaseApp.firestore().collection('Company');

const CompanyMemberRefPath = CompanyKey => FirebaseApp.firestore()
  .collection('Company')
  .doc(CompanyKey)
  .collection('CompanyMember');

/* Example CreateCompany
    {
        CompanyName (string)
        CompanyID (string) *(ID is not a key)
        CompanyImageLink (string)
        CompanyTelNumber (string)
        CompanyAddress (string)
        CompanyWebsiteUrl (string)
        CompanyEmail (string)
        CompanyAboutUs (string)
    }
*/

export const CreateCompany = Data => from(CompanyRefPath().add(Data));

export const UpdateCompany = (CompanyKey, Data) => from(
  CompanyRefPath()
    .doc(CompanyKey)
    .set(Data, { merge: true }),
);

export const GetCompanyDetail = CompanyKey => doc(CompanyRefPath().doc(CompanyKey));

export const CheckAvaliableCompanyName = CompanyName => collection(CompanyRefPath().where('CompanyName', '==', CompanyName)).pipe(take(1));

export const SetCompanyID = (CompanyKey, CompanyID) => from(
  CompanyRefPath()
    .doc(CompanyKey)
    .set({ CompanyID }, { merge: true }),
);

export const SetCompanyImageLink = (CompanyKey, CompanyImageLink) => from(
  CompanyRefPath()
    .doc(CompanyKey)
    .set({ CompanyImageLink }, { merge: true }),
);

// eslint-disable-next-line max-len
export const IsCompanyMember = (CompanyKey, UserKey) => doc(CompanyMemberRefPath(CompanyKey).doc(UserKey)).pipe(
  take(1),
  map(Result => !!Result.data()),
);

export const GetCompanyMember = CompanyKey => collection(CompanyMemberRefPath(CompanyKey));
