import React, { useCallback } from 'react';
import fetch from "isomorphic-unfetch";
import { useApolloClient } from "@apollo/react-hooks";
import { useRouter } from 'next/router';
import { IUser } from '@dal/User';
import { Formik, Form } from '@atoms/Form';
import { TextField } from '@molecules/forms/TextField';
import { SubmitButton } from '@molecules/forms/SubmitButton';
import { AuthUser as AuthUserSchema } from '@shared/validation/schemas';
import { addNotification } from '@lib/notifications';

export function SignUpForm() {
  const apolloClient = useApolloClient();
  const router = useRouter();
  const handleSubmit = useCallback(
    async ({ email, password = '' }: Partial<IUser>) => {
      let result
      try {
        result = await fetch('/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        if (result.ok) {
          await Promise.all([apolloClient.reFetchObservableQueries(), router.push('/posts')]);
        } else {
          addNotification({ message: (await result.json()).message})
        }
      } catch (e) {}
    },
    [router, apolloClient],
  );
  return (
    <Formik onSubmit={handleSubmit} initialValues={{}} validationSchema={AuthUserSchema}>
      {({ isSubmitting }) => (
        <Form>
          <TextField label="Email" name="email" />
          <TextField type="password" label="Password" name="password" />
          <TextField type="password" label="Confirm Password" name="password2" />
          <SubmitButton>Sign up</SubmitButton>
        </Form>
      )}
    </Formik>
  );
}
