import { paramCase } from 'src/utils/change-case';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  page404: '/404',
  page500: '/500',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    construction: {
      root: `${ROOTS.DASHBOARD}/construction`,
      pipeFollow: {
        root: `${ROOTS.DASHBOARD}/construction/pipe-follow`,
        spoolFollow: `${ROOTS.DASHBOARD}/construction/pipe-follow/spool-follow`,
      },
    },
  },
};
