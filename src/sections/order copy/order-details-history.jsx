import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Timeline from '@mui/lab/Timeline';
import Button from '@mui/material/Button';
import TimelineDot from '@mui/lab/TimelineDot';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

import { fDateTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export default function OrderDetailsHistory({ history, order1 }) {
  const renderSummary = (
    <Stack
      spacing={2}
      component={Paper}
      variant="outlined"
      sx={{
        p: 2.5,
        minWidth: 260,
        flexShrink: 0,
        borderRadius: 2,
        typography: 'body2',
        borderStyle: 'dashed',
      }}
    >
      <Stack spacing={0.5}>
        <Box sx={{ color: 'text.disabled' }}>Order time</Box>
        {fDateTime(history.orderTime)}
      </Stack>
      <Stack spacing={0.5}>
        <Box sx={{ color: 'text.disabled' }}>Payment time</Box>
        {fDateTime(history.orderTime)}
      </Stack>
      <Stack spacing={0.5}>
        <Box sx={{ color: 'text.disabled' }}>Delivery time for the carrier</Box>
        {fDateTime(history.orderTime)}
      </Stack>
      <Stack spacing={0.5}>
        <Box sx={{ color: 'text.disabled' }}>Completion time</Box>
        {fDateTime(history.orderTime)}
      </Stack>
    </Stack>
  );

  const renderTimeline = (
    <Timeline
      sx={{
        p: 0,
        m: 0,
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      {history.timeline.map((item, index) => {
        const firstTimeline = index === 0;
        console.log('itemlar', order1);

        const lastTimeline = index === history.timeline.length - 1;

        return (
          <TimelineItem key={item.title}>
            <TimelineSeparator>
              <TimelineDot
                color={
                  (item.title === 'Published' && 'primary') ||
                  (item.title === 'Approved' && 'success') ||
                  (item.title === 'In Progress' && 'info') ||
                  (item.title === 'Cancelled' && 'warning') ||
                  'error'
                }
              />
              {lastTimeline ? null : <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent>
              <Typography variant="subtitle2">{item.title}</Typography>

              <Stack direction="row" spacing={2}>
                {/* <Avatar
                  variant="rounded"
                  alt={order1[index].customer.name}
                  src={order1[index].customer.avatarUrl}
                  sx={{ width: 48, height: 48, flexShrink: 0 }}
                />
                <Avatar
                  variant="rounded"
                  alt={order1[index].customer.name}
                  src={order1[index].customer.avatarUrl}
                  sx={{ width: 48, height: 48, flexShrink: 0 }}
                />
                <Avatar
                  variant="rounded"
                  alt={order1[index].customer.name}
                  src={order1[index].customer.avatarUrl}
                  sx={{ width: 48, height: 48, flexShrink: 0 }}
                /> */}
              </Stack>
              <Typography variant="body1" sx={{ color: 'text.primary', mt: 0.5 }}>
                Bu bir yorum özelliği taşımaktadır.
              </Typography>

              <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
                {fDateTime(item.time)}
              </Box>
            </TimelineContent>
          </TimelineItem>
        );
      })}
      <Stack marginTop={5} spacing={1.5}>
        <Button color="primary" variant="contained">
          In Progress
        </Button>
        <Button color="secondary" variant="contained">
          Published
        </Button>
        <Button color="error" variant="contained">
          Suspended
        </Button>
      </Stack>
    </Timeline>
  );

  return (
    <Card>
      <CardHeader title="History" />
      <Stack
        spacing={3}
        alignItems={{ md: 'flex-start' }}
        direction={{ xs: 'column-reverse', md: 'row' }}
        sx={{ p: 3 }}
      >
        {/* <AnalyticsOrderTimeline title="Order Timeline" list={_analyticOrderTimeline} /> */}

        {renderTimeline}

        {/* {renderSummary} */}
      </Stack>
    </Card>
  );
}

OrderDetailsHistory.propTypes = {
  history: PropTypes.object,
};
