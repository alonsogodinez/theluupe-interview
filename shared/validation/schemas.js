import * as yup from 'yup';

export const User = yup.object().shape({
  firstName: yup.string().required('Please enter your first name.'),
  lastName: yup.string().required('Please enter your last name.'),
  email: yup.string().email('Please enter a valid email address.'),
});

export const Post = yup.object().shape({
  title: yup.string().required('Please enter a title.'),
  content: yup.string().required('Please enter the content.'),
});
