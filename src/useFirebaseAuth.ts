import { useState, useEffect } from "react";
import { firebase, auth } from "./firebase";

export function useFirebaseAuth(): [firebase.User | null, boolean] {
  const [user, setUser] = useState<firebase.User | null>(auth.currentUser);
  const [initialAuthStateLoaded, setInitialAuthStateLoaded] = useState(false);

  useEffect(() => {
    // onAuthStateChanged is called once after firebase checks the for the existing
    // credentials - even if there area none
    const unregisterListener = auth.onAuthStateChanged((newUser) => {
      setInitialAuthStateLoaded(true);
      setUser(newUser);
    });

    return (): void => {
      unregisterListener();
    };
  }, []);

  return [user, initialAuthStateLoaded];
}
