import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { withApollo } from '@lib/apollo';
import { GetUsers } from '@lib/gql/queries.gql';

import { PublicLayout } from '@templates/Layout';
import { UsersManager } from '@templates/UsersManager';
import { withAuthProvider } from "@molecules/AuthProvider";

function Users() {
  const { data, loading } = useQuery(GetUsers);
  const users = data?.users || [];

  return (
    <PublicLayout loading={loading}>
      <UsersManager users={users} />
    </PublicLayout>
  );
}

// eslint-disable-next-line import/no-default-export
export default withApollo(withAuthProvider(Users));
