import * as React from 'react';
import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { useDispatch } from 'react-redux';
import { setModal } from '../../redux/reducers/modalRedux';

export default function BaseSpeedDial () {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const location = pathname.split('/')[1];
  
  return (
    <Box sx={location === 'profile' ? {display: 'none'} : { 
      position: 'fixed', 
      zIndex: 100, 
      bottom: 30,
      right: 0, 
      transform: 'translateZ(0px)', 
      flexGrow: 1 
    }}>
      <SpeedDial
        ariaLabel="SpeedDial"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction 
          tooltipTitle='Add spending' 
          icon={<PlaylistAddIcon />}
          onClick={() => dispatch(setModal(true))}
        />
        <SpeedDialAction tooltipTitle='Copy' icon={<FileCopyIcon />} />
        <SpeedDialAction tooltipTitle='Save' icon={<SaveIcon />} />
        <SpeedDialAction tooltipTitle='Print' icon={<PrintIcon />} />
        <SpeedDialAction tooltipTitle='Share' icon={<ShareIcon />} />
      </SpeedDial>
    </Box>
  );
}