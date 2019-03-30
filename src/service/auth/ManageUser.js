import { FirebaseApp } from '../firebase'
import { authState, user } from 'rxfire/auth'
import { auth } from 'firebase';
import 'firebase/auth';
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

    const User = user(FirebaseApp.auth())

    return User.pipe(
        map(AuthStage => {
            if(!AuthStage.emailVerified) {
                return from(AuthStage.sendEmailVerification())
            }
            else { return throwError("Email Verified") }
        })
    )
}