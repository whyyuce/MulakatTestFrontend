import PropTypes from 'prop-types';
import { useRef, useCallback } from 'react';

import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

export default function ChatMessageInput({ message, onChangeMessage, onSendMessage }) {
  const fileRef = useRef(null);

  const handleAttach = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  return (
    <>
      <InputBase
        value={message}
        onChange={onChangeMessage}
        onKeyUp={onSendMessage}
        placeholder="Type a message"
        startAdornment={
          <IconButton>
            <Iconify icon="eva:smiling-face-fill" />
          </IconButton>
        }
        endAdornment={
          <IconButton onClick={handleAttach}>
            <Iconify icon="eva:attach-2-fill" />
          </IconButton>
        }
        sx={{
          px: 1,
          height: 56,
          flexShrink: 0,
          borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      />
      <input type="file" ref={fileRef} style={{ display: 'none' }} />
    </>
  );
}

ChatMessageInput.propTypes = {
  message: PropTypes.string,
  onChangeMessage: PropTypes.func,
  onSendMessage: PropTypes.func,
};
