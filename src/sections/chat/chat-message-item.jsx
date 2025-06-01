import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

function getSenderDetails(message, participants) {
  const sender = participants.find((participant) => participant.id === message.senderId);
  return sender || {};
}

export default function ChatMessageItem({ message = {}, participants = [], onOpenLightbox }) {
  const { body, createdAt, senderId } = message;

  // Eğer message.body yoksa bileşeni render etmeden çıkış yaparız
  if (!body) {
    return null;
  }

  const senderDetails = getSenderDetails(message, participants);
  const { name, avatarUrl } = senderDetails;

  const renderBodyContent = () => {
    if (typeof body === 'string') {
      return body;
    }
    if (body && body.text) {
      return body.text;
    }
    return JSON.stringify(body);
  };

  const renderInfo = (
    <Typography
      noWrap
      variant="caption"
      sx={{
        mb: 1,
        color: 'text.disabled',
        ...(senderId === senderDetails.id && {
          mr: 'auto',
        }),
      }}
    >
      {name && `${name},`} &nbsp;
      {formatDistanceToNowStrict(new Date(createdAt), {
        addSuffix: true,
      })}
    </Typography>
  );

  const renderBody = (
    <Stack
      sx={{
        p: 1.5,
        minWidth: 48,
        maxWidth: 320,
        borderRadius: 1,
        typography: 'body2',
        bgcolor: 'background.neutral',
        ...(senderId === senderDetails.id && {
          color: 'grey.800',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {renderBodyContent()}
    </Stack>
  );

  const renderActions = (
    <Stack
      direction="row"
      className="message-actions"
      sx={{
        pt: 0.5,
        opacity: 0,
        top: '100%',
        left: 0,
        position: 'absolute',
        transition: (theme) =>
          theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.shorter,
          }),
        ...(senderId === senderDetails.id && {
          left: 'unset',
          right: 0,
        }),
      }}
    >
      <IconButton size="small">
        <Iconify icon="solar:reply-bold" width={16} />
      </IconButton>
      <IconButton size="small">
        <Iconify icon="eva:smiling-face-fill" width={16} />
      </IconButton>
      <IconButton size="small">
        <Iconify icon="solar:trash-bin-trash-bold" width={16} />
      </IconButton>
    </Stack>
  );

  return (
    <Stack
      direction="row"
      justifyContent={senderId === senderDetails.id ? 'flex-end' : 'unset'}
      sx={{ mb: 5 }}
    >
      {senderId !== senderDetails.id && (
        <Avatar alt={name} src={avatarUrl} sx={{ width: 32, height: 32, mr: 2 }} />
      )}

      <Stack alignItems="flex-end">
        {renderInfo}

        <Stack
          direction="row"
          alignItems="center"
          sx={{
            position: 'relative',
            '&:hover': {
              '& .message-actions': {
                opacity: 1,
              },
            },
          }}
        >
          {renderBody}
          {renderActions}
        </Stack>
      </Stack>
    </Stack>
  );
}

ChatMessageItem.propTypes = {
  message: PropTypes.object,
  onOpenLightbox: PropTypes.func,
  participants: PropTypes.array,
};
