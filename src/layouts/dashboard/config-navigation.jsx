import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  analytics: icon('ic_analytics'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();

  const data = useMemo(
    () => [
      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: t('management'),
        items: [
          // Construction
          {
            title: 'Construction Module',
            path: paths.dashboard.construction.root,
            icon: ICONS.analytics,
            children: [
              {
                title: 'Piping System Submodule',
                path: paths.dashboard.construction.pipeFollow.root,
                icon: <Iconify icon="mdi:pipe" />,
                children: [
                  {
                    title: 'Spool Follow',
                    path: paths.dashboard.construction.pipeFollow.spoolFollow,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
