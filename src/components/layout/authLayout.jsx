import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Loading from '../common/Loading';
import { Box, Container } from '@mui/material';
import authUtils from '../../utils/authUtils';

const logoImg = require('../../images/gif/money.gif')

const AuthLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authUtils.isAuthenticated()
      if (!isAuth) {
        setLoading(false)
      } else {
        navigate('/')
      }
    }
    checkAuth()
  }, [navigate])

  return (
    loading ? (
      <Loading fullheight />
    ) : (
      <Container 
        component='main' 
        maxWidth='xs'
        sx={{paddingTop: '60px'}}
      >
        <Box sx={{
          marginTop: 8,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
          <img src={logoImg}
          style={{ width: '100px', borderRadius:"50%" }} alt='logo' />
          <Outlet />
        </Box>
      </Container>
    )
  )
}

export default AuthLayout