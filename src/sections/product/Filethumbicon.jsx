import PropTypes from 'prop-types';

import { Box } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import { fileThumb, fileFormat } from './FileUtils';
import DownloadButton from '../../components/file-thumbnail/download-button';

export default function FileThumbnail({ file, tooltip, imageView, onDownload, sx, imgSx }) {
  const { filename = '', size = 0 } = file;
  const format = fileFormat(filename);
  const renderContent =
    format === 'image' && imageView ? (
      <Box
        component="img"
        src={file.preview}
        sx={{
          width: 1,
          height: 1,
          flexShrink: 0,
          objectFit: 'cover',
          ...imgSx,
        }}
      />
    ) : (
      <Box
        component="img"
        src={fileThumb(format)}
        sx={{
          width: 32,
          height: 32,
          flexShrink: 0,
          ...sx,
        }}
      />
    );

  if (tooltip) {
    return (
      <Tooltip title={filename}>
        <Box
          component="span"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 'fit-content',
            height: 'inherit',
          }}
        >
          {renderContent}
          {onDownload && <DownloadButton onDownload={onDownload} />}
        </Box>
      </Tooltip>
    );
  }

  return (
    <>
      {renderContent}
      {onDownload && <DownloadButton onDownload={onDownload} />}
    </>
  );
}

FileThumbnail.propTypes = {
  file: PropTypes.object.isRequired,
  imageView: PropTypes.bool,
  imgSx: PropTypes.object,
  onDownload: PropTypes.func,
  sx: PropTypes.object,
  tooltip: PropTypes.bool,
};
