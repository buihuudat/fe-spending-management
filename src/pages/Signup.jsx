import { useState } from 'react';
import { Box, Button, TextField, Alert, AlertTitle } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import authApi from '../api/authApi';

const Signup = () => {
  document.title = 'Signup | Spending App'
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState(false);
  const [ fullnameErrText, setFullnameErrText ] = useState('');
  const [ phoneErrText, setPhoneErrText ] = useState('');
  const [ usernameErrText, setUsernameErrText ] = useState('');
  const [ passwordErrText, setPasswordErrText ] = useState('');
  const [ confirmPasswordErrText, setConfirmPasswordErrText ] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault()

    setUsernameErrText('');
    setFullnameErrText('');
    setPhoneErrText('');
    setPasswordErrText('');
    setConfirmPasswordErrText('');

    const data = new FormData(e.target);
    const fullname = data.get('fullname').trim();
    const phone = data.get('phone').trim();
    const username = data.get('username').trim().toLowerCase();
    const password = data.get('password').trim();
    const confirmPassword = data.get('confirmPassword').trim();
    let err = false;

    if (fullname === '') {
      err = true;
      setFullnameErrText('Please fill in this feild');
    }
    if (phone === '') {
      err = true;
      setPhoneErrText('Please fill in this feild');
    }
    if (username === '') {
      err = true;
      setUsernameErrText('Please fill in this feild');
    }
    if (password === '') {
      err = true;
      setPasswordErrText('Please fill in this feild');
    }
    if (confirmPassword === '') {
      err = true;
      setConfirmPasswordErrText('Please fill in this feild');
    }
    if (password !== confirmPassword) {
      err = true;
      setConfirmPasswordErrText("Confirm password not match")
    }

    if (err) return;

    setLoading(true);

    try {
      const res = await authApi.signup({
        fullname, phone, username, password, confirmPassword
      });
      setLogin(true);
      setLoading(false);
      setTimeout(() => {
        navigate('/login');
      }, 1000)
    } catch (error) {
      const errors = error.data.errors;
      errors.forEach(e => {
        if (e.param === 'fullname') {
          setFullnameErrText(e.msg);
        }
        if (e.param === 'phone') {
          setPhoneErrText(e.msg);
        }
        if (e.param === 'username') {
          setUsernameErrText(e.msg);
        }
        if (e.param === 'password') {
          setPasswordErrText(e.msg);
        }
        if (e.param === 'confirmPassword') {
          setConfirmPasswordErrText(e.msg);
        }
      })
      setLoading(false);
    }
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center'
    }}
    mt={4}>
      {login ? (
        <Alert severity="success" variant='filled' sx={{
          position: 'absolute',
          right: 2,
          top: 2
        }}>
          <AlertTitle>Success</AlertTitle>
          Signup successfully — <strong>Login now!</strong>
        </Alert>
      ): ('')}

      <Box component={'h1'}>Signup</Box>
      <Box
        component='form'
        mt={1}
        noValidate
        onSubmit={handleSubmit}
      >
        <TextField 
          margin='normal'
          required
          fullWidth
          id='fullname'
          label='Fullname'
          name='fullname'
          disabled={loading}
          error={fullnameErrText !== ''}
          helperText={fullnameErrText}
        />
        <TextField 
          margin='normal'
          required
          fullWidth
          id='phone'
          label='Phone'
          name='phone'
          disabled={loading}
          error={phoneErrText !== ''}
          helperText={phoneErrText}
        />
        <TextField 
          margin='normal'
          required
          fullWidth
          id='username'
          label='Username'
          name='username'
          disabled={loading}
          error={usernameErrText !== ''}
          helperText={usernameErrText}
        />
        <TextField 
          type={'password'}
          margin='normal'
          required
          fullWidth
          id='password'
          label='Password'
          name='password'
          disabled={loading}
          error={passwordErrText !== ''}
          helperText={passwordErrText}
        />
        <TextField 
          margin='normal'
          type={'password'}
          required
          fullWidth
          id='confirmPassword'
          label='Confirm Password'
          name='confirmPassword'
          disabled={loading}
          error={confirmPasswordErrText !== ''}
          helperText={confirmPasswordErrText}
        />
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant='outlined'
          fullWidth
          color='success'
          type='submit'
          loading={loading}
        >
          Signup
        </LoadingButton>
        <Button
          component={Link}
          to='/login'
          sx={{ textTransform: 'none' }}
        >
          Already have an account? Login
        </Button>
      </Box>
    </Box>
  )
}

export default Signup