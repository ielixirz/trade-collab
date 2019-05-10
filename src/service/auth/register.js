import { map, tap } from 'rxjs/operators';
import { from } from 'rxjs';
import 'firebase/auth';
// eslint-disable-next-line no-unused-vars
import { auth } from 'firebase';
import { FirebaseApp } from '../firebase';

import { UpdateUserInfo } from '../user/user';
import { CreateProfile } from '../user/profile';

// เวลา Invoke ใช้ท่านี้นะ

/*

RegisterWithEmail('holy-wisdom@hotmail.com','123456').subscribe({
    next:(res) => {(console.log(res))},
    error:(err) => {(console.log(err))},
    complete:() => {}
})

*/

export const RegisterWithEmail = (Email, Password) => from(FirebaseApp.auth().createUserWithEmailAndPassword(Email, Password));

export const RegisterUser = (Data) => {
  console.log('check data', Data);
  const {
    Email, Password, Firstname, Surname, AccountType,
  } = Data;

  const UserInfoData = {
    UserInfoEmail: Email,
    UserInfoAccountType: AccountType,
  };

  const ProfileData = {
    ProfileFirstname: Firstname,
    ProfileSurname: Surname,
    ProfileEmail: Email,
  };

  return RegisterWithEmail(Email, Password).pipe(
    map(RegisterSnapshot => RegisterSnapshot.user.uid),
    tap((uid) => {
      UpdateUserInfo(uid, UserInfoData);
      CreateProfile(uid, ProfileData);
    }),
  );
};
