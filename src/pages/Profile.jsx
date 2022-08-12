import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import FileBase64 from 'react-file-base64'; 
import { LoadingButton } from '@mui/lab';
import { Box, TextField, Avatar, Button } from '@mui/material';

import userApi from '../api/userApi';
import { setUser } from '../redux/reducers/userRedux';

const bg = require('../images/gif/bg-profile.gif')

const Profile = () => {
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [changeAvatar, setChangeAvatar] = useState(false);
  const [fullnameErrText, setFullnameErrText] = useState('');
  const [emailErrText, setEmailErrText] = useState('');
  const [phoneErrText, setPhoneErrText] = useState('');
  const [passwordErrText, setPasswordErrText] = useState('');
  const [confirmPasswordErrText, setConfirmPasswordErrText] = useState('');

  const { UID } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  document.title = `${user.fullname} | Spending App`;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const user = await userApi.getUser({ _id: UID });
        dispatch(setUser(user));
      } catch (error) {
        console.log(error);
      }
    }
    getUserData();
  }, [dispatch, loading, changeAvatar])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const fullname = data.get('fullname').trim();
    const email = data.get('email').trim().toLowerCase() || user.email;
    const phone = data.get('phone').trim();
    const password = data.get('password').trim();
    const confirmPassword = data.get('confirmPassword').trim();
    let err = false;

    if (!fullname) {
      err = true;
      setFullnameErrText('Please fill in this field');
    }
    if (!phone) {
      err = true;
      setPhoneErrText('Please fill in this field');
    }
    if (!password) {
      err = true;
      setPasswordErrText('Please fill in this field');
    }
    if (!confirmPassword) {
      err = true;
      setConfirmPasswordErrText('Please fill in this field');
    }
    if (password !== confirmPassword) {
      err = true;
      setConfirmPasswordErrText('ConfirmPassword not match');
    }

    if (err) return;

    setLoading(true);
    setFullnameErrText('');
    setPhoneErrText('');
    setPasswordErrText('');
    setConfirmPasswordErrText('');

    try {
      await userApi.updateUser({
        fullname, username: user.username, password, confirmPassword, phone, email
      });

      setLoading(false);
      setDisable(true);
    } catch (error) {
      const errors = error.data.errors;
      errors.map(e => {
        if (e.param === 'fullname') {
          setFullnameErrText(e.msg);
        }
        if (e.param === 'phone') {
          setPhoneErrText(e.msg);
        }
        if (e.param === 'password') {
          setPasswordErrText(e.msg);
        }
        if (e.param === 'confirmPassword') {
          setConfirmPasswordErrText(e.msg);
        }
        setLoading(false);
      })
    }
  }

  const handleCancel = () => {
    setDisable(!disable);
    setLoading(false);
  }

  const handleChangeAvatar = async (e) => {
    try {
      await userApi.updateUserImage({_id: user._id, image: e.base64});
      setChangeAvatar(false);
    } catch (error) {
      const errors = error.data.errors;
      errors.map(e => {
        alert(e)
      })
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      paddingTop: '2rem',
      // background: `url(${bg}) no-repeat center`,
      backgroundSize: 'auto'
    }}>
      <Box 
        onSubmit={handleSubmit}
        component='form' 
        mt={1}
        noValidate
        sx={{
          margin: '1rem auto',
          width: '500px',
          padding: '1.5rem 3rem',
          border: '2px solid #11568C',
          borderRadius: '10px',
          backdropFilter: "blur(50px)"
        }}>
        <Avatar src={user.image} sx={{width: 80, height: 80, margin: '1rem auto', cursor: 'pointer'}} title='Change avatar' onClick={() => setChangeAvatar(!changeAvatar)}/>
        <Box component={'div'} sx={changeAvatar ? {mb: 2, fontSize: '10px'} : {display: 'none'}} >
          <FileBase64 type={'file'} multiple={false } onDone={(e) => handleChangeAvatar(e)} />
        </Box>
        <h1 style={{ marginBottom: '2rem' }}>Hello {user.fullname}</h1>
        <TextField 
          variant='outlined'
          label='Fullname'
          name='fullname'
          id='fullname'
          defaultValue={user.fullname}
          fullWidth
          margin='normal'
          disabled={disable}
          error={fullnameErrText !== ''}
          helperText={fullnameErrText}
        />
        <TextField 
          variant='outlined'
          label='Email'
          name='email'
          id='email'
          type={'email'}
          defaultValue={user.email || ''}
          placeholder={'example@abc'}
          fullWidth
          margin='normal'
          disabled={disable}
          error={emailErrText !== ''}
          helperText={emailErrText}
        />
        <TextField 
          variant='outlined'
          label='PhoneNumber'
          name='phone'
          id='phone'
          defaultValue={user.phone}
          fullWidth
          margin='normal'
          disabled={disable}
          error={phoneErrText !== ''}
          helperText={phoneErrText}
        />
        <TextField 
          variant='outlined'
          label='Username'
          name='username'
          id='username'
          defaultValue={user.username}
          fullWidth
          margin='normal'
          disabled
        />
        <TextField 
          variant='outlined'
          label='password'
          name='password'
          id='password'
          defaultValue={user.password}
          fullWidth
          margin='normal'
          type={'password'}
          disabled={disable}
          error={passwordErrText !== ''}
          helperText={passwordErrText}
        />
        <TextField 
          sx={disable ? { display: 'none' } : {}}
          variant='outlined'
          label='ConfirmPassword'
          name='confirmPassword'
          id='confirmPassword'
          defaultValue={user.password}
          fullWidth
          margin='normal'
          type={'password'}
          error={confirmPasswordErrText !== ''}
          helperText={confirmPasswordErrText}
        />
        <Button 
          fullWidth 
          color={disable ? 'secondary' : 'warning'}
          variant='outlined'
          sx={{ mt: 1 }}
          onClick={handleCancel}
        >{disable ? 'Edit' : 'Cancel'}</Button>
        <LoadingButton 
          sx={disable ? { display: 'none' } : {mt: 2}}
          fullWidth 
          variant='outlined'
          type='submit'
          disabled={disable}
          loading={loading}
        >Save</LoadingButton>
      </Box>
    </div>
  )
}

export default Profile