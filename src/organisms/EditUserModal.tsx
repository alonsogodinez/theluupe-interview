import React, { useCallback, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { IUser } from '@dal/User';
import { User as UserSchema } from '@shared/validation/schemas';
import { UpdateOneUser } from '@lib/gql/mutations.gql';
import { GetUser } from '@lib/gql/queries.gql';

import { ColGroup, Form, Formik, Row } from '@atoms/Form';
import { ModalHeader } from '@molecules/ModalHeader';
import { SubmitButton } from '@molecules/forms/SubmitButton';
import { TextField } from '@molecules/forms/TextField';
import { useAuthState } from '@molecules/AuthProvider';
import { SectionLoader } from '@molecules/SectionLoader';

export type IEditUserModalProps = {
  show: boolean;
  onClose: () => void;
};

export function EditUserModal({ show, onClose }: IEditUserModalProps): JSX.Element {
  const { user } = useAuthState();
  const [updateOneUser] = useMutation(UpdateOneUser);
  const { data, loading } = useQuery(GetUser, { variables: { id: user?.id }, skip: !user });

  const handleSubmit = useCallback(
    async (editedUser: Partial<IUser>) => {
      const editResult = await updateOneUser({
        variables: {
          data: {
            firstName: {
              set: editedUser.firstName,
            },
            lastName: {
              set: editedUser.lastName,
            },
          },
          where: {
            id: editedUser.id,
          },
        },
        refetchQueries: ['GetMyUser', 'GetUser', 'GetMyUser'],
      });
      onClose();
      return editResult;
    },
    [onClose, updateOneUser],
  );

  return (
    <Modal show={show} centered onHide={onClose}>
      <ModalHeader title="Edit Your Information" onClose={onClose} />

      {loading ? (
        <SectionLoader />
      ) : (
        <Formik initialValues={{ ...data?.user }} onSubmit={handleSubmit} validationSchema={UserSchema}>
          {({ isSubmitting }) => (
            <Form>
              <Modal.Body>
                <Row>
                  <ColGroup>
                    <TextField disabled readonly label="Email" name="email" />
                  </ColGroup>
                </Row>
                <Row>
                  <ColGroup>
                    <TextField label="firstName" name="firstName" />
                  </ColGroup>
                </Row>
                <Row>
                  <ColGroup>
                    <TextField label="lastName" name="lastName" />
                  </ColGroup>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <SubmitButton>Edit</SubmitButton>
                <Button disabled={isSubmitting} variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      )}
    </Modal>
  );
}
