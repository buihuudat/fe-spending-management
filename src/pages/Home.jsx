import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import {toast} from 'react-toastify';

import targetsApi from '../api/targetsApi';
import { setTargets } from '../redux/reducers/statictiscRedux';

import { Box, Grid, Card, TextField, Button, Modal, Fade } from '@mui/material';
import Chart from "react-apexcharts";
import { Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import SavingsIcon from '@mui/icons-material/Savings'; // thu
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'; // chi
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert'; // target
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import { LoadingButton } from '@mui/lab';

const Home = () => {
  document.title = 'Spending App';

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();

  const user = useSelector(state => state.user.value)._id;
  const { statistics } = useSelector(state => state.statistics.data);
  const calendarDate = useSelector(state => state.calendar.date);
  const targetsState = useSelector(state => state.statistics.targets);
  
  const dCal = moment(calendarDate).format('D')<10?'0'+moment(calendarDate).format('D'):moment(calendarDate).format('D');
  const mCal = moment(calendarDate).format('M')<10?'0'+moment(calendarDate).format('M'):moment(calendarDate).format('M');
  const yCal = moment(calendarDate).format('YYYY');

  // get target state
  useEffect(() => {
    const getTargets = async () => {
      const {targets} = await targetsApi.get({ UID: user, targets: {month: moment(mCal).format('M')} })
      dispatch(setTargets(targets))
    };
    getTargets();
  }, [dispatch, mCal, user])

  // noti toast
  const toastNoti = (type, msg) => {
    toast(msg, {
      type: type,
      position: toast.POSITION.TOP_RIGHT
    })
  }
  
  const getLastDay = (m, y) => new Date(y,m,0).getDate();

  // get targets of month
  function getTargets(m) {
    let target = 0;
    targetsState.forEach(value => {
      if (value.month === m) {
        target = value.targets;
      }
    })
    return target
  }

  const countAmount = (d, m, y) => {
    const date = new Date();
    const day = dCal!==undefined?dCal : d>10?d:d===undefined?'0'+date.getDate():'0'+d;
    const month = mCal!==undefined?mCal : m>10?m:m===undefined?'0'+(1+date.getMonth()):'0'+m;
    const year = yCal!==undefined?yCal : y || date.getFullYear();
    const spend =  _.filter(statistics, {
      date: year+'-'+month+'-'+day+'T00:00:00.000Z',
      actions: 'Spend',
      status: 'Done'
    });
    const collect =  _.filter(statistics, {
      date: year+'-'+month+'-'+day+'T00:00:00.000Z',
      actions: 'Collect',
      status: 'Done'
    });
    return { collect, spend }
  };

  const currencyFormat = (m) => new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(m)
  
  const amountSpent = [];
  const amountCollect = [];

  countAmount().collect.map(e => amountCollect.push(e.amountOfMoney));
  countAmount().spend.map(e => amountSpent.push(e.amountOfMoney)); 
  const collect = _.sum(amountCollect);
  const spend = _.sum(amountSpent);

  // get data for chart  
  const getDataOfMonth = (month, year, actions, status) => {
    const date = new Date();
    const m = mCal!==undefined?mCal : month || date.getMonth() + 1;
    const y = yCal!==undefined?yCal : year || date.getFullYear();
    const dataFind = _.filter(statistics, ({date}) => '0'+moment(date).format('M') === m && moment(date).format('Y') === y )
    const spend = _.filter(dataFind, {actions: 'Spend', status: status?status:'Done'})
    const collect = _.filter(dataFind, {actions: 'Collect', status: status?status:'Done'})
    return {
      dataFind,
      spend,
      collect
    }
  }; 

  // total data of month
  const collectOfMonth = (month, year, actions, status) => 
  _(getDataOfMonth(month, year, actions, status).collect).map(o => o.amountOfMoney).sum(getDataOfMonth(month, year, actions, status).collect);
  const spendOfMonth = (month, year, actions, status) => 
  _(getDataOfMonth(month, year, actions, status).spend).map(o => o.amountOfMoney).sum(getDataOfMonth(month, year, actions, status).spend);
  const realityCollectofMonth = collectOfMonth() + collectOfMonth('','','','Slacking');
  const realitySpendofMonth = spendOfMonth() + spendOfMonth('','','','Slacking');

  // sum money where like date
  const dataCountChartSpend =_(getDataOfMonth().spend).groupBy('date').map((objs, key) => (
    {
      'date': moment(key).format('D'),
      'amountOfMoney': _.sumBy(objs, 'amountOfMoney')
  })).value();
  const dataCountChartCollect =_(getDataOfMonth().collect).groupBy('date').map((objs, key) => (
    {
      'date': moment(key).format('D'),
      'amountOfMoney': _.sumBy(objs, 'amountOfMoney')
  })).value();
  const dataCountChartAll =_(getDataOfMonth().dataFind).groupBy('date').map((objs, key) => (
    {
      'date': moment(key).format('D'),
      'amountOfMoney': _.sumBy(objs, 'amountOfMoney')
  })).value();

  const amountAllofMonth = []
  const amountSpendofMonth = []
  const amountCollectofMonth = []
  dataCountChartAll.map(e => amountAllofMonth.push(e.amountOfMoney))
  dataCountChartSpend.map(e => amountSpendofMonth.push(e.amountOfMoney))
  dataCountChartCollect.map(e => amountCollectofMonth.push(e.amountOfMoney))

  // fund of something month...
  // done
  const fundTotalDone = getTargets(moment(mCal).format('M')) + collectOfMonth() - spendOfMonth();
    // slacking
  const fundTotalSlacking = getTargets(moment(mCal).format('M')) + realityCollectofMonth - realitySpendofMonth;

  const dataLine = {
    series: [
      {
        name: "Collect",
        data: []
      },
      {
        name: "Spend",
        data: []
      },
      {
        name: "Overtargets",
        data: []
      }
    ],
    options: {
      chart: {
        height: 350,
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: true
        }
      },
      colors: ['#00AE97', '#FFCE09', '#FF7750'],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: `Statistical table of spending in ${moment(calendarDate).format('MMMM')}`,
        align: 'left'
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#fff1', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      markers: {
        size: 1
      },
      xaxis: {
        categories: [],
        title: {
          text: 'Day'
        },
      },
      yaxis: {
        title: {
          text: 'Amount'
        },
        min: 0,
        max: _.max(amountSpendofMonth) > _.max(amountCollectofMonth) ? _.max(amountSpendofMonth) : _.max(amountCollectofMonth)
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5,
      }
    }
  }

  // roundup func 🤯🤯🤯
  function roundUp(num, precision) {
    precision = Math.pow(10, precision)
    return Math.ceil(num * precision) / precision
  }
  
  for(let i = 1; i <= getLastDay(mCal, yCal); i++) {
    // get day for x label
    dataLine.options.xaxis.categories.push(i);
    // get data for chart
    let moneySpend =0;
    let moneyCollect =0;
    let overtarget = 0;
    const targetsInDay = Math.floor(getTargets(moment(mCal).format('M'))/getLastDay(mCal, yCal));
    // spending
    dataCountChartSpend.forEach((e) => {
      if (parseInt(e.date) === i) {
        moneySpend = e.amountOfMoney;
        return moneySpend
      }
    })
    // collect
    dataCountChartCollect.forEach((e) => {
      if (parseInt(e.date) === i) {
        moneyCollect = e.amountOfMoney;
        return moneyCollect
      }
    })
    // overtarget
    dataCountChartSpend.forEach((e) => {
      if (parseInt(e.date) === i) {
        overtarget = e.amountOfMoney > targetsInDay ? -(targetsInDay - e.amountOfMoney) : 0;
        overtarget = roundUp(overtarget, -3)
        return overtarget
      }
    })
    dataLine.series[0].data.push(moneySpend); 
    dataLine.series[1].data.push(moneyCollect); 
    dataLine.series[2].data.push(overtarget); 
  }
  
  const handleEdit = () => {
    setOpen(true);
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);
    const value = new FormData(e.target)
    const target = value.get('targets')
    if (isNaN(target)) {
      toastNoti('error', 'Invalid amount');
      return
    }
    console.log({UID: user, targets: {month: moment(mCal).format('M'), targets: target} })

    try {
      const {targets} = await targetsApi.get({UID: user, targets: {month: moment(mCal).format('M'), targets: target} });
      dispatch(setTargets(targets));
      setOpen(false);
      setLoading(false);
    } catch (error) {
      toastNoti('error', 'Failure!!!!')
      setLoading(false);
    }
  }
  // handle press esc key
  document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt === 27) {
      setOpen(true)
    }
  };  

  return (
    <div>
      <Box component={'div'}>
        <Grid container spacing={3} justifyContent='center'  mt={1} mb={1}>
          {/* targets */}
          <Grid item >
            <Card sx={{
              padding: '1.5rem',
              width: '400px',
              height: '150px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5
            }}>
              <CrisisAlertIcon color='success' sx={{ fontSize: '4rem' }} />
              <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Typography fontSize={'1.5rem'} fontWeight='700'>Targets of {moment(mCal).format('MMMM')}</Typography>
                <Box sx={{display: 'flex', flexDirection: 'row'}} onSubmit={handleSubmit}>
                  <Typography sx={{fontSize: '2rem', cursor: 'auto'}} >{currencyFormat(getTargets(moment(mCal).format('M')))}</Typography>
                  <Button type='submit' variant='text' onClick={handleEdit}>
                    <EditIcon color='secondary' title='update' />
                  </Button>
                </Box>
                <Typography variant='h7' sx={{color: '#666'}}>
                {getTargets(moment(mCal).format('M'))?`~${currencyFormat(roundUp(getTargets(moment(mCal).format('M'))/getLastDay(mCal, yCal),-3))}/day`:''}
                </Typography>
              </Box>
            </Card>
          </Grid>
          {/* collect in month */}
          <Grid item >
            <Card sx={{
              padding: '1.5rem',
              width: '400px',
              height: '150px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 3
            }}>
              <SavingsIcon color='secondary' sx={{ fontSize: '5rem' }} />
              <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Typography fontSize={'1.4rem'} fontWeight='700'>Collect in {moment(mCal).format('MMMM')}</Typography>
                <Box>
                  <Typography fontSize={'1.5rem'} title='Month'>
                    <span style={{fontSize: '1rem', color: '#888'}} title='month'>Month:</span> {currencyFormat(collectOfMonth())}
                  </Typography>
                  <Typography fontSize={'1.2rem'} title='Reality'>
                    <span style={{fontSize: '1rem', color: '#888'}} title='month'>Reality:</span> {currencyFormat(realityCollectofMonth)}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          {/* spending in month */}
          <Grid item>
            <Card sx={{
              padding: '1.5rem',
              width: '400px',
              height: '150px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 3
            }}>
              <PointOfSaleIcon color='primary' sx={{ fontSize: '5rem' }} />
              <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Typography fontSize={'1.4rem'} fontWeight='700'>Spending in {moment(mCal).format('MMMM')}</Typography>
                <Box>
                  <Typography fontSize={'1.5rem'}>
                    <span style={{fontSize: '1rem', color: '#888'}} title='month'>Month:</span> {currencyFormat(spendOfMonth())}
                  </Typography>
                  <Typography fontSize={'1.2rem'} title='Reality'>
                    <span style={{fontSize: '1rem', color: '#888'}} title='month'>Reality:</span> {currencyFormat(realitySpendofMonth)}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          {/* total */}
          <Grid item>
            <Card sx={{
              padding: '1.5rem',
              width: '400px',
              height: '150px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 3
            }}>
              <PriceChangeIcon color='warning' sx={{ fontSize: '5rem' }} />
              <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Typography fontSize={'1.4rem'} fontWeight='700'>{moment(mCal).format('MMMM')} fund</Typography>
                <Box>
                  <Typography fontSize={'1.5rem'}>
                    <span style={{fontSize: '1rem', color: '#888'}} title='month'>Total:</span> {currencyFormat(fundTotalDone)}
                  </Typography>
                  <Typography fontSize={'1.2rem'} title='Reality'>
                    <span style={{fontSize: '1rem', color: '#888'}} title='month'>Reality:</span> {currencyFormat(fundTotalSlacking)}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          {/* collect in day */}
          <Grid item>
            <Card sx={{
              padding: '1.5rem',
              width: '400px',
              height: '150px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5
            }}>
              <SavingsIcon sx={{ fontSize: '4rem', ml: '.5rem', color: '#FE9DB0' }} />
              <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Typography fontSize={'1.5rem'} fontWeight='700'>Collect in day</Typography>
                <Box>
                  <Typography fontSize={'2.5rem'}>{currencyFormat(collect)}</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          {/* spending in day */}
          <Grid item>
            <Card sx={{
              padding: '1.5rem',
              width: '400px',
              height: '150px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5
            }}>
              <PointOfSaleIcon sx={{ fontSize: '4rem', ml: '.5rem', color: '#40BDE8' }} />
              <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Typography fontSize={'1.5rem'} fontWeight='700'>Spending in day</Typography>
                <Box>
                  <Typography fontSize={'2.5rem'}>{currencyFormat(spend)}</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
        <Chart options={dataLine.options} series={dataLine.series} type="line" height={'450px'} />
      </Box>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <Fade in={open}>
          <Box
            component={'form'}
            onSubmit={handleSubmit}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              borderRadius: '10px',
              border: '2px solid #11568C',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography mb={4} variant='h4'>Targets of {moment(mCal).format('MMMM')}</Typography>
            <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '2rem'}}>
              <TextField name='targets' fullWidth defaultValue={getTargets(mCal)} />
              <LoadingButton loading={loading} type={'submit'}><PriceCheckIcon /></LoadingButton>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  )
}

export default Home;