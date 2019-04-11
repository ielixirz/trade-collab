import { auth } from 'firebase';
import 'firebase/auth';
import { from } from 'rxjs';
import { FirebaseApp } from '../firebase';

// เวลา Invoke ใช้ท่านี้นะ

/*

LoginWithEmail('holy-wisdom@hotmail.com','123456').subscribe({
    next:(res) => {(console.log(res))},
    error:(err) => {(console.log(err))},
    complete:() => {}
})

*/

export const LoginWithEmail = (Email, Password) =>
  from(FirebaseApp.auth().signInWithEmailAndPassword(Email, Password));
