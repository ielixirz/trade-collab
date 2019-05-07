import { collection, doc } from 'rxfire/firestore';
import { from } from 'rxjs';
import { take } from 'rxjs/operators';

import { FirebaseApp } from '../firebase';

const CompanyRequestRefPath = CompanyKey => FirebaseApp.firestore()
  .collection('Company')
  .doc(CompanyKey)
  .collection('CompanyRequest');

const UserRequestRefPath = UserKey => FirebaseApp.firestore()
  .collection('User')
  .doc(UserKey)
  .collection('UserRequest');
