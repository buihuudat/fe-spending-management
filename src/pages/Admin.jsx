import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import {toast} from 'react-toastify';
import { setAU } from '../redux/reducers/adminRedux';

import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { TextField, Button, Modal, Avatar } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import userApi from '../api/userApi';

export default function Admin() {
  document.title = 'Administrator | Spending App';

  const dispatch = useDispatch();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openModalSubmit, setOpenModalSubmit] = useState(false);

  const [dataSelected, setDataSelected] = useState([]);
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [emailErrText, setEmailErrText] = useState('');
  const [passwordErrText, setPasswordErrText] = useState('');
  const [confirmPasswordErrText, setConfirmPasswordErrText] = useState('');
  const [phoneErrText, setPhoneErrText] = useState('');

  const adminState = useSelector(state => state.admin.users);
  const AID = useSelector(state => state.user.value)._id;
  useEffect(() => {
    const getAllDataUser = async () => {
      const data = await userApi.getAllUser();
      dispatch(setAU(data));
    }
    getAllDataUser()
  }, [dispatch, loading, adminState])

  const data = {
    _id: dataSelected._id,
    fullname: fullname || dataSelected.fullname, 
    username: username || dataSelected.username, 
    password: password || dataSelected.password, 
    confirmPassword: confirmPassword || dataSelected.password, 
    email: email.toLowerCase() || dataSelected.email,
    phone: phone || dataSelected.phone,
  };
  
  let rows = adminState;

  // noti
  const toastNoti = (type, msg) => {
    toast(msg, {
      type: type,
      position: toast.POSITION.TOP_RIGHT
    })
  }

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const headCells = [
    {
      id: 'createdAt',
      numeric: false,
      disablePadding: true,
      label: 'CreatedAt',
    },
    {
      id: 'fullname',
      numeric: false,
      disablePadding: false,
      label: 'Fullname',
    },
    {
      id: 'usernmae',
      numeric: false,
      disablePadding: false,
      label: 'Username',
    },
    {
      id: 'password',
      numeric: false,
      disablePadding: true,
      label: 'Password',
    },
    {
      id: 'email',
      numeric: false,
      disablePadding: false,
      label: 'Email',
    },
    {
      id: 'phone',
      numeric: false,
      disablePadding: false,
      label: 'Phone',
    },
    {
      id: 'actions',
      numeric: true,
      disablePadding: false,
      label: 'Actions',
    },
  ];

  function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
      props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await userApi.updateUser(data);
      setEmailErrText('');
      setPhoneErrText('');
      setPasswordErrText('');
      setLoading(false);
      setDisable(true);
      setSelected([]);
      toastNoti('success', 'Edit successfully 👌')
    } catch (error) {
      const errors = error.data.errors;
      errors.map(e => {
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
        setDisable(true);
      })
    }
  }

  const handleDelete = async (e) => {
    setLoading(true);
    let data = [];
    selected.length? data = selected:data.push(e._id);
    try {
      await userApi.deleteUser({UID: data, AID: AID });
      toastNoti('success', 'Deleted successfully!!!');
      setLoading(false);
      setSelected([]);
      setOpenModalSubmit(false);
    } catch {
      toastNoti('error', 'Ohshit - Has been error!😢');
    }
  }
  const handleEdit = () => {
    setDisable(!disable);
    setLoading(false);
  }
  const handleView = (row) => {
    setDataSelected(row);
    setDisable(true)
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const EnhancedTableToolbar = (props) => {
    const { numSelected } = props;

    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            No Selected
          </Typography>
        )}

        {numSelected > 0 ? (
          <Box>
            <Tooltip title="Delete">
              <IconButton onClick={handleDelete}>
                <DeleteIcon color='error' />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    );
  };

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n._id);
      setSelected(newSelected);
      setDisable(true);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, row) => {
    const selectedIndex = selected.indexOf(row._id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row._id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setDisable(true);
    setDataSelected(row);
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ 
      width: '100%', 
      display: 'flex', 
      justifyContent: 'center', 
      flexDirection: 'column',
      background: `url()`
    }}>
      <Paper sx={{ width: '100%', mb: 1, p: 0 }}>
        <Box sx={{p:2, fontWeight: 600}}>Total {rows.length}</Box>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size='small'
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox"
                      onClick={(event) => handleClick(event, {...row})}>
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                        </TableCell>
                      <TableCell 
                        scope="row"
                        padding="none"
                      >
                          {row.createdAt.split('T')[0]}
                      </TableCell>
                      <TableCell>{row.fullname}</TableCell>
                      <TableCell>{row.username}</TableCell>
                      <TableCell padding='none'><TextField variant='standard' disabled defaultValue={row.password} type='password' /></TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell align='right' 
                        > 
                        <Button 
                          type='submit'
                          color='error'
                          onClick={() => setOpenModalSubmit(true)}
                        ><DeleteIcon /></Button>
                        <Button 
                          onClick={() => handleView(row)}
                        ><RemoveRedEyeIcon /></Button>
                      </TableCell>
                      <Modal
                        open={openModalSubmit}
                        onClose={() => setOpenModalSubmit(false)}
                        hideBackdrop
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            width: 400,
                            border: '2px solid #11568C',
                            boxShadow: 24,
                            p: 4,
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant='h5'>Do you want to delete this user?</Typography>
                          <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', pt: 4}}>
                            <Button variant='outlined' color='primary' sx={{width: '100px'}} onClick={() =>  {setLoading(false); setOpenModalSubmit(false)}}>Cancel</Button>
                            <LoadingButton variant='outlined' color='error' sx={{width: '100px'}} loading={loading} onClick={() => handleDelete(row)}>Delete</LoadingButton>
                          </Box>
                        </Box>
                      </Modal>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 15, 20]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={{
           position: 'absolute',
           top: '50%',
           left: '50%',
           transform: 'translate(-50%, -50%)',
           bgcolor: 'background.paper',
           boxShadow: 24,
           margin: '1rem auto',
           width: '500px',
           padding: '1.5rem 3rem',
           border: '2px solid #11568C',
           borderRadius: '10px',
           textAlign: 'center'
        }} 
            onSubmit={handleSubmit}
            component='form' 
            mt={1}
            noValidate
            >
            <Avatar src={dataSelected.image} sx={{width: 80, height: 80, margin: '1rem auto'}}/>
            <h1 style={{ margin: '0 auto' }}>{dataSelected.permission} {dataSelected.fullname}</h1>
            <TextField 
              variant='outlined'
              label='Fullname'
              name='fullname'
              id='fullname'
              defaultValue={dataSelected.fullname}
              onChange={e => setFullname(e.target.value)}
              fullWidth
              margin='normal'
              disabled={disable}
            />
            <TextField 
              variant='outlined'
              label='Email'
              name='email'
              id='email'
              type={'email'}
              defaultValue={dataSelected.email || ''}
              fullWidth
              margin='normal'
              disabled={disable}
              error={emailErrText !== ''}
              helperText={emailErrText}
              onChange={e => setEmail(e.target.value)}
            />
            <TextField 
              variant='outlined'
              label='PhoneNumber'
              name='phone'
              id='phone'
              defaultValue={dataSelected.phone}
              fullWidth
              margin='normal'
              disabled={disable}
              error={phoneErrText !== ''}
              helperText={phoneErrText}
              onChange={e => setPhone(e.target.value)}
            />
            <TextField 
              variant='outlined'
              label='Username'
              name='username'
              id='username'
              defaultValue={dataSelected.username}
              fullWidth
              margin='normal'
              disabled
            />
            <TextField 
              variant='outlined'
              label='password'
              name='password'
              id='password'
              defaultValue={dataSelected.password}
              fullWidth
              margin='normal'
              disabled={disable}
              error={passwordErrText !== ''}
              helperText={passwordErrText}
              onChange={e => setPassword(e.target.value)}
            />
            <TextField 
              sx={disable ? { display: 'none' } : {}}
              variant='outlined'
              label='ConfirmPassword'
              name='confirmPassword'
              id='confirmPassword'
              defaultValue={dataSelected.password}
              fullWidth
              margin='normal'
              error={confirmPasswordErrText !== ''}
              helperText={confirmPasswordErrText}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <Button 
              fullWidth 
              color={disable ? 'secondary' : 'warning'}
              variant='outlined'
              onClick={handleEdit}
              sx={{ mt: 1 }}
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
      </Modal>
    </Box>
  );
}
