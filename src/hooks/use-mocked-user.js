// TO GET THE USER FROM THE AUTHCONTEXT, YOU CAN USE

// CHANGE:
// import { useMockedUser } from 'src/hooks/use-mocked-user';
// const { user } = useMockedUser();

// TO:
// import { useAuthContext } from 'src/auth/hooks';
// const { user } = useAuthContext();
import photo from '../../public/logo/newlogo.png';
// ----------------------------------------------------------------------

export function useMockedUser() {
  const user = {
    id: '8864c717-587d-472a-929a-8e5f298024da-0',
    displayName: 'User1',
    email: 'info@marinemanagement.com',
    password: 'demo1234',
    photoURL: photo,
    phoneNumber: '+905071945010',
    country: 'Turkiye',
    address: 'Bilişim Vadi',
    state: 'Gebze',
    city: 'Kocaeli',
    zipCode: '41400',
    about: 'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
    role: 'User',
    isPublic: true,
  };

  return { user };
}
