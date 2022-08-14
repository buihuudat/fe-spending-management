import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import moment from 'moment';

import userApi from "../../api/userApi";
import authUtils from "../../utils/authUtils";
import statisticsApi from '../../api/statisticsApi';
import targetsApi from '../../api/targetsApi';
import { setStatistics, setTargets } from '../../redux/reducers/statictiscRedux';
import { setUser } from '../../redux/reducers/userRedux';
import { setAdmin, setAU } from "../../redux/reducers/adminRedux";

import Loading from "../common/Loading";
import { Box } from "@mui/material";
import SideBar from "../common/SideBar";
import BaseSpeedDial from "../common/BaseSpeedDial";
import BaseModal from '../common/BaseModal';

const AppLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const path = pathname.split('/')[1] === 'admin';
  
  useEffect(() => {
    // check auth
    const checkAuth = async () => {
      const user = await authUtils.isAuthenticated();
      if (!user) {
        navigate('/login');
      } else {
        // check is admin
        if (user.permission === 'Admin') {
          const dataUser = await userApi.getAllUser();
          dispatch(setAU(dataUser));
          dispatch(setAdmin(true));
        } else if (path && user.permission !== 'Admin') {
          alert('You are not an administrator');
          navigate('/');
        }
        // get statistics & targets data
        const data = await statisticsApi.getAll({ user: user._id });
        console.log(data)
        const {targets} = await targetsApi.get({UID: user._id, targets: {month: moment(new Date()).format('M')} });
        if (!data) return;
        dispatch(setStatistics(data));
        dispatch(setTargets(targets));
        dispatch(setUser(user));
        setLoading(false)
      }
    }
    checkAuth();
  }, [navigate, path, dispatch])

  return (
    loading ? (
      <Loading fullheight />
    ) : (
      <Box sx={{
        display: 'flex',
      }}>
        <SideBar />
        <BaseSpeedDial/>
        <BaseModal />
        <Box sx={{
          flexGrow: 1,
          p: 1,
          width: 'max-content'
        }}>
          <Outlet />
        </Box>
      </Box>
    )
  )
}

export default AppLayout;