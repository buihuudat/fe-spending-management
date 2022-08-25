import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import moment from 'moment';
import {toast} from 'react-toastify';

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
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { MenuItem, Select, TextField } from '@mui/material';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import LoadingButton from '@mui/lab/LoadingButton';

import statisticsApi from '../api/statisticsApi';
import { setStatistics } from '../redux/reducers/statictiscRedux';

export default function EnhancedTable() {
  document.title = 'Statistics | Spending App';

  const dispatch = useDispatch();
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('date');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [dataSelected, setDataSelected] = useState([]);
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [actions, setActions] = useState();
  const [money, setMoney] = useState(0);
  const [status, setStatus] = useState();

  const [dateErrText, setDateErrText] = useState('');
  const [nameErrText, setNameErrText] = useState('');
  const [moneyErrText, setMoneyErrText] = useState('');

  const statisticsState = useSelector(state => state.statistics.data);
  useEffect(() => {
    const getStatisticsData = async () => {
      const data = await statisticsApi.getAll({user: statisticsState.user});
      dispatch(setStatistics(data));
    }
    getStatisticsData();
  }, [dispatch, loading, statisticsState.user])

  const data = {
    _id: dataSelected._id,
    date: date || dataSelected.date, 
    name: name || dataSelected.name, 
    actions: actions || dataSelected.actions, 
    amountOfMoney: parseInt(money) || dataSelected.amountOfMoney, 
    status: status || dataSelected.status 
  };
  
  const rows = [];
  if (statisticsState.statistics) {
    statisticsState.statistics.forEach(data => rows.push(data))
  }

  // const currencyFormat = (m) => new Intl.NumberFormat('vi-VN', {
  //   style: 'currency',
  //   currency: 'VND'
  // }).format(m)


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
      id: 'date',
      numeric: false,
      disablePadding: true,
      label: 'Date',
    },
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: 'Name',
    },
    {
      id: 'actions',
      numeric: false,
      disablePadding: false,
      label: 'Actions',
    },
    {
      id: 'amountOfMoney',
      numeric: false,
      disablePadding: true,
      label: 'Amount Of Money',
    },
    {
      id: 'status',
      numeric: false,
      disablePadding: false,
      label: 'Status',
    }
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
    let err = false
    console.log(data)
    if (data.name === '') {
      err = true
      setNameErrText('Please fill this field');
    }
    if (data.amountOfMoney === '') {
      err = true
      setMoneyErrText('Please fill this field');
    }
    if (data.amountOfMoney < 500) {
      err = true
      setMoneyErrText('Invalid current')
    }
    if (err) return
    setLoading(true);
    try {
      await statisticsApi.update({user: statisticsState.user, statistics: data});
      setNameErrText('');
      setMoneyErrText('');
      setLoading(false);
      setDisable(true);
      setSelected([]);
      toastNoti('success', 'Edit successfully 👌')
    } catch (error) {
      const errors = error.data.errors;
      errors.forEach(e => {
        if (e.param === 'date') {
          setDateErrText(e.msg);
        }
        if (e.param === 'name') {
          setNameErrText(e.msg);
        }
        if (e.param === 'amountOfMoney') {
          setMoneyErrText(e.msg);
        }
        setLoading(false);
        setDisable(true);
      })
    }
  }

  const handleDelete = async () => {
    setLoading(true);
    try {
      await statisticsApi.delete({user: statisticsState.user, idStatistics: selected});
      toastNoti('success', 'Deleted successfully!!!');
      setLoading(false);
      setSelected([]);
    } catch {
      toastNoti('error', 'Ohshit - Has been error!😢');
    }
  }
  const handleEdit = (row) => {
    setSelected([row._id])
    setDataSelected(row)
    setDisable(false);
    setLoading(false);
  }
  const handleCancel = () => {
    setSelected([])
    setDisable(!disable);
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
          <Box sx={{display: 'flex', gap: '1rem'}}>
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
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
      <Paper sx={{ width: '100%', mb: 1, p: 0 }}>
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
                        component="th"
                        scope="row"
                        padding="none"
                      >
                        <TextField
                          variant='standard' 
                          name='date'
                          type={'date'}
                          defaultValue={moment(row.date).format('yyyy-MM-DD')} 
                          disabled={!isItemSelected || disable}
                          onChange={e => setDate(e.target.value)}
                          error={isItemSelected && dateErrText !== ''}
                          helperText={isItemSelected && dateErrText}
                          sx={{
                            width: '120px'
                        }} />
                      </TableCell>
                      <TableCell id={labelId} align="left">
                        <TextField 
                          name='name'
                          variant='standard'
                          defaultValue={row.name} 
                          disabled={!isItemSelected || disable}
                          onChange={e => setName(e.target.value)}
                          error={isItemSelected && nameErrText !== ''}
                          helperText={isItemSelected && nameErrText}
                          sx={{
                            width: '120px',
                          }}/>
                      </TableCell>
                      <TableCell align="left">
                        <Select
                          variant='standard'
                          name='actions'
                          id='actions'
                          title='actions'
                          onChange={e => setActions(e.target.value)}
                          disabled={!isItemSelected || disable}
                          sx={{
                            width: '120px' 
                          }}
                          defaultValue={actions ?? row.actions}
                        >
                          <MenuItem value={'Spend'}>Spend</MenuItem>
                          <MenuItem value={'Collect'}>Collect</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell align="left">
                        <TextField 
                          name='amountOfMoney'
                          variant='standard'
                          defaultValue={row.amountOfMoney} 
                          disabled={!isItemSelected || disable}
                          onChange={e => setMoney(e.target.value)}
                          error={isItemSelected && moneyErrText !== ''}
                          helperText={isItemSelected && moneyErrText}
                          sx={{
                            width: '100px'
                        }}/>
                      </TableCell>
                      <TableCell padding='normal' align="left" >
                        <Select
                          variant='standard'
                          name='status'
                          id='status'
                          disabled={!isItemSelected || disable}
                          title='status'
                          onChange={e => setStatus(e.target.value)}
                          sx={{
                            width: '100px' , marginRight: '2rem'
                          }}
                          defaultValue={row.status}
                        >
                          <MenuItem value={'Done'}>Done</MenuItem>
                          <MenuItem value={'Slacking'}>Slacking</MenuItem>
                        </Select>
                        <Tooltip title={!isItemSelected || disable ? 'Edit' : 'Cancel'}>
                        {!isItemSelected || disable ? 
                          <IconButton onClick={() => handleEdit(row)}>
                            <EditIcon color='warning' />
                          </IconButton> :
                          <IconButton onClick={() => handleCancel(row)}>
                            <DoDisturbOnIcon color='secondary' />
                          </IconButton>}
                        </Tooltip>
                        <LoadingButton
                          sx={disable || !isItemSelected || selected.length > 1 ? {display: 'none'}:{width: 'max-content', position: 'absolute'}}
                          fullWidth
                          color='success'
                          onClick={handleSubmit}
                          loading={loading}
                        >Update
                        </LoadingButton>
                      </TableCell>
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
    </Box>
  );
}
