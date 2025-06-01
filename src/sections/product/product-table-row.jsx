/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { grey } from '@mui/material/colors';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

import { fCurrency } from 'src/utils/format-number';
import { fTime, fDate } from 'src/utils/format-time';

import Label from 'src/components/label';

// ----------------------------------------------------------------------
const closedcolor = {
  main: grey[500],
  light: grey[500],
  dark: grey[500],
  contrastText: grey[500],
};
export function RenderCellPrice({ params }) {
  return <>{fCurrency(params.row.price)}</>;
}
RenderCellPrice.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderRemarkType({ params }) {
  return <>{params.row.type}</>;
}

RenderRemarkType.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderRemarkProject({ params }) {
  return <>{params.row.project}</>;
}

RenderRemarkProject.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderRemarkOwner({ params }) {
  return <>{params.row.owner}</>; // fCurrency para birimleri için kullanılır
}

RenderRemarkOwner.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};
export function RenderRemarkWriter({ params }) {
  return <>{params.row.writer}</>;
}

RenderRemarkWriter.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderRemarkTitle({ params }) {
  return <>{params.row.title}</>;
}

RenderRemarkTitle.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderCellStatu({ params }) {
  return (
    <Label
      variant="soft"
      color={
        // eslint-disable-next-line no-nested-ternary
        params.row.statu === 'InProgress'
          ? 'primary'
          : params.row.statu === 'Written'
            ? 'secondary'
            : params.row.statu === 'Suspended'
              ? 'warning'
              : params.row.statu === 'Cancelled'
                ? 'warning'
                : // eslint-disable-next-line no-nested-ternary
                  params.row.statu === 'Closed'
                  ? 'error'
                  : params.row.statu === 'Authorized'
                    ? 'info'
                    : params.row.statu === 'Done'
                      ? 'success'
                      : params.row.statu === 'Published'
                        ? 'secondary'
                        : 'default'
      }
    >
      {params.row.statu}
    </Label>
  );
}

RenderCellStatu.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderCellCreatedAt({ params }) {
  return (
    <ListItemText
      primary={fDate(params.row.created_at)}
      secondary={fTime(params.row.created_at)}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

RenderCellCreatedAt.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderCellUpdatedAt({ params }) {
  return (
    <ListItemText
      primary={fDate(params.row.updated_at)}
      secondary={fTime(params.row.updated_at)}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

RenderCellUpdatedAt.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};
export function RenderCellStock({ params }) {
  return (
    <Stack sx={{ typography: 'caption', color: 'text.secondary' }}>
      <LinearProgress
        value={(params.row.available * 100) / params.row.quantity}
        variant="determinate"
        color={
          (params.row.inventoryType === 'out of stock' && 'error') ||
          (params.row.inventoryType === 'low stock' && 'warning') ||
          'success'
        }
        sx={{ mb: 1, height: 6, maxWidth: 80 }}
      />
      {!!params.row.available && params.row.available} {params.row.inventoryType}
    </Stack>
  );
}

RenderCellStock.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderRemarkNumber({ params }) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      {/* <Avatar     TODO: Resim kısmı listede remark liste istenirse başka resim eklenebilir.
        alt={params.row.name}
        src={params.row.coverUrl}
        variant="rounded"
        sx={{ width: 64, height: 64, mr: 2 }}
      /> */}

      <ListItemText
        disableTypography
        primary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={params.row.onViewRow}
            sx={{ cursor: 'pointer' }}
          >
            {params.row.Remark_Number}
          </Link>
        }
        secondary={
          <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
            {params.row.category}
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}

RenderRemarkNumber.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};
export function RenderCellProduct({ params }) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      {/* <Avatar     TODO: Resim kısmı listede remark liste istenirse başka resim eklenebilir.
        alt={params.row.name}
        src={params.row.coverUrl}
        variant="rounded"
        sx={{ width: 64, height: 64, mr: 2 }}
      /> */}

      <ListItemText
        disableTypography
        primary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={params.row.onViewRow}
            sx={{ cursor: 'pointer' }}
          >
            {params.row.name}
          </Link>
        }
        secondary={
          <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
            {params.row.category}
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}

RenderCellProduct.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};
