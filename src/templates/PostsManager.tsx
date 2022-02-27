import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { Button } from 'react-bootstrap';
import { useMutation } from '@apollo/react-hooks';
import { DeleteOnePost } from '@lib/gql/mutations.gql';
import { IPost } from '@dal/Post';

import { Table } from '@molecules/Table';
import { AddPostModal } from '@organisms/AddPostModal';
import { EditPostModal } from '@organisms/EditPostModal';
import { DeleteModal } from '@organisms/DeleteModal';
import { useAuthState } from '@molecules/AuthProvider';

type IPostManagerProps = {
  posts: IPost[];
};

export function PostsManager({ posts }: IPostManagerProps): JSX.Element {
  const { user } = useAuthState();
  const [showCreatePostModal, setCreateShowPostModal] = useState(false);
  const [showEditPostModal, setEditShowPostModal] = useState(false);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Partial<IPost>>({});
  const [deleteOnePost] = useMutation(DeleteOnePost);

  const createPostModalOnOpenHandler = useCallback(() => setCreateShowPostModal(true), []);
  const createPostModalOnCloseHandler = useCallback(() => setCreateShowPostModal(false), []);

  const editPostModalOnOpenHandler = useCallback(
    (post: IPost) => () => {
      setSelectedPost(post);
      setEditShowPostModal(true);
    },
    [],
  );
  const editPostModalOnCloseHandler = useCallback(() => setEditShowPostModal(false), []);

  const deletePostModalOnOpenHandler = useCallback(
    (post: IPost) => () => {
      setSelectedPost(post);
      setShowDeletePostModal(true);
    },
    [],
  );
  const deletePostModalOnCloseHandler = useCallback(() => setShowDeletePostModal(false), [setShowDeletePostModal]);

  const handleDeletePost = useCallback(async () => {
    await deleteOnePost({
      variables: {
        where: {
          id: selectedPost?.id,
        },
      },
      refetchQueries: ['GetPosts'],
    });
    deletePostModalOnCloseHandler();
  }, [selectedPost, deleteOnePost, deletePostModalOnCloseHandler]);

  const columns = [
    { Header: 'Title', accessor: 'title' },
    { Header: 'Content', accessor: 'content' },
    { Header: 'Author', accessor: 'author.fullName' },
    {
      Header: 'Actions',
      Cell: ({ row }) => {
        return user?.id === row.original.author.id ? (
          <>
            <Button className="mr-2" variant="outline-primary" onClick={editPostModalOnOpenHandler(row.original)}>
              Edit
            </Button>
            <Button variant="outline-danger" onClick={deletePostModalOnOpenHandler(row.original)}>
              Delete
            </Button>
          </>
        ) : (
          <span> - </span>
        );
      },
    },
  ];

  return (
    <>
      <CustomButton variant="link" onClick={createPostModalOnOpenHandler}>
        Add Post
      </CustomButton>

      <Table data={posts} columns={columns} />
      <AddPostModal show={showCreatePostModal} onClose={createPostModalOnCloseHandler} />
      <EditPostModal show={showEditPostModal} onClose={editPostModalOnCloseHandler} initialValues={selectedPost} />
      <DeleteModal
        isLoading={false}
        show={showDeletePostModal}
        text={selectedPost?.title}
        onConfirm={handleDeletePost}
        onClose={deletePostModalOnCloseHandler}
      />
    </>
  );
}

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
`;
const CustomButton = styled(Button)`
  padding: 0;
  font-size: 14px;
  line-height: 21px;
  display: block;
  text-align: left;
`;
