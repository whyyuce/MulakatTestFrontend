import * as React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Snackbar from '@mui/material/Snackbar';
import CardHeader from '@mui/material/CardHeader';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import FormProvider from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';

import eventEmitter from './view/event-emitter';

// ----------------------------------------------------------------------

export default function ProductDetailsInfo({
  data,
  customer,
  updateRemarkData,
  updateSecondCommData,
  updateCommData,
  updateStatus,

  delivery,
  payment,
  shippingAddress,
}) {
  console.log('data', data);
  const [remarks, setRemarks] = useState([]);

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);

  const [promiseArguments, setPromiseArguments] = React.useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(null);

  const [check, setCheck] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const noButtonRef = React.useRef(null);
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
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles([...files, ...newFiles]);
    },
    [files]
  );
  const processRowUpdate = React.useCallback(
    (status, oldRow) =>
      new Promise((resolve, reject) => {
        const mutation = computeMutation(status, oldRow);
        if (mutation) {
          // Save the arguments to resolve or reject the promise later
          setPromiseArguments({ resolve, reject, status, oldRow });
        } else {
          resolve(null); // Nothing was changed
        }
      }),
    []
  );
  function computeMutation(status) {
    if (status !== data.statu) {
      return `Status from '${data.statu}' to '${status}'`;
    }
    return null;
  }

  const renderButtonsByStatus = () => {
    switch (data.statu) {
      case 'Published':
        return (
          <>
            {renderButton('Authorized', 'info')}
            {renderButton('Cancelled', 'warning')}
          </>
        );
      case 'Draft':
        return (
          <>
            {renderButton('Published', 'secondary')}
            {renderButtonEdit('Edit', 'warning')}
          </>
        );
      case 'Authorized':
        return (
          <>
            {renderButton('InProgress', 'primary')}
            {renderButton('Suspended', 'warning')}
          </>
        );
      case 'InProgress':
        return (
          <>
            {renderButton('Done', 'success')}
            {renderButton('Suspended', 'warning')}
          </>
        );
      case 'Done':
        return (
          <>
            {renderButton('InProgress', 'primary')}
            {renderButton('Closed', 'error')}
          </>
        );
      case 'Suspended':
        return (
          <>
            {renderButton('Authorized', 'info')}
            {renderButton('Cancelled', 'warning')}
          </>
        );
      case 'Closed':
        return <></>;
      case 'Cancelled':
        return (
          <>
            {renderButton('InProgress', 'primary')}
            {renderButton('Closed', 'error')}
          </>
        );
      default:
        return null;
    }
  };

  const handleRemoveFile = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };
  const handleEditNavigate = useCallback(
    (item) => {
      console.log('row', data);

      router.push(paths.dashboard.product.edit(data), { state: { rowData: data } });
    },
    [router]
  );

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };
  const handleClick = async () => {
    setLoading(true); // Yükleme durumunu başlat

    try {
      const remarkId = data._id; // İstediğiniz remark ID'sini alın

      const formData = new FormData();
      files.forEach((file, index) => {
        const fieldName = `file${index + 1}`;
        formData.append('files', file);
      });

      // Dosyaları ilişkilendirilmiş remark ile yükle
      const uploadResponse = await fetch(`http://localhost:3000/api/file/upload/${remarkId}`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload files');
      }

      const uploadData = await uploadResponse.json();
      console.log('Files uploaded successfully:', uploadData);

      // Dosyalar yüklendikten sonra, kullanıcının girdiği metni içeren bir comment oluşturmak için istek yap
      const commentResponse = await fetch('http://localhost:3000/api/comments/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          remarkId,
          text: watch('editorFieldName'), // Kullanıcının girdiği metin
          files: uploadData.fileIds, // Yüklenen dosyaların ID'leri
        }),
      });

      if (!commentResponse.ok) {
        throw new Error('Failed to add comment');
      }

      const commdata = await commentResponse.json();
      console.log('comDatam', commdata);
      if (typeof updateSecondCommData === 'function') {
        updateSecondCommData(commdata.comments);
      } else {
        console.log('typeof', typeof updateSecondCommData);
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false); // Yükleme durumunu durdur
  };
  const renderButton = (status, color) => (
    <Button
      key={status}
      color={color}
      variant="contained"
      onClick={() => handleStatusChange(status)}
    >
      {status}
    </Button>
  );
  const renderButtonEdit = (status, color) => (
    <Button key={status} color={color} variant="contained" onClick={() => handleEditNavigate()}>
      {status}
    </Button>
  );
  const handleUpdateState = async () => {
    eventEmitter.emit('statusUpdated');
    try {
      const response = await fetch(`http://localhost:3000/api/remarks/update/${data._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statu: newStatus }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const commentResponse = await fetch(`http://localhost:3000/api/comments/add-comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          remarkId: data._id,
          text: `Status changed to ${newStatus}`,
          currentStatus: data.statu,
        }),
      });

      if (!commentResponse.ok) {
        throw new Error('API request failed');
      }

      const commdata = await commentResponse.json();
      updateCommData(commdata.comments);
      const apidata = await response.json();
      updateRemarkData(apidata.data);

      setSnackbar({ children: 'Remark successfully saved', severity: 'success' });
    } catch (error) {
      setSnackbar({ children: 'Remark could not be saved', severity: 'error' });
      console.error('API request error:', error);
    }
    setDialogOpen(false);
  };

  const handleStatusChange = (status) => {
    setNewStatus(status);
    setDialogOpen(true);
  };
  const renderConfirmDialog = () => (
    <Dialog maxWidth="xs" open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent
        dividers
      >{`Pressing 'Yes' will change the status to '${newStatus}'.`}</DialogContent>
      <DialogActions>
        <Button ref={noButtonRef} onClick={() => setDialogOpen(false)}>
          No
        </Button>
        <Button onClick={handleUpdateState}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
  {
    // TODO: Width düzenlenmeli bu ksıımda sx 350 sorunu var
  }
  const renderDelivery = (
    <Grid xs={12} md={6} justifyContent="center">
      {renderConfirmDialog()}
      <CardHeader title="Remark Detail" sx={{ marginLeft: 7 }} />

      <Stack direction="column" alignItems="center" spacing={3} sx={{ p: 1 }}>
        <Card sx={{ p: 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            marginBottom={1}
            sx={{ width: 350, display: 'flex' }}
          />
          <Stack direction="row" alignItems="center" marginBottom={1}>
            <Box component="span" sx={{ color: 'text.secondary', width: 150, flexShrink: 0 }}>
              Remark Number
            </Box>
            {data?.Remark_Number}
            {/* {delivery.speedy} */}
          </Stack>
          <Stack direction="row" alignItems="center" marginBottom={1}>
            <Box component="span" sx={{ color: 'text.secondary', width: 150, flexShrink: 0 }}>
              Project
            </Box>
            {data?.project}
            {/* {delivery.speedy} */}
          </Stack>
          <Stack direction="row" alignItems="center" marginBottom={1}>
            <Box component="span" sx={{ color: 'text.secondary', width: 150, flexShrink: 0 }}>
              Last Date
            </Box>
            {data?.lastdate}
            {/* {delivery.speedy} */}
          </Stack>

          <Stack direction="row" alignItems="center" marginBottom={1}>
            <Box component="span" sx={{ color: 'text.secondary', width: 150, flexShrink: 0 }}>
              Type
            </Box>
            {data?.type}
            {/* {delivery.speedy} */}
          </Stack>
          <Stack direction="row" alignItems="center" marginBottom={1}>
            <Box component="span" sx={{ color: 'text.secondary', width: 150, flexShrink: 0 }}>
              Writer
            </Box>
            {data.writer}
          </Stack>

          <Stack direction="row" alignItems="center" marginBottom={1}>
            <Box component="span" sx={{ color: 'text.secondary', width: 150, flexShrink: 0 }}>
              Topic
            </Box>
            {data.topic}
            {/* {delivery.speedy} */}
          </Stack>
          <Stack direction="row" alignItems="center" marginBottom={1}>
            <Box component="span" sx={{ color: 'text.secondary', width: 150, flexShrink: 0 }}>
              Owner
            </Box>
            {data.owner}
            {/* {delivery.speedy} */}
          </Stack>
          <Stack direction="row" alignItems="center" marginBottom={1}>
            <Box component="span" sx={{ color: 'text.secondary', width: 150, flexShrink: 0 }}>
              Title
            </Box>
            {data.title}
          </Stack>
          <Stack direction="row" alignItems="center" marginBottom={1}>
            <Box component="span" sx={{ color: 'text.secondary', width: 150, flexShrink: 0 }}>
              Description
            </Box>
            <Box
              component="div"
              sx={{ color: 'inherit' }}
              dangerouslySetInnerHTML={{ __html: data.desc }}
            />
          </Stack>
          <Stack direction="row" alignItems="center" marginBottom={1}>
            <Box component="span" sx={{ color: 'text.secondary', width: 150, flexShrink: 0 }}>
              Status
            </Box>
            <Link underline="always" color="inherit">
              {data.statu}
              {/* {delivery.trackingNumber} */}
            </Link>
          </Stack>
          <Stack marginTop={5} spacing={1.5}>
            {renderButtonsByStatus()}
          </Stack>
        </Card>
      </Stack>
      {!!snackbar && (
        <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </Grid>
  );

  return (
    <FormProvider methods={methods}>
      {/* {renderCustomer} */}

      {renderDelivery}
      <Snackbar open={!!snackbar} onClose={handleCloseSnackbar} autoHideDuration={6000}>
        <Alert {...snackbar} onClose={handleCloseSnackbar} />
      </Snackbar>
      {/* {renderPayment} */}
    </FormProvider>
  );
}

ProductDetailsInfo.propTypes = {
  customer: PropTypes.object,

  updateSecondCommData: PropTypes.func,
  delivery: PropTypes.object,
  payment: PropTypes.object,

  shippingAddress: PropTypes.object,
};
