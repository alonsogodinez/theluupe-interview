import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';

import { withApollo } from '@lib/apollo';
import { GetUserPosts } from '@lib/gql/queries.gql';

import { PublicLayout } from '@templates/Layout';
import { PostsManager } from '@templates/PostsManager';
import { withAuthProvider } from "@molecules/AuthProvider";

function UserPosts() {
  const router = useRouter();
  const { userId } = router.query;
  const { data, loading } = useQuery(GetUserPosts, { variables: { authorId: userId } });
  const posts = data?.userPosts || [];
  return (
    <PublicLayout loading={loading}>
      <PostsManager posts={posts} />
    </PublicLayout>
  );
}

// eslint-disable-next-line import/no-default-export
export default withApollo(withAuthProvider(UserPosts));
