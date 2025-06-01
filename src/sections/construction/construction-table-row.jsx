/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';

import { Box } from '@mui/material';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

import { fTime, fDate } from 'src/utils/format-time';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

export function RenderSpoolZone({ params }) {
  return <>{params.row.zone}</>;
}

export function RenderSystemName({ params }) {
  return <>{params.row.systemname}</>;
}

RenderSystemName.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderRev({ params }) {
  return <>{params.row.rev}</>;
}

RenderRev.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};
export function RenderDwg({ params }) {
  return <>{params.row.dwgno}</>;
}

RenderDwg.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};
export function RenderValveNo({ params }) {
  return <>{params.row.valvenumber}</>;
}

RenderValveNo.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderItem({ params }) {
  return <>{params.row.item}</>;
}

RenderItem.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderDN({ params }) {
  return <>{params.row.dn}</>;
}

RenderDN.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderPN({ params }) {
  return <>{params.row.pn}</>;
}

RenderPN.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderType({ params }) {
  return <>{params.row.type}</>;
}

RenderType.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderConn({ params }) {
  return <>{params.row.conn}</>;
}

RenderConn.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderTotal({ params }) {
  return <>{params.row.total}</>;
}

RenderTotal.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderDelivery({ params }) {
  return <>{params.row.delivery}</>;
}

RenderDelivery.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderActuatorDelivery({ params }) {
  return <>{params.row.actuatorDelivery}</>;
}

RenderActuatorDelivery.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderValveInstallation({ params }) {
  return <>{params.row.valveInstallation}</>;
}

RenderValveInstallation.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderActuatorInstallation({ params }) {
  return <>{params.row.actuatorInstallation}</>;
}

RenderActuatorInstallation.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderCompanyName({ params }) {
  return <>{params.row.companyName}</>;
}

RenderCompanyName.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderNotes({ params }) {
  return <>{params.row.notes}</>;
}

RenderNotes.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};
RenderSpoolZone.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};
export function RenderSpoolSystemNo({ params }) {
  // Renk belirlemek için istediğiniz koşulları burada tanımlayın

  return <>{params.row.systemno}</>;
}

RenderSpoolSystemNo.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderSpoolSystemName({ params }) {
  return <>{params.row.systemname}</>;
}

RenderSpoolSystemName.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderSpoolIsometricNo({ params }) {
  return <>{params.row.isometrino}</>;
}

RenderSpoolIsometricNo.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderSpoolNo({ params }) {
  return <>{params.row.spoolno}</>;
}

RenderSpoolNo.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderSpoolRev({ params }) {
  return <>{params.row.rev}</>;
}

RenderSpoolRev.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderSpoolDate({ params }) {
  return <>{new Date(params.row.date).toLocaleDateString()}</>;
}

RenderSpoolDate.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderSpoolWeight({ params }) {
  return <>{params.row.weight}</>;
}

RenderSpoolWeight.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderSpoolSurface({ params }) {
  return <>{params.row.surface}</>;
}

RenderSpoolSurface.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderSpoolTotalSpool({ params }) {
  return <>{params.row.totalspool}</>;
}

RenderSpoolTotalSpool.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderSpoolProduction({ params }) {
  return <>{params.row.production}</>;
}

RenderSpoolProduction.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderSpoolAssembly({ params }) {
  return <>{params.row.assembly}</>;
}

RenderSpoolAssembly.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderSpoolTestDelivery({ params }) {
  return <>{params.row.test_delivery}</>;
}

RenderSpoolTestDelivery.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderSpoolInstallationCompany({ params }) {
  return <>{params.row.installation_company}</>;
}

RenderSpoolInstallationCompany.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderSpoolManufacturingCompany({ params }) {
  return <>{params.row.manufanctuning_company}</>;
}

RenderSpoolManufacturingCompany.propTypes = {
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

export function RenderSpoolNumber({ params }) {
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
            {params.row.Spool_Number}
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

RenderSpoolNumber.propTypes = {
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
