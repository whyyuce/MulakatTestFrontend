import { Helmet } from 'react-helmet-async';

import { SpoolView } from 'src/sections/construction/view/construction-spool-view';

// ----------------------------------------------------------------------

export default function SpoolListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Spool Follow</title>
      </Helmet>

      <SpoolView />
    </>
  );
}
