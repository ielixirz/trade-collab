import { FirebaseApp } from '../firebase'
import { authState, user } from 'rxfire/auth'
import { auth } from 'firebase';
import 'firebase/auth';

import { LoginWithEmail } from './login' 

import { from, Observable, throwError } from 'rxjs'
import { tap, map, filter } from 'rxjs/operators'

// Example invoke

/*

VerificationEmail().subscribe({
  next:() => {(console.log('Email sended'))},
  error:(err) => {(console.log(err))},
  complete:() => {}
})

*/

export const VerificationEmail = () => {

    return user(FirebaseApp.auth()).pipe(
        map(AuthStage => {
            if(!AuthStage.emailVerified) {
                return from(AuthStage.sendEmailVerification())
            }
            else { return throwError("Email Verified") }
        })
    )
}

/*

AuthStage().subscribe(user => {
    name = user.displayName;
    email = user.email;
    photoUrl = user.photoURL;
    emailVerified = user.emailVerified;
    uid = user.uid;
})

*/

export const AuthStage = () => {
    return user(FirebaseApp.auth())
}

export const UpdatePassword = (Email,Password,NewPassword) => {
    return LoginWithEmail(Email,Password).pipe(
        map( User => User.user),
        tap(UserInfo => from(UserInfo.updatePassword(NewPassword)))
    )
}

export const UpdateEmail = (Email,Password,NewEmail) => {
    return LoginWithEmail(Email,Password).pipe(
        map( User => User.user),
        tap(UserInfo => from(UserInfo.updateEmail(NewEmail)))
    )
}