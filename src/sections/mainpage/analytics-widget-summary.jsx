import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles'; // alpha'yı buradan import ediyoruz

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fShortenNumber } from 'src/utils/format-number';

// Eğer bgGradient projenizde tanımlı bir fonksiyonsa doğru dosyadan import edin
import { bgGradient } from 'src/theme/css';

// ----------------------------------------------------------------------

export default function AnalyticsWidgetSummary({
  title,
  total,
  road,
  icon,
  color = 'primary',
  sx,
  ...other
}) {
  const theme = useTheme();
  const router = useRouter();

  const handleOnClick = () => {
    // Tıklama işlemi
    if (road === 'rmk') {
      router.push(paths.dashboard.product.root);
    } else if (road === 'cst') {
      router.push(paths.dashboard.product.root);
    } else if (road === 'dsn') {
      router.push(paths.dashboard.product.root);
    } else if (road === 'mtn') {
      router.push(paths.dashboard.product.root);
    }
  };

  return (
    <Stack
      alignItems="center"
      onClick={handleOnClick}
      sx={{
        ...bgGradient({
          direction: '135deg',
          startColor: alpha(theme.palette[color].light, 0.2),
          endColor: alpha(theme.palette[color].main, 0.2),
        }),
        py: 5,
        borderRadius: 2,
        textAlign: 'center',
        color: theme.palette[color].darker,
        backgroundColor: 'common.white',
        ...sx,
      }}
      {...other}
    >
      {icon && <Box sx={{ width: 64, height: 64, mb: 1 }}>{icon}</Box>}

      <Typography variant="h3">{fShortenNumber(total)}</Typography>

      <Typography variant="h4" sx={{ opacity: 0.64 }}>
        {title.split(' ').slice(0, 2).join(' ')} <br />
        {title.split(' ').slice(2).join(' ')}
      </Typography>
    </Stack>
  );
}

AnalyticsWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
};
