import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetDesing } from 'src/api/desing';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import DesingNewEditForm from '../desing-new-edit-form';

// ----------------------------------------------------------------------

export default function DesingEditView({ id }) {
  const settings = useSettingsContext();

  const { desing: currentDesing } = useGetDesing(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Desing',
            href: paths.dashboard.desing.root,
          },
          { name: currentDesing?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DesingNewEditForm currentDesing={currentDesing} />
    </Container>
  );
}

DesingEditView.propTypes = {
  id: PropTypes.string,
};
