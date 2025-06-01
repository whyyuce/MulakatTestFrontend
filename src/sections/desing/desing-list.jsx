import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import DesingItem from './desing-item';
import { DesingItemSkeleton } from './desing-skeleton';

// ----------------------------------------------------------------------

export default function DesingList({ products, loading, ...other }) {
  const renderSkeleton = (
    <>
      {[...Array(16)].map((_, index) => (
        <DesingItemSkeleton key={index} />
      ))}
    </>
  );

  const renderList = (
    <>
      {products.map((p) => (
        <DesingItem key={p.id} desing={p} />
      ))}
    </>
  );

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        {...other}
      >
        {loading ? renderSkeleton : renderList}
      </Box>

      {products.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}

DesingList.propTypes = {
  loading: PropTypes.bool,
  products: PropTypes.array,
};
