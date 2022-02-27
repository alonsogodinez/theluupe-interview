import React, { createContext, PropsWithChildren, useContext } from 'react';
import { IUser } from '@dal/User';
import { GetMyUser } from '@lib/gql/queries.gql';
import { useQuery } from "@apollo/react-hooks";

export const AuthStateContext = createContext<Partial<IUser> | null>(null);
export const AuthLoadingStateContext = createContext<boolean>(true);

export function AuthProvider({ children }: PropsWithChildren<unknown>) {
  const { data, loading } = useQuery(GetMyUser, { ssr: false });
  const user = data?.myUser;
  return (
    <AuthStateContext.Provider value={user || null}>
      <AuthLoadingStateContext.Provider value={loading}>{children}</AuthLoadingStateContext.Provider>
    </AuthStateContext.Provider>
  );
}

export function withAuthProvider(PageComponent: React.FC) {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return function AuthWrapper({ ...pageProps }) {
    return (
      <AuthProvider>
        <PageComponent {...pageProps} />
      </AuthProvider>
    );
  };
}

export function useAuthState() {
  const user = useContext(AuthStateContext);
  const loading = useContext(AuthLoadingStateContext);
  if (typeof user === 'undefined' || typeof loading === 'undefined') {
    throw missingProviderError('useAuthState');
  }
  return { user, loading };
}

export const missingProviderError = (hook: string): Error => new Error(`${hook} must be used within a AuthProvider`);
