import React from 'react';
import { PublicLayout } from '@templates/Layout';
import { LoginTemplate } from '@templates/LoginTemplate';
import { withApollo } from '@lib/apollo';
import { withAuthProvider } from '@molecules/AuthProvider';

function Login() {
  return (
    <PublicLayout loading={false}>
      <LoginTemplate />
    </PublicLayout>
  );
}

// eslint-disable-next-line import/no-default-export
export default withApollo(withAuthProvider(Login));
