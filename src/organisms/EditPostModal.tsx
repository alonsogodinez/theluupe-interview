import React, { useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useMutation } from '@apollo/react-hooks';

import { IPost } from '@dal/Post';
import { Post as PostSchema } from '@shared/validation/schemas';
import { UpdateOnePost } from '@lib/gql/mutations.gql';

import { ColGroup, Form, Formik, Row } from '@atoms/Form';
import { ModalHeader } from '@molecules/ModalHeader';
import { SubmitButton } from '@molecules/forms/SubmitButton';
import { TextField } from '@molecules/forms/TextField';

export type IEditPostModalProps = {
  show: boolean;
  onClose: () => void;
  initialValues: Partial<IPost>;
};

export function EditPostModal({ show, initialValues, onClose }: IEditPostModalProps): JSX.Element {
  const [updateOnePost] = useMutation(UpdateOnePost);

  const handleSubmit = useCallback(
    async (post: Partial<IPost>) => {
      const editResult = await updateOnePost({
        variables: {
          data: {
            title: {
              set: post.title,
            },
            content: {
              set: post.content,
            },
          },
          where: {
            id: post.id,
          },
        },
        refetchQueries: ['GetPosts', 'GetUserPosts'],
      });
      onClose();
      return editResult;
    },
    [onClose, updateOnePost],
  );

  return (
    <Modal show={show} centered onHide={onClose}>
      <ModalHeader title="Edit a post" onClose={onClose} />
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
              <SubmitButton>Edit</SubmitButton>
              <Button className="mt-3" disabled={isSubmitting} variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
