import * as yup from 'yup';

export const User = yup.object().shape({
  firstName: yup.string().required('Please enter your first name.'),
  lastName: yup.string().required('Please enter your last name.'),
  email: yup.string().email('Please enter a valid email address.'),
});


export const AuthUser = yup.object().shape({
  email: yup.string().required('Please enter your email'),
  password: yup
    .string()
    .required('Please enter your password')
    .min(8, 'Password is too short - should be 8 chars minimum.'),
  password2: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
});

export const Post = yup.object().shape({
  title: yup.string().required('Please enter a title.'),
  content: yup.string().required('Please enter the content.'),
});
