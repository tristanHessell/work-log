import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/database';

firebase.initializeApp({
  apiKey: 'AIzaSyCO9y5bbOPzmgPypyjwS5HkogHwd0iRHvU',
  authDomain: 'totemic-polygon-291511.firebaseapp.com',
  projectId: 'totemic-polygon-291511',
});

const db = firebase.firestore();
db.collection('');

export async function saveItem (collection: string, item: Record<string, any>): Promise<void> {
  try {
    await db.collection(collection).add(item);
  }
  catch (err) {
    // TODO
  }
}

export async function getItems<T> (collection: string): Promise<T[]> {
  const snapshot = await db.collection(collection).get();
  return snapshot.docs.map((doc) => doc.data() as T);
}

