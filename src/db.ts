import { db } from "./firebase";

export async function saveItem(
  documentIdentifier: string,
  item: Record<string, any>
): Promise<void> {
  try {
    await db.doc(documentIdentifier).set(item);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getItems<T>(collectionIdentifier: string): Promise<T[]> {
  try {
    const snapshot = await db.collection(collectionIdentifier).get();
    return snapshot.docs.map((doc) => doc.data() as T);
  } catch (err) {
    console.log("fetch error");
    throw err;
  }
}

export async function deleteItem(documentIdentifier: string): Promise<void> {
  try {
    await db.doc(documentIdentifier).delete();
  } catch (err) {
    console.log("delete error");
    throw err;
  }
}
