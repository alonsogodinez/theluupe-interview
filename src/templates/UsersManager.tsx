import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { Button } from 'react-bootstrap';


import { IUser } from '@dal/User';

import { Table } from '@molecules/Table';
import { AddUserModal } from '@organisms/AddUserModal';

type IUsersManagerProps = {
  users: IUser[];
};

const columns = [
  { Header: 'Email', accessor: 'email' },
  { Header: 'FullName', accessor: 'fullName' },
  { Header: 'Total Posts', accessor: 'totalPosts' },
];

export function UsersManager({ users }: IUsersManagerProps): JSX.Element {
  const [showUserModal, setShowUserModal] = useState(false);

  const userModalOnCloseHandler = useCallback(() => setShowUserModal(false), [setShowUserModal]);
  const userModalOnOpenHandler = useCallback(() => setShowUserModal(true), [setShowUserModal]);

  return (
    <>
      <CustomButton variant="link" onClick={userModalOnOpenHandler}>
        Add User
      </CustomButton>

      <Table data={users} columns={columns} />

      <AddUserModal show={showUserModal} onClose={userModalOnCloseHandler} />
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
