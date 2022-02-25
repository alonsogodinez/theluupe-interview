import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { Button } from 'react-bootstrap';

import { IPost } from '@dal/Post';

import { Table } from '@molecules/Table';
import { AddPostModal } from '@organisms/AddPostModal';

type IPostManagerProps = {
  posts: IPost[];
};

const columns = [
  { Header: 'Title', accessor: 'title' },
  { Header: 'Content', accessor: 'content' },
  { Header: 'Author', accessor: 'author.fullName' },
];

export function PostsManager({ posts }: IPostManagerProps): JSX.Element {
  const [showPostModal, setShowPostModal] = useState(false);

  const postModalOnOpenHandler = useCallback(() => setShowPostModal(true), [setShowPostModal]);
  const postModalOnCloseHandler = useCallback(() => setShowPostModal(false), [setShowPostModal]);
  return (
    <>
      <CustomButton variant="link" onClick={postModalOnOpenHandler}>
        Add Post
      </CustomButton>

      <Table data={posts} columns={columns} />
      <AddPostModal show={showPostModal} onClose={postModalOnCloseHandler} />
    </>
  );
}

const CustomButton = styled(Button)`
  padding: 0;
  font-size: 14px;
  line-height: 21px;
  display: block;
  text-align: left;
`;
