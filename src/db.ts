import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';

firebase.initializeApp({
  apiKey: "AIzaSyCO9y5bbOPzmgPypyjwS5HkogHwd0iRHvU",
  authDomain: "totemic-polygon-291511.firebaseapp.com",
  databaseURL: "https://totemic-polygon-291511.firebaseio.com",
  projectId: "totemic-polygon-291511",
  storageBucket: "totemic-polygon-291511.appspot.com",
  messagingSenderId: "987927113868",
  appId: "1:987927113868:web:64e80b9823e9873c938ba9"
});

const db = firebase.firestore();

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

