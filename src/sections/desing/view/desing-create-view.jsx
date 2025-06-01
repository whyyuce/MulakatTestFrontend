import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import DesingNewEditForm from '../desing-new-edit-form';

// ----------------------------------------------------------------------

export default function DesingCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Doc"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Desing Document',
            href: paths.dashboard.desing.root,
          },
          { name: 'New Document' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DesingNewEditForm />
    </Container>
  );
}
