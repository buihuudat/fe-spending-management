import { useState } from 'react';

import { Box, Button, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';

import authApi from '../api/authApi';

const Login = () => {
  document.title = 'Login | Spending App'
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [usernameErrText, setUsernameErrText] = useState('');
  const [passwordErrText, setPasswordErrText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernameErrText('');
    setPasswordErrText('');

    const data = new FormData(e.target);
    const username = data.get('username').trim().toLowerCase();
    const password = data.get('password').trim();

    let err = false;

    if (username === '') {
      err = true;
      setUsernameErrText('Please fill in this field')
    }
    if (password === '') {
      err = true;
      setPasswordErrText('Please fill in this field')
    }

    if (err) return;

    setLoading(true);

    try {
      const resAuth = await authApi.login({ username, password });

      setLoading(false);
      localStorage.setItem('token', resAuth.token);
      navigate('/');
    } catch (error) {
      const errors = error.data.errors;
      errors.forEach(e => {
        if (e.param === 'username') {
          setUsernameErrText(e.msg);
        }
        if (e.param === 'password') {
          setPasswordErrText(e.msg);
        }
      })
      setLoading(false);
    }
  }

  return (
    <Box mt={4}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center'
    }}>
      <Box component={'h1'}>Login</Box>
      <Box
        component='form'
        mt={1}
        noValidate
        onSubmit={handleSubmit}
      >
        <TextField
          fullWidth
          margin='normal'
          id='username'
          name='username'
          label='Username'
          disabled={loading}
          error={usernameErrText !== ''}
          helperText={usernameErrText}
        />
        <TextField
          fullWidth
          type={'password'}
          margin='normal'
          id='password'
          name='password'
          label='Password'
          disabled={loading}
          error={passwordErrText !== ''}
          helperText={passwordErrText}
        />
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant='outlined'
          fullWidth
          color='success'
          type='submit'
          loading={loading}
        >Login</LoadingButton>
      </Box>
      <Button
        component={Link}
        to='/signup'
        sx={{ textTransform: 'none' }}
      >
        Don't have an account? signup
      </Button>
    </Box>
  )
}

export default Login