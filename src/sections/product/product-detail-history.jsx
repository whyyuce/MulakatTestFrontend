import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
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

import FormProvider, { RHFEditor, RHFUpload } from 'src/components/hook-form';

import MultipleFileView from './multipleview';
import eventEmitter from './view/event-emitter'; // Bu yolu MultiFileView bileşeninin bulunduğu dosyanın yolunu değiştirmeniz gerekecek

export default function ProductDetailsHistory({
  data,
  comms,
  updateRemarkData,

  updateSecondCommData,
  updateCommData,
  history,
  reviews,
}) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const handleRemoveFile = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };
  useEffect(() => {
    const handleStatusUpdateController = () => {
      handleClick();
    };

    eventEmitter.on('statusUpdated', handleStatusUpdateController);
    return () => {
      eventEmitter.off('statusUpdated', handleStatusUpdateController);
    };
  }, [files]);
  const handleClick = async () => {
    setLoading(true); // Yükleme durumunu başlat
    console.log('agA');
    try {
      const remarkId = data._id; // İstediğiniz remark ID'sini alın

      const formData = new FormData();
      files.forEach((file, index) => {
        const fieldName = `file${index + 1}`;
        formData.append('files', file);
      });

      console.log('ff', files);
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
          text: watch('editorFieldName') || 'File Uploaded', // Kullanıcının girdiği metin
          files: uploadData.fileIds, // Yüklenen dosyaların ID'leri
        }),
      });

      if (!commentResponse.ok) {
        throw new Error('Failed to add comment');
      }

      const commdata = await commentResponse.json();
      if (typeof updateSecondCommData === 'function') {
        updateSecondCommData(commdata.comments);
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false); // Yükleme durumunu durdur
  };

  const handleUpdateState = async (statusofremark) => {
    try {
      const response = await fetch(`http://localhost:3000/api/remarks/update/${data._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statu: statusofremark }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      // Yeni bir yorum ekleyin
      const commentResponse = await fetch(`http://localhost:3000/api/comments/add-comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          remarkId: data._id,
          text: `Status changed to ${statusofremark}`,
          currentStatus: statusofremark,
        }),
      });

      if (!commentResponse.ok) {
        throw new Error('API request failed');
      }

      const commdata = await commentResponse.json();
      updateCommData(commdata.comments);
      const apidata = await response.json();
      updateRemarkData(apidata.data);
    } catch (error) {
      console.error('API request error:', error);
    }
  };

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
      {comms.map((item, index) => {
        const lastTimeline = index === history.timeline.length - 1;

        return (
          <TimelineItem key={item.text}>
            <TimelineSeparator>
              <TimelineDot
                color={
                  (item.text.includes('InProgress') && 'primary') ||
                  (item.text.includes('Done') && 'success') ||
                  (item.text.includes('Published') && 'info') ||
                  (item.title === 'Cancelled' && 'warning') ||
                  'error'
                }
              />
              {lastTimeline ? null : <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent>
              <Box sx={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                <MultipleFileView files={item.files} />
              </Box>

              <Typography variant="subtitle2">{item.title}</Typography>

              <Typography variant="body1" sx={{ color: 'text.primary', mt: 0.5 }}>
                <Box
                  component="div"
                  sx={{ color: 'inherit' }}
                  dangerouslySetInnerHTML={{ __html: item.text }}
                />
              </Typography>

              <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ pt: 1 }} />
              <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
                {fDateTime(item.updatedAt)}
              </Box>
            </TimelineContent>
          </TimelineItem>
        );
      })}
      <Stack marginTop={2} spacing={1.5}>
        <Typography variant="subtitle2">Notes</Typography>
        <RHFEditor name="editorFieldName" label="Editor Field" />
      </Stack>
      <Stack spacing={1.5}>
        <Typography variant="subtitle2">Images</Typography>

        <RHFUpload
          multiple
          thumbnail
          files={files}
          name="images"
          maxSize={3145728}
          onDrop={handleDrop}
          onRemove={handleRemoveFile}
        />
      </Stack>
      <Stack direction="row-reverse" spacing={3.5} alignItems="center" marginTop={2}>
        <Button variant="contained" onClick={handleClick}>
          Save Changes
        </Button>
      </Stack>
    </Timeline>
  );

  return (
    <FormProvider methods={methods}>
      <CardHeader title="History" />

      <Card>
        <Stack
          spacing={3}
          alignItems={{ md: 'flex-start' }}
          direction={{ xs: 'column-reverse', md: 'row' }}
          sx={{ p: 3 }}
        >
          {renderTimeline}
        </Stack>
      </Card>
    </FormProvider>
  );
}

ProductDetailsHistory.propTypes = {
  history: PropTypes.object,
  reviews: PropTypes.object,
  updateRemarkData: PropTypes.func,
  updateCommData: PropTypes.func,
};
