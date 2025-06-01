import React from 'react';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText'; // Yeni import
import { fData } from 'src/utils/format-number';

import Image from 'src/components/image';
import { varFade, varTranHover } from 'src/components/animate';
import Lightbox, { useLightBox } from 'src/components/lightbox';

import FileThumbnail from './Filethumbicon';
import Iconify from '../../components/iconify';

export default function MultipleFileView({ files, onRemove, sx }) {
  const handleDownload = async (file) => {
    try {
      // Dosyayı indirmek için API'ye istek gönder
      const response = await fetch(`http://localhost:3000/api/file/downloadFile/${file.filename}`);
      // İndirme bağlantısını elde et
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(new Blob([blob]));
      // İndirme bağlantısını yeni bir sekmede aç
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Dosya indirme hatası:', error);
    }
  };
  const separateFilesByExtension = (files) => {
    const images = [];
    const documents = [];
    const otherFiles = [];

    files?.forEach((file) => {
      const fileNameParts = file.filename.split('.');
      const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();

      // Dosya uzantısına göre dosyayı ilgili kategoriye ekleyin
      switch (fileExtension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
          images.push(file);
          break;
        case 'doc':
        case 'docx':
        case 'pdf':
          otherFiles.push(file);
          break;
        default:
          otherFiles.push(file);
          break;
      }
    });

    return { images, documents, otherFiles };
  };
  const { images, otherFiles } = separateFilesByExtension(files);
  const slides = images.map((slide) => ({
    src: slide.url,
  }));
  const {
    selected: selectedImage,
    open: openLightbox,
    onOpen: handleOpenLightbox,
    onClose: handleCloseLightbox,
  } = useLightBox(images);
  return (
    <>
      {/* Resim dosyalarını göster */}
      <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {images.map((slide) => (
          <m.div
            key={slide.url}
            whileHover="hover"
            variants={{
              hover: { opacity: 0.8 },
            }}
            transition={varTranHover()}
            style={{ width: '80px', height: '80px' }}
          >
            <Image
              alt={slide.url}
              src={slide.url}
              width={80}
              height={80}
              onClick={() => {
                handleOpenLightbox(slide.url);
              }}
              sx={{ borderRadius: 2, cursor: 'pointer' }}
            />
          </m.div>
        ))}
      </Box>

      {/* Diğer dosya türlerini göster */}
      <Stack spacing={2}>
        {otherFiles.map((file) => (
          <Stack
            key={file._id}
            component={m.div}
            {...varFade().inUp}
            spacing={2}
            direction="row"
            alignItems="center"
            sx={{
              my: 1,
              py: 1,
              px: 1.5,
              borderRadius: 1,
              border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
              ...sx,
            }}
          >
            <FileThumbnail file={file} />
            <ListItemText
              primary={file.filename}
              secondary={fData(file.size)}
              secondaryTypographyProps={{
                component: 'span',
                typography: 'caption',
              }}
            />
            {onRemove && (
              <IconButton size="small" onClick={() => onRemove(file)}>
                <Iconify icon="mingcute:close-line" width={16} />
              </IconButton>
            )}
            <IconButton size="small" onClick={() => handleDownload(file)}>
              <Iconify icon="bi:download" width={16} />
            </IconButton>
          </Stack>
        ))}
      </Stack>
      <Lightbox
        index={selectedImage}
        slides={slides}
        open={openLightbox}
        close={handleCloseLightbox}
      />
    </>
  );
}

MultipleFileView.propTypes = {
  files: PropTypes.array,
  onRemove: PropTypes.func,
  sx: PropTypes.object,
};
