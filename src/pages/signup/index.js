import React from 'react';
import { PublicLayout } from '@templates/Layout';
import { SignUpTemplate } from '@templates/SignUpTemplate';
import { withApollo } from "@lib/apollo";
import { withAuthProvider } from "@molecules/AuthProvider";

function SignUp() {
  return (
    <PublicLayout loading={false}>
      <SignUpTemplate />
    </PublicLayout>
  );
}

// eslint-disable-next-line import/no-default-export
export default withApollo(withAuthProvider(SignUp));
