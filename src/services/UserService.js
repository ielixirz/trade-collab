import { collectionData } from 'rxfire/firestore';
import { tap } from 'rxjs/operators';
import firebaseApp from '../utils/firebase';

const userRef = firebaseApp.firestore().collection('User');
