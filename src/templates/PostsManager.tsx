import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { Button } from 'react-bootstrap';
import { useMutation } from '@apollo/react-hooks';
import { DeleteOnePost } from '@lib/gql/mutations.gql';
import { IPost } from '@dal/Post';

import { Table } from '@molecules/Table';
import { AddPostModal } from '@organisms/AddPostModal';
import { DeleteModal } from '@organisms/DeleteModal';

type IPostManagerProps = {
  posts: IPost[];
};

export function PostsManager({ posts }: IPostManagerProps): JSX.Element {
  const [showCreatePostModal, setCreateShowPostModal] = useState(false);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [deleteOnePost] = useMutation(DeleteOnePost);

  const createPostModalOnOpenHandler = useCallback(() => setCreateShowPostModal(true), [setCreateShowPostModal]);
  const createPostModalOnCloseHandler = useCallback(() => setCreateShowPostModal(false), [setCreateShowPostModal]);

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
      Cell: ({row}) => (
        <ActionButtonsContainer>
          <Button variant="secondary">Edit</Button>
          <Button onClick={deletePostModalOnOpenHandler(row.original)}>Delete</Button>
        </ActionButtonsContainer>
      ),
    },
  ];

  return (
    <>
      <CustomButton variant="link" onClick={createPostModalOnOpenHandler}>
        Add Post
      </CustomButton>

      <Table data={posts} columns={columns} />
      <AddPostModal show={showCreatePostModal} onClose={createPostModalOnCloseHandler} />
      <DeleteModal show={showDeletePostModal}  text={selectedPost?.title} onConfirm={handleDeletePost} onClose={deletePostModalOnCloseHandler} />
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
