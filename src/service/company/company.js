import { collection, doc } from 'rxfire/firestore';
import { from } from 'rxjs';
import { FirebaseApp } from '../firebase';

const CompanyRefPath = () => FirebaseApp.firestore().collection('Company');

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
