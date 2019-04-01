import { FirebaseApp } from '../firebase'
import { auth } from 'firebase';
import 'firebase/auth';

import { from } from 'rxjs'

// เวลา Invoke ใช้ท่านี้นะ

/*

RegisterWithEmail('holy-wisdom@hotmail.com','123456').subscribe({
    next:(res) => {(console.log(res))},
    error:(err) => {(console.log(err))},
    complete:() => {}
})

*/

export const RegisterWithEmail = (Email,Password) => {
    return from(FirebaseApp.auth().createUserWithEmailAndPassword(Email, Password))
}