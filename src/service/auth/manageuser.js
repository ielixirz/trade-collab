/* eslint-disable max-len */
// eslint-disable-next-line no-unused-vars
import { authState, user } from 'rxfire/auth';
// eslint-disable-next-line no-unused-vars
import { auth } from 'firebase';
/* eslint-enable no-alert, no-console */
import 'firebase/auth';
import { from, throwError } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { FirebaseApp } from '../firebase';
import { LoginWithEmail } from './login';

// Example invoke

/*

VerificationEmail().subscribe({
  next:() => {(console.log('Email sended'))},
  error:(err) => {(console.log(err))},
  complete:() => {}
})

*/

export const VerificationEmail = () => user(FirebaseApp.auth()).pipe(
  map((AuthStage) => {
    if (!AuthStage.emailVerified) {
      return from(AuthStage.sendEmailVerification());
    }
    return throwError('Email Verified');
  }),
);

/*

AuthStage().subscribe(user => {
    name = user.displayName;
    email = user.email;
    photoUrl = user.photoURL;
    emailVerified = user.emailVerified;
    uid = user.uid;
})

*/

export const AuthStage = () => user(FirebaseApp.auth());

export const UpdatePassword = (Email, Password, NewPassword) => LoginWithEmail(Email, Password).pipe(
  map(User => User.user),
  tap(UserInfo => from(UserInfo.updatePassword(NewPassword))),
);

export const UpdateEmail = (Email, Password, NewEmail) => LoginWithEmail(Email, Password).pipe(
  map(User => User.user),
  tap(UserInfo => from(UserInfo.updateEmail(NewEmail))),
);

export const ForgetPassword = NewEmail => from(FirebaseApp.auth().sendPasswordResetEmail(NewEmail));

export const VerifyPasswordResetCode = ActionCode => FirebaseApp.auth().verifyPasswordResetCode(ActionCode);

export const ConfirmPasswordReset = (ActionCode, NewPassword) => FirebaseApp.auth().confirmPasswordReset(ActionCode, NewPassword);
