import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';

import { setModal } from '../../redux/reducers/modalRedux';
import statisticsApi from '../../api/statisticsApi';
import { setStatistics } from '../../redux/reducers/statictiscRedux';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'max-content',
  bgcolor: 'rgba(255,255,255,.1)',
  backdropFilter: 'blur(50px)',
  border: '2px solid #11568C',
  borderRadius: '5px',
  boxShadow: 24,
  p: 4,
  textAlign: 'center'
};

export default function BaseModal() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [nameErrText, setNameErrText] = useState('');
  const [moneyErrText, setMoneyErrText] = useState('');
  const [dateErrText, setDateErrText] = useState('');

  const open = useSelector(state => state.modal.open);
  const user = useSelector(state => state.user.value);
  
  const notify = (type, msg) => {
    toast(msg, {
      type: type,
      position: toast.POSITION.TOP_RIGHT
    })
  }

  const handleCancel = () => {
    setNameErrText('');
    setMoneyErrText('');
    setLoading(false);
    dispatch(setModal(false));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const date = data.get('date');
    const name = data.get('name');
    const actions = data.get('actions');
    const amountOfMoney = data.get('amountOfMoney');
    const status = data.get('status');

    let err = false;
    if (!date) {
      err = true;
      setDateErrText('Please fill this field');
    }
    if (!name) {
      err = true;
      setNameErrText('Please fill this field');
    }
    if (!amountOfMoney) {
      err = true;
      setMoneyErrText('Please fill this field');
    }
    if (amountOfMoney.length < 4) {
      err = true;
      setMoneyErrText('Invalid amount');
    }
    if (err) return;
    
    setLoading(true);
    setNameErrText('');
    setMoneyErrText('');

    try {
      await statisticsApi.create({
        user: user._id, 
        statistics: [{date, name, actions, amountOfMoney, status}]
      });
      notify('success', 'Added complete 😎👌');
      dispatch(setModal(false));
      setLoading(false);
    } catch (error) {
      const errors = error.data.errors;
      errors.map(e => {
        if (e.param === 'amountOfMoney') {
          setMoneyErrText(e.msg);
        }
      })
      setLoading(false);
      // notify('error', 'Ohshit!!! Failure 🤯 \nTry again');
    }
  }

  useEffect(() => {
    const getStatisticsData = async () => {
      const statisticsData = await statisticsApi.getAll({ user: user._id });
      dispatch(setStatistics(statisticsData));
    }
    getStatisticsData();
  }, [dispatch, handleSubmit])

  return (
    <Modal
      open={open}
      onClose={() => dispatch(setModal(false))}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      hideBackdrop
    >
      <Box sx={style}>
        <Typography component={'h1'} sx={{fontWeight: 600, fontSize:'1.5rem' }}>Add Spending <AttachMoneyIcon /></Typography>
        <Box
          component='form'
          onSubmit={handleSubmit}
        >
          <Box 
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '20px',
              m: '3rem 1rem'
          }}>
            <TextField 
              title='date'
              label='Date'
              name='date'
              id='date'
              type={'date'} 
              error={dateErrText !== ''}
              helperText={dateErrText}
              defaultValue={moment(new Date()).format('yyyy-MM-DD')}
            />
            <TextField 
              title='name' 
              name='name'
              id='name'
              placeholder='Tiền xăng...' 
              label='Name' 
              error={nameErrText !== ''}
              helperText={nameErrText}
              sx={{
                width: '170px' 
              }}/>
          <Box>
            <Select
              name='actions'
              id='actions'
              title='actions'
              sx={{
                width: '120px' 
              }}
              defaultValue={'Spend'}
            >
              <MenuItem value={'Spend'}>Spend</MenuItem>
              <MenuItem value={'Collect'}>Collect</MenuItem>
            </Select>
          </Box>
          <TextField 
            titie='Amount of money' 
            name='amountOfMoney'
            id='amountOfMoney'
            type={'number'}
            label='Amount Of Money' 
            placeholder='50000...' 
            error={moneyErrText !== ''}
            helperText={moneyErrText}
            sx={{
              width: '170px' 
            }}/>
          <Box>
            <Select
              name='status'
              id='status'
              title='status'
              sx={{
                width: '120px' 
              }}
              defaultValue={'Done'}
            >
              <MenuItem value={'Done'}>Done</MenuItem>
              <MenuItem value={'Slacking'}>Slacking</MenuItem>
            </Select>
          </Box>
        </Box>
        <Box>
        <Button 
          variant='outlined' 
          color='warning' 
          onClick={handleCancel}
          sx={{ ml: '2rem', p: 1, width: '200px' }}>
            Cancel
        </Button>
        <LoadingButton 
          type='submit' 
          variant='outlined' 
          color='success' 
          loading={loading}
          sx={{ ml: '2rem', p: 1, fontWeight: 600, width: '200px' }}
        >
          ADD
        </LoadingButton>
        </Box>
        </Box>
      </Box>
    </Modal>
  );
}