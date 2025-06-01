import React from 'react';
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';

import { fDateTime } from 'src/utils/format-time';

import { _tours } from 'src/_mock';

import Image from 'src/components/image';
import Lightbox, { useLightBox } from 'src/components/lightbox';

export default function ProductDetailsHistory({ data, comms, updateRemarkData, history, reviews }) {
  const currentTour = _tours[0];
  const slides = currentTour.images.map((slide) => ({
    src: slide,
  }));
  console.log('curr', currentTour);

  const {
    selected: selectedImage,
    open: openLightbox,
    onOpen: handleOpenLightbox,
    onClose: handleCloseLightbox,
  } = useLightBox(slides);

  const imageUrl = 'https://picsum.photos/200/300';
  const handleUpdateState = async (statusofremark) => {
    console.log('dtm', statusofremark);
    try {
      // API çağrısını gerçekleştir
      const response = await fetch(`http://localhost:3000/api/remarks/update/${data._id}`, {
        method: 'PUT', // veya 'POST' veya diğer HTTP yöntemleri
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          statu: statusofremark, // API'ye göndermek istediğiniz yeni durum
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      // Başarı durumunda API yanıtını al
      const apidata = await response.json();
      console.log('apidata', apidata);
      updateRemarkData(apidata.data);

      // Eğer gerekirse, API yanıtını kullanabilirsiniz

      // State'i güncellemek için updateState fonksiyonunu çağır
    } catch (error) {
      console.error('API request error:', error);
      // Hata durumunda gerekli işlemleri yapabilirsiniz
    }
  };
  const renderTimeline = comms.map((comment, index) => (
    <TimelineItem key={comment._id}>
      <TimelineSeparator>
        <TimelineDot color="primary" />
        {index < comms.length - 1 && <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="subtitle2">{fDateTime(comment.createdAt)}</Typography>
        <Typography variant="body1">{comment.text}</Typography>
        <Stack direction="row" flexWrap="wrap" spacing={1}>
          {comment.files.map((file) => (
            <Image
              key={file._id}
              alt={file.filename}
              src={file.url} // Eğer bir URL varsa, burada kullanın
              width={80}
              height={80}
              onClick={() => handleOpenLightbox(file.url)} // Resmi büyütme işlevi
              sx={{ borderRadius: 2, cursor: 'pointer' }}
            />
          ))}
        </Stack>
      </TimelineContent>
    </TimelineItem>
  ));

  return (
    <>
      <CardHeader title="History" />
      <Card>
        <Timeline>{renderTimeline}</Timeline>
        <Lightbox
          index={selectedImage}
          slides={slides}
          open={openLightbox}
          close={handleCloseLightbox}
        />
      </Card>
    </>
  );
}

ProductDetailsHistory.propTypes = {
  history: PropTypes.object,
  reviews: PropTypes.object,
  updateRemarkData: PropTypes.func,
  data: PropTypes.object,
  comms: PropTypes.array,
};
