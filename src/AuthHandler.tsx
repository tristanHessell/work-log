import React from "react";
import { useFirebaseAuth } from "./useFirebaseAuth";

const UserContext = React.createContext<firebase.User | null>(null);

interface Props {
  children: React.ReactNode;
}

export const AuthHandler: React.FC<Props> = ({ children }) => {
  const [user, finishedChecking] = useFirebaseAuth();

  // This is here as otherwise the app flashes to the sign in screen.
  // This gives the firebase code time to collect any stored credentials
  if (!finishedChecking) {
    return null;
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
