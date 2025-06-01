import { useState, useEffect, useCallback } from 'react';
import { HarmCategory, GoogleGenerativeAI, HarmBlockThreshold } from '@google/generative-ai';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { useGetContacts } from 'src/api/chat';

import { useSettingsContext } from 'src/components/settings';

import { GMN_API } from '../../../config-global';
import ChatMessageList from '../chat-message-list';
import ChatMessageInput from '../chat-message-input';

const apiKey = GMN_API;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
});
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];
// ----------------------------------------------------------------------

export default function ChatView() {
  const router = useRouter();
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: 'text/plain',
  };
  async function run() {
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });
  }
  const [count, setCount] = useState(0);
  const incrementCounter = () => {
    setCount(count + 1);
  };

  const { user } = useMockedUser();

  const settings = useSettingsContext();

  const searchParams = useSearchParams();

  const selectedConversationId = searchParams.get('id') || '';

  const [recipients, setRecipients] = useState(['Selected']);

  const { contacts } = useGetContacts();

  const [message, setMessage] = useState('');
  const [participants, setParticipants] = useState([]);
  const [conversation, setConversation] = useState(null);

  // const participants = {
  //   address: 'Mountain View, Kaliforniya',
  //   avatarUrl: null,
  //   email: 'Google@gmail.com',
  //   id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
  //   lastActivity: '2024-05-23T00:12:50.826Z',
  //   name: 'Google Gemini',
  //   phoneNumber: '000-000-000',
  //   role: 'AI PRO',
  //   status: 'Online',
  // };

  console.log('conv', conversation);

  console.log('conv', participants);
  useEffect(() => {
    // Burada, gerçek verileri almak için gerekli kodları ekleyebilirsiniz.
    // Örneğin:
    // const fetchData = async () => {
    //   const result = await fetch('YOUR_API_ENDPOINT');
    //   const data = await result.json();
    //   setParticipants(data.participants);
    setConversation((prevConversation) => {
      // Önce, participants null ise bir boş diziyle başlat
      prevConversation = prevConversation || { participants: [] };

      // Mevcut katılımcıları al
      const existingParticipants = prevConversation.participants || [];

      // Yeni katılımcıları oluştur
      const newParticipant1 = {
        address: 'Yeni adres 1',
        avatarUrl: 'Yeni avatar URL 1',
        email: 'yeni1@mail.com',
        id: 'yeni-id-1',
        lastActivity: '2024-05-25T00:00:00.000Z',
        name: 'Yeni Kişi 1',
        phoneNumber: 'Yeni telefon numarası 1',
        role: 'Yeni rol 1',
        status: 'online', // veya "offline"
      };

      const newParticipant2 = {
        address: 'Yeni adres 2',
        avatarUrl: 'Yeni avatar URL 2',
        email: 'yeni2@mail.com',
        id: 'yeni-id-2',
        lastActivity: '2024-05-25T00:00:00.000Z',
        name: 'Yeni Kişi 2',
        phoneNumber: 'Yeni telefon numarası 2',
        role: 'Yeni rol 2',
        status: 'offline', // veya "online"
      };

      // Yeni katılımcıları mevcut katılımcılar dizisine ekle
      const newParticipants = [...existingParticipants, newParticipant1, newParticipant2];

      // Yeni katılımcılar ile birlikte conversation'ı güncelle ve döndür
      return {
        ...prevConversation,
        participants: newParticipants,
      };
    });

    // };
    // fetchData();
  }, []);
  const handleSubmit = useCallback(
    async (e) => {
      try {
        const requestBody = {
          contents: [
            {
              parts: [
                {
                  text: message,
                },
              ],
            },
          ],
        };

        const response = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDmNYjCCSQJV3lIT01FWtAugeRf7FsZGzg',
          {
            method: 'POST',
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        incrementCounter();
        const newMessagebyme = {
          id: 1,
          body: message,
          attachments: [],
          contentType: 'text',
          createdAt: new Date(), // Mesajın oluşturulma tarihi
          senderId: user.id, // Mesajı gönderen kullanıcının kimliği
        };
        incrementCounter();
        setConversation((prevConversation) => {
          if (!prevConversation) {
            // Eğer prevConversation null ise, yeni bir conversation oluşturabiliriz.
            return {
              messages: [newMessagebyme],
              participants: [],
            };
          }

          return {
            ...prevConversation,
            messages: [...(prevConversation.messages || []), newMessagebyme],
          };
        });

        const responseData = await response.json();
        console.log('11part', participants);
        // Burada responseData'ı kullanarak bir conversation message oluşturabilirsiniz
        const newMessage = {
          id: 2,
          body: responseData.candidates[0].content.parts[0],
          contentType: 'text',
          createdAt: new Date(),
          senderId: 1993,
          // Diğer gerekli alanlar...
        };

        console.log('nm', newMessage);
        // Oluşturulan yeni mesajı kullanarak state'i güncelleyin
        setConversation((prevConversation) => {
          if (!prevConversation) {
            // Eğer prevConversation null ise, yeni bir conversation oluşturabiliriz.
            return {
              messages: [newMessage],
              participants: [],
            };
          }

          return {
            ...prevConversation,
            messages: [...(prevConversation.messages || []), newMessage],
          };
        });

        console.log('mes', responseData);
      } catch (error) {
        console.error('Hata oluştu:', error);
      }
    },
    [message]
  );

  const handleAddRecipients = useCallback((selected) => {
    setRecipients(selected);
  }, []);

  const details = !!conversation;

  const handleChangeMessage = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

  const handleSendMessage = useCallback(
    async (event) => {
      try {
        if (event.key === 'Enter') {
          if (message) {
            await handleSubmit();
            // Mesaj gönderme işlemleri burada gerçekleştirilebilir.
          }
          setMessage('');
        }
      } catch (error) {
        console.error(error);
      }
    },
    [message]
  );

  const renderMessages = (
    <Stack
      sx={{
        width: 1,
        height: 1,
        overflow: 'hidden',
      }}
    >
      <ChatMessageList
        messages={conversation?.messages}
        participants={conversation?.participants}
      />

      <ChatMessageInput
        message={message}
        onChangeMessage={handleChangeMessage}
        onSendMessage={handleSendMessage}
      />
    </Stack>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Chat
      </Typography>

      <Stack component={Card} direction="row" sx={{ height: '72vh' }}>
        {/* {renderNav} */}

        <Stack
          sx={{
            width: 1,
            height: 1,
            overflow: 'hidden',
          }}
        >
          {/* {renderHead} */}

          <Stack
            direction="row"
            sx={{
              width: 1,
              height: 1,
              overflow: 'hidden',
              borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
            }}
          >
            {renderMessages}

            {/* {details && <ChatRoom conversation={conversation} participants={participants} />} */}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
