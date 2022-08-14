import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import storage from 'redux-persist/lib/storage';

import { Avatar, AppBar, Box, Drawer, ListItemButton, ListItemIcon, List, ListItemText, Toolbar, Typography, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

import SwitchDarkMode from './SwitchDarkmode';
import Calendar from './Calendar';
import { setAdmin } from '../../redux/reducers/adminRedux';

const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAdmin = useSelector(state => state.admin.isAdmin);
  const drawerWidth = '320px';
  const listItem = [{
    text: 'Admin',
    icon: AdminPanelSettingsIcon,
    link: '/admin',
    show: isAdmin ? true : false,
  }, 
  {
    text: 'Home',
    icon: HomeIcon,
    link: '/',
    show: true
  }, 
  {
    text: 'Dashboard',
    icon: DashboardIcon,
    link: '/dashboard',
    show: true,
  }, 
  {
    text: 'Statistics',
    icon: StackedLineChartIcon,
    link: '/statistics',
    show: true
  },
  {
    text: 'Support',
    icon: SupportAgentIcon,
    link: '/support',
    show: true
  }];

  const user = useSelector(state => state.user.value);
  
  const handleLogout = () => {
    storage.removeItem('persist:root')
    localStorage.removeItem('token');
    dispatch(setAdmin(false));
    navigate('/login');
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position='fixed'
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography
            variant='h4'
            noWrap
            fontWeight={600}
            component={Link}
            to='/'
          >Spending</Typography>
          <Typography
            variant='h4'
            fontFamily={'Nunito'}
            fontWeight={700}
            margin='0 auto'
            noWrap
          >Welcome back, {user.fullname}</Typography>
          <Typography
            variant='h6'
            fontFamily={'Nunito'}
            fontWeight={600}
            noWrap
            mr={3}
          >{moment(new Date()).format('DD/MM/YYYY')}</Typography>
          <SwitchDarkMode />
        </Toolbar>
      </AppBar>
      <Drawer
        variant='permanent'
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {width: 'max-content', boxSizing: 'border-box', justifyContent: 'space-between'}
        }}
      >
        <Toolbar />
        <Box component={'div'} sx={{
          textAlign: 'center',
          margin: '1.5rem'
        }}>
          <Avatar src={user.image} sx={{width: 80, height: 80, margin: '1rem auto', cursor: 'edit'}} />
          <Box component={Link}
            to={`/profile/${user._id}`}
            color={'skyblue'}
            sx={{
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '1.3rem',
          }}>{user.fullname}
          </Box>
        </Box>
        <Divider />
        <Box>
          <List>
            {listItem.map((item, index) => (
              <ListItemButton key={index} sx={item.show ? { width: drawerWidth, paddingLeft: '6rem' } : { display: 'none' }} component={Link} to={item.link} >
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
            ))}
          </List>
        </Box>
        <Divider />
        <Calendar />
        <Box>
        <Divider />
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon sx={{paddingLeft: '6rem'}}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary='Logout' />
          </ListItemButton>
        </Box>
      </Drawer>
    </Box>
  )
}

export default SideBar;