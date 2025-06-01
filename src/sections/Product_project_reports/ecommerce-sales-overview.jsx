import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fPercent } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function EcommerceSalesOverview({ title, subheader, data, ...other }) {
  const router = useRouter();
  console.log('data', data);
  const totalAmount = data.reduce((total, item) => total + item.totalAmount, 0);
  console.log('tot', totalAmount);

  const handlenavigate = (label, title) => () => {
    router.push(paths.dashboard.product.root, { state: { Data: label, Data2: title } });
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Stack spacing={4} sx={{ px: 3, pt: 3, pb: 5 }}>
        {data.map((progress) => (
          <ProgressItem
            key={progress.label}
            progress={progress}
            totalAmount={totalAmount}
            onLinearProgressClick={handlenavigate(progress.label, title)}
          />
        ))}
      </Stack>
    </Card>
  );
}

EcommerceSalesOverview.propTypes = {
  data: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function ProgressItem({ progress, totalAmount, onLinearProgressClick }) {
  const percentage = ((progress.totalAmount / totalAmount) * 100).toFixed(2);
  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <Grid container direction="row" alignItems="center">
          <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
            {progress.label}
          </Typography>

          <Typography variant="subtitle2">{progress.totalAmount}</Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            &nbsp;({fPercent(percentage)})
          </Typography>
        </Grid>
      </Grid>

      <Grid item onClick={onLinearProgressClick}>
        {' '}
        {/* onClick buraya taşındı */}
        <LinearProgress
          variant="determinate"
          value={progress.value}
          color={
            (progress.label === 'Done' && 'success') ||
            (progress.label === 'Authorized' && 'info') ||
            (progress.label === 'InProgress' && 'primary') ||
            (progress.label === 'Suspended' && 'warning') ||
            (progress.label === 'Cancelled' && 'warning') ||
            (progress.label === 'Published' && 'secondary') ||
            (progress.label === 'Closed' && 'error') ||
            'primary'
          }
        />
      </Grid>
    </Grid>
  );
}

ProgressItem.propTypes = {
  progress: PropTypes.object,
  totalAmount: PropTypes.number,
  onLinearProgressClick: PropTypes.func,
};
