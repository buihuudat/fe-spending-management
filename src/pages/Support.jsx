import * as React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@mui/material/SvgIcon';
import { alpha, styled } from '@mui/material/styles';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import Collapse from '@mui/material/Collapse';
// web.cjs is required for IE11 support
import { useSpring, animated } from 'react-spring';
import { Box, Typography, Link } from '@mui/material';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import HotelIcon from '@mui/icons-material/Hotel';
import RepeatIcon from '@mui/icons-material/Repeat';

import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';

const file = require('../files/Book1.xlsx');

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

function TransitionComponent(props) {
  const style = useSpring({
    from: {
      opacity: 0,
      transform: 'translate3d(20px,0,0)',
    },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

TransitionComponent.propTypes = {
  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool,
};

const StyledTreeItem = styled((props) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

export default function Support() {
  document.title = 'Support | Spending App'
  return (
   <Box sx={{
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center',
      gap: 1,
      p: 5
    }}>
    <Typography 
      variant='h3' 
      align='center' 
      fontWeight={'600'} 
    >Spending App</Typography>
    <Typography 
      paragraph
      p={2}
      maxWidth='xs'
      align='center'
    >Spending app ???????c thi???t k??? v?? x??y d???ng b???i <Link target={'_blank'} underline={'none'} href='https://facebook.com/1150694301'><b>Bui Huu Dat</b></Link>.
      <br/> T??i lu??n lo s??? m???t ng??y n??o ???? file th???ng k?? chi ti??u c???a t??i kh??ng c??nh m?? bay ????. 
      N??n t??i quy???t ?????nh t???o ra m???t con app c?? th??? th???ng k?? chi ti??u l?? l??u d??? li???u c???a t??i tr???c tuy???n.
      ???????c thi???t k??? d???a tr??n file th???ng k?? chi ti??u c???a t??i ???? t???o n??n s??? c?? ?????y ch???c n??ng m?? file g???c c?? (c?? th??? kh??ng gi???ng ho??n to??n ????????.<br/>
      B???n c?? th??? tham kh???o file g???c t??i ????? <Link href={file}>??? ????y</Link>
    </Typography>

    {/* gi???i th??ch ch???c n??ng */}
    <Box p={5}>
    <Typography fontWeight={600} variant='h5'>Gi???i th??ch ch???c n??ng:</Typography>
    <ul>
      <li>
        <Typography variant='h6'>Target of month</Typography>
        <Typography>- Chi ti??u ban ?????u b???n mu???n ????a ra trong th??ng ????
          (v?? d??? b???n nh???p: 3.000.000 m???c ti??u c???a th??ng ???? c???a b???n l?? 3.000.000)
          app s??? t??nh cho b???n c?? th??? chi bao nhi??u ti???n trong 1 ng??y.
        </Typography>
      </li>
      <li>
        <Typography variant='h6'>Collect in month</Typography>
        <Typography>- T???ng c???ng kho???n thu trong m???t th??ng (???? thanh to??n). <br/>
        - Trong m???c th??m chi ti??u s??? c?? ?? ch???n t??nh tr???ng (Done/ Slacking). Kho???n thu s??? ???????c c???ng khi t??nh tr???ng l?? "Done".<br/>
        Reality(th???c t???): T???ng c???ng t???t c??? c??c kho???n thu trong 1 th??ng (Done & Slacking).
        </Typography>
      </li>
      <li>
        <Typography variant='h6'>Spending in month</Typography>
        <Typography>- T???ng c???ng kho???n chi trong m???t th??ng (???? thanh to??n). <br/>
        - Trong m???c th??m chi ti??u s??? c?? ?? ch???n t??nh tr???ng (Done/ Slacking). Kho???n chi s??? ???????c c???ng khi t??nh tr???ng l?? "Done".
        Reality(th???c t???): T???ng c???ng t???t c??? c??c kho???n thu trong 1 th??ng (Done & Slacking).
        </Typography>
      </li>
      <li>
        <Typography variant='h6'>Collect in day</Typography>
        <Typography>- T???ng thu trong 1 ng??y. <br/>
        - Trong m???c th??m chi ti??u s??? c?? ?? ch???n t??nh tr???ng (Done/ Slacking). Kho???n thu s??? ???????c c???ng khi t??nh tr???ng l?? "Done".
        </Typography>
      </li>
      <li>
        <Typography variant='h6'>Spending in day</Typography>
        <Typography>- T???ng chi trong 1 ng??y. <br/>
        - Trong m???c th??m chi ti??u s??? c?? ?? ch???n t??nh tr???ng (Done/ Slacking). Kho???n chi s??? ???????c c???ng khi t??nh tr???ng l?? "Done".
        </Typography>
      </li>
      <li>
        <Typography variant='h6'>Month fund</Typography>
        <Typography>- T???ng ti???n qu??? c???a th??ng ????.<br/>
          - Ti???n qu??? = Ch??? ti??u + Kho???n thu - Kho???n chi (status: Done)
        </Typography>
      </li>
    </ul>
    </Box>
    
    {/* tree and something... */}
    <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
      <Box sx={{display: 'flex', flexDirection: 'column',  justifyContent: 'center'}}>
        <Typography variant='h5' p={5} fontWeight={600}>C???u tr??c app ????</Typography>
        <TreeView
          aria-label="customized"
          defaultExpanded={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']}
          defaultCollapseIcon={<MinusSquare />}
          defaultExpandIcon={<PlusSquare />}
          defaultEndIcon={<CloseSquare />}
          sx={{ height: '100%', flexGrow: 1, minWidth: 400, overflowY: 'auto' }}
        >
          <StyledTreeItem nodeId="1" label="Speding App">
            <StyledTreeItem nodeId="2" label="Frontend">
              <StyledTreeItem nodeId="3" label="Language">
                <StyledTreeItem nodeId="4" label="HTML" />
                <StyledTreeItem nodeId="4" label="Scss" />
                <StyledTreeItem nodeId="4" label="JSX" />
              </StyledTreeItem>
              <StyledTreeItem nodeId="5" label="Framework">
                <StyledTreeItem nodeId="6" label="React" />
                <StyledTreeItem nodeId="6" label="React-redux" />
                <StyledTreeItem nodeId="6" label="Redux-persist" />
                <StyledTreeItem nodeId="6" label="Axios" />
                <StyledTreeItem nodeId="6" label="..." />
              </StyledTreeItem>
              <StyledTreeItem nodeId="7" label="UI">
                <StyledTreeItem nodeId="8" label="@mui" />
                <StyledTreeItem nodeId="8" label="React Chartjs" />
                <StyledTreeItem nodeId="8" label="..." />
              </StyledTreeItem>
            </StyledTreeItem>
            <StyledTreeItem nodeId="10" label="Backend">
              <StyledTreeItem nodeId="11" label="Language">
                <StyledTreeItem nodeId="12" label="Javascript" />
              </StyledTreeItem>
              <StyledTreeItem nodeId="13" label="Framework">
                <StyledTreeItem nodeId="14" label="Express" />
                <StyledTreeItem nodeId="14" label="CryptoJS" />
                <StyledTreeItem nodeId="14" label="..." />
              </StyledTreeItem>
              <StyledTreeItem nodeId="15" label="Database">
                <StyledTreeItem nodeId="16" label="Mongoose DB" />
              </StyledTreeItem>
            </StyledTreeItem>
          </StyledTreeItem>
        </TreeView>
      </Box>
      <Box sx={{display: 'flex', flexDirection: 'column', textAlign: 'center', justifyContent: 'center'}}>
        <Typography variant='h5' p={5} fontWeight={600}>My life ????</Typography>
        <Timeline position="alternate">
          <TimelineItem>
            <TimelineOppositeContent
              sx={{ m: 'auto 0' }}
              align="right"
              variant="body2"
              color="text.secondary"
            >
              7:30 am
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot>
                <FastfoodIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Typography variant="h6" component="span">
                Eat
              </Typography>
              <Typography>Because i need strength</Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent
              sx={{ m: 'auto 0' }}
              variant="body2"
              color="text.secondary"
            >
              8:00 am
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot color="primary">
                <LaptopMacIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Typography variant="h6" component="span">
                Code
              </Typography>
              <Typography>Because it&apos;s awesome!</Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
          <TimelineOppositeContent
              sx={{ m: 'auto 0' }}
              variant="body2"
              color="text.secondary"
            >
              12:00 pm
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot color="primary" variant="outlined">
                <HotelIcon />
              </TimelineDot>
              <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Typography variant="h6" component="span">
                Sleep
              </Typography>
              <Typography>Because i need rest</Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
              <TimelineDot color="secondary">
                <RepeatIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Typography variant="h6" component="span">
                Repeat
              </Typography>
              <Typography>Because this is the life my love!</Typography>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </Box>
    </Box>
    {/* contact */}
    <Box pt={6} sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <Typography variant='h5' align='center' fontWeight={600}>M???i th???c m???c vui l??ng li??n h??? qua</Typography>
      <Box m={'0 auto'} sx={{display: 'flex', flexDirection: 'row', p: 1, gap: 3}}>
        <Link href='https://facebook.com/1150694301'><FacebookIcon sx={{fontSize: '3rem', cursor: 'pointer'}} /></Link>
        <Link href='mailto:dat54261001@gmail.com'><EmailIcon sx={{fontSize: '3rem', cursor: 'pointer'}} color={'warning'} /></Link>
      </Box>
    </Box>
   </Box>
  );
}
