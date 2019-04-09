import firebaseApp from '../utils/firebase';
import { collectionData } from 'rxfire/firestore';
import { tap } from 'rxjs/operators';

const userRef = firebaseApp.firestore().collection('User');
