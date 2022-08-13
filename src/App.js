import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './style/main.scss';
import './style/custom-scrollbar.scss';
import 'react-toastify/dist/ReactToastify.css';

import React from 'react';
import { useSelector } from 'react-redux';

import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { ToastContainer } from 'react-toastify';

import AuthLayout from './components/layout/authLayout';
import AppLayout from './components/layout/appLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Statistics from './pages/Statistics';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Support from './pages/Support';

const App = () => {
  const darkmode = useSelector(state => state.modal.darkmode);
  const theme = createTheme({
    palette: { mode: darkmode ? 'light' : 'dark' }
  })
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AuthLayout />}>
            <Route path='login' element={<Login />} />
            <Route path='signup' element={<Signup />} />
          </Route>
          <Route path='/' element={<AppLayout />}>
            <Route path='/' index element={<Home />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='statistics' element={<Statistics />} />
            <Route path='support' element={<Support />} />
            <Route path='profile/:UID' element={<Profile />} />
            <Route path='admin' element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App;