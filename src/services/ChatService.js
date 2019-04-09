import firebaseApp from '../utils/firebase';
import { collectionData } from 'rxfire/firestore';
import { tap } from 'rxjs/operators';

const chatRef = firebaseApp.firestore().collection('Chat');
