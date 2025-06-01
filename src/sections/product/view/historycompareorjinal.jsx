import React from 'react';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';

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

import { _tours } from 'src/_mock';

import Image from 'src/components/image';
import { varTranHover } from 'src/components/animate';
import Lightbox, { useLightBox } from 'src/components/lightbox';

export default function ProductDetailsHistory({ data, comms, updateRemarkData, history, reviews }) {
  const currentTour = _tours[0];
  const slides = currentTour.images.map((slide) => ({
    src: slide,
  }));

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

  const renderTimeline = (
    <>
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
                <Box sx={{ display: 'flex', gap: '10px' }}>
                  {slides.slice(1, 5).map((slide) => (
                    <m.div
                      key={slide.src}
                      whileHover="hover"
                      variants={{
                        hover: { opacity: 0.8 },
                      }}
                      transition={varTranHover()}
                      style={{ width: '80px', height: '80px' }}
                    >
                      <Image
                        alt={slide.src}
                        src={slide.src}
                        width={80}
                        height={80}
                        onClick={() => handleOpenLightbox(slide.src)}
                        sx={{ borderRadius: 2, cursor: 'pointer' }}
                      />
                    </m.div>
                  ))}
                </Box>
                <Typography variant="subtitle2">{item.title}</Typography>

                <Stack direction="row" spacing={2}>
                  {slides.slice(1, 5).map((slide) => (
                    <m.div
                      key={slide.src}
                      whileHover="hover"
                      variants={{
                        hover: { opacity: 0.8 },
                      }}
                      transition={varTranHover()}
                    >
                      <Image
                        alt={slide.src}
                        src="blob:http://localhost:3030/a863e11c-dbf4-438b-ae38-2fdbef84a50e"
                        ratio="1/1"
                        onClick={() => handleOpenLightbox(slide.src)}
                        sx={{ borderRadius: 2, cursor: 'pointer' }}
                      />
                    </m.div>
                  ))}
                </Stack>

                <Typography variant="body1" sx={{ color: 'text.primary', mt: 0.5 }}>
                  Bu bir yorum özelliği taşımaktadır.
                </Typography>

                <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ pt: 1 }} />
                <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
                  {fDateTime(item.time)}
                </Box>
              </TimelineContent>
            </TimelineItem>
          );
        })}
        <Stack marginTop={5} spacing={1.5}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => handleUpdateState('InProgress')}
          >
            In Progress
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => handleUpdateState('Published')}
          >
            Published
          </Button>
          <Button color="error" variant="contained" onClick={() => handleUpdateState('Cancelled')}>
            Cancelled
          </Button>
          <Button color="info" variant="contained" onClick={() => handleUpdateState('Closed')}>
            Closed
          </Button>
          <Button color="success" variant="contained" onClick={() => handleUpdateState('Done')}>
            Done
          </Button>
          <Button
            color="warning"
            variant="contained"
            onClick={() => handleUpdateState('Authorized')}
          >
            Authorized
          </Button>
        </Stack>
      </Timeline>
      <Lightbox
        index={selectedImage}
        slides={slides}
        open={openLightbox}
        close={handleCloseLightbox}
      />
    </>
  );

  return (
    <>
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
    </>
  );
}

ProductDetailsHistory.propTypes = {
  history: PropTypes.object,
  reviews: PropTypes.object,
  updateRemarkData: PropTypes.func,
};
