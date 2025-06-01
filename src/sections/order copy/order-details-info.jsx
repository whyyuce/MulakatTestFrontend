import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFEditor, RHFUpload } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function OrderDetailsInfo({ customer, delivery, payment, shippingAddress }) {
  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      subDescription: '',
      images: [],
      //
      code: '',
      sku: '',
      price: 0,
      quantity: 0,
      priceSale: 0,
      tags: [],
      taxes: 0,
      gender: '',
      category: '',
      colors: [],
      sizes: [],
      newLabel: { enabled: false, content: '' },
      saleLabel: { enabled: false, content: '' },
    }),
    []
  );
  const methods = useForm({
    resolver: yupResolver(defaultValues),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const values = watch();
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', []);
  }, [setValue]);

  const renderCustomer = (
    <>
      <CardHeader
        title="Customer Info"
        action={
          <IconButton>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      />
      <Stack direction="row" sx={{ p: 3 }}>
        <Avatar
          alt={customer.name}
          src={customer.avatarUrl}
          sx={{ width: 48, height: 48, mr: 2 }}
        />

        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2">{customer.name}</Typography>

          <Box sx={{ color: 'text.secondary' }}>{customer.email}</Box>

          <Box>
            IP Address:
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {customer.ipAddress}
            </Box>
          </Box>

          <Button
            size="small"
            color="error"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ mt: 1 }}
          >
            Add to Blacklist
          </Button>
        </Stack>
      </Stack>
    </>
  );

  const renderDelivery = (
    <Grid xs={12} md={6}>
      <CardHeader
        title="Remark Detail"

        // Kalem işareti
        // action={
        //   <IconButton>
        //     <Iconify icon="solar:pen-bold" />
        //   </IconButton>
        // }
      />

      <Stack direction="column" alignItems="center" spacing={3} sx={{ p: 1 }}>
        <Card sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" marginBottom={1} sx={{ display: 'flex' }}>
            <Divider
              sx={{
                backgroundColor: 'white',
                height: 1,
                width: { xs: '100%', md: 550 },
                opacity: 0.001,
              }}
            />
          </Stack>
          <Stack direction="row" alignItems="center" marginBottom={1}>
            <Box component="span" sx={{ color: 'text.secondary', width: 150, flexShrink: 0 }}>
              Project
            </Box>
            <Box sx={{ whiteSpace: 'nowrap' }}>NB1001</Box>
            {/* {delivery.speedy} */}
          </Stack>
          <Stack direction="row" alignItems="center" marginBottom={1}>
            <Box component="span" sx={{ color: 'text.secondary', width: 150, flexShrink: 0 }}>
              Last Date
            </Box>
            2023-07-17
            {/* {delivery.speedy} */}
          </Stack>
          <Stack direction="row" alignItems="center" marginBottom={1}>
            <Box component="span" sx={{ color: 'text.secondary', width: 150, flexShrink: 0 }}>
              Type
            </Box>
            Klass
            {/* {delivery.speedy} */}
          </Stack>
          <Stack direction="row" alignItems="center" marginBottom={1}>
            <Box component="span" sx={{ color: 'text.secondary', width: 150, flexShrink: 0 }}>
              Writer
            </Box>
            DNV
            {/* {delivery.speedy} */}
          </Stack>

          <Stack direction="row" alignItems="center" marginBottom={1}>
            <Box component="span" sx={{ color: 'text.secondary', width: 150, flexShrink: 0 }}>
              Topic
            </Box>
            Planlama
            {/* {delivery.speedy} */}
          </Stack>
          <Stack direction="row" alignItems="center" marginBottom={1}>
            <Box component="span" sx={{ color: 'text.secondary', width: 150, flexShrink: 0 }}>
              Owner
            </Box>
            Ahmet
            {/* {delivery.speedy} */}
          </Stack>
          <Stack direction="row" alignItems="center" marginBottom={1}>
            <Box component="span" sx={{ color: 'text.secondary', width: 150, flexShrink: 0 }}>
              Title
            </Box>
            Fire Safety {/* {delivery.speedy} */}
          </Stack>
          <Stack direction="row" alignItems="center" marginBottom={1}>
            <Box component="span" sx={{ color: 'text.secondary', width: 150, flexShrink: 0 }}>
              Description
            </Box>
            <Link underline="always" color="inherit">
              Fire Safety Resmi güncellenmeli
              {/* {delivery.trackingNumber} */}
            </Link>
          </Stack>
          <Stack marginTop={2} spacing={1.5}>
            <Typography variant="subtitle2">Notes</Typography>
            <RHFEditor name="editorFieldName" label="Editor Field" />
          </Stack>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Images</Typography>
            <RHFUpload multiple thumbnail name="images" maxSize={3145728} label="Editor Field" />
          </Stack>
          <Stack direction="row-reverse" spacing={3.5} alignItems="center" marginTop={2}>
            <LoadingButton type="alert" variant="contained" loading={null}>
              Save Changes
            </LoadingButton>
          </Stack>
        </Card>
      </Stack>
    </Grid>
  );

  const renderShipping = (
    <>
      <CardHeader
        title="Shipping"
        action={
          <IconButton>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Address
          </Box>
          {shippingAddress.fullAddress}
        </Stack>

        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Phone number
          </Box>
          {shippingAddress.phoneNumber}
        </Stack>
      </Stack>
    </>
  );

  const renderPayment = (
    <>
      <CardHeader
        title="Payment"
        action={
          <IconButton>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      />
      <Stack direction="row" alignItems="center" sx={{ p: 3, typography: 'body2' }}>
        <Box component="span" sx={{ color: 'text.secondary', flexGrow: 1 }}>
          Phone number
        </Box>

        {payment.cardNumber}
        <Iconify icon="logos:mastercard" width={24} sx={{ ml: 0.5 }} />
      </Stack>
    </>
  );

  return (
    <FormProvider methods={methods}>
      {/* {renderCustomer} */}
      <Grid container spacing={1}>
        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderDelivery}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* {renderShipping} */}

        {/* {renderPayment} */}
      </Grid>
    </FormProvider>
  );
}

OrderDetailsInfo.propTypes = {
  customer: PropTypes.object,
  delivery: PropTypes.object,
  payment: PropTypes.object,
  shippingAddress: PropTypes.object,
};
