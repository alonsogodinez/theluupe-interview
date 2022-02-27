import React, { useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useMutation } from '@apollo/react-hooks';

import { IPost } from '@dal/Post';
import { Post as PostSchema } from '@shared/validation/schemas';
import { CreateOnePost } from '@lib/gql/mutations.gql';

import { ColGroup, Form, Formik, Row } from '@atoms/Form';
import { ModalHeader } from '@molecules/ModalHeader';
import { SubmitButton } from '@molecules/forms/SubmitButton';
import { TextField } from '@molecules/forms/TextField';
import { useAuthState } from '@molecules/AuthProvider';

export type IAddPostModalProps = {
  show: boolean;
  onClose: () => void;
};

export function AddPostModal({ show, onClose }: IAddPostModalProps): JSX.Element {
  const { user } = useAuthState();
  const [createOnePost] = useMutation(CreateOnePost);
  const initialValues = {};

  const handleSubmit = useCallback(
    async (post: Partial<IPost>) => {
      const createResults = await createOnePost({
        variables: {
          data: {
            ...post,
            author: {
              connect: {
                id: user?.id,
              },
            },
          },
        },
        refetchQueries: ['GetPosts', 'GetUserPosts'],
      });
      onClose();
      return createResults;
    },
    [onClose, createOnePost, user],
  );

  return (
    <Modal show={show} centered onHide={onClose}>
      <ModalHeader title="Add a post" onClose={onClose} />
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={PostSchema}>
        {({ isSubmitting }) => (
          <Form>
            <Modal.Body>
              <Row>
                <ColGroup>
                  <TextField label="Title" name="title" />
                </ColGroup>
              </Row>
              <Row>
                <ColGroup>
                  <TextField multiline label="Content" name="content" />
                </ColGroup>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <SubmitButton>Add</SubmitButton>
              <Button disabled={isSubmitting} variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
