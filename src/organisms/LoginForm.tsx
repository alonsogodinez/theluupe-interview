import React, { useCallback } from 'react';
import fetch from 'isomorphic-unfetch';
import { TextField } from '@molecules/forms/TextField';
import { useApolloClient } from '@apollo/react-hooks';
import { Formik, Form } from '@atoms/Form';
import { IUser } from '@dal/User';
import { SubmitButton } from '@molecules/forms/SubmitButton';
import { useRouter } from 'next/router';

export function LoginForm() {
  const apolloClient = useApolloClient();
  const router = useRouter();
  const handleSubmit = useCallback(
    async ({ email, password = '' }: Partial<IUser>) => {
      try {
        const result = await fetch('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });
        await Promise.all([apolloClient.reFetchObservableQueries(), router.push('/posts')]);
      } catch (e) {}
    },
    [router, apolloClient],
  );
  return (
    <Formik onSubmit={handleSubmit} initialValues={{}}>
      {({ isSubmitting }) => (
        <Form>
          <TextField label="Email" name="email" />
          <TextField type="password" label="Password" name="password" />
          <SubmitButton>Login</SubmitButton>
        </Form>
      )}
    </Formik>
  );
}
