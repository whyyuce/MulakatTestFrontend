import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import ProductItem from './product-item';
import { getRemarks } from '../../api/httpServices';
import { ProductItemSkeleton } from './product-skeleton';

// ----------------------------------------------------------------------

export default function ProductList({ products, loading, ...other }) {
  const [remarks, setRemarks] = useState([]);

  useEffect(() => {
    const fetchRemarks = async () => {
      try {
        const fetchedRemarks = await getRemarks();
        setRemarks(fetchedRemarks);
        console.log('Remarks:', fetchedRemarks);
      } catch (error) {
        console.error('Error fetching remarks:', error);
      }
    };

    fetchRemarks();
  }, []);
  const renderSkeleton = (
    <>
      {[...Array(16)].map((_, index) => (
        <ProductItemSkeleton key={index} />
      ))}
    </>
  );

  const renderList = (
    <>
      {remarks.data.map((product) => (
        <ProductItem key={product.id} product={product} />
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

ProductList.propTypes = {
  loading: PropTypes.bool,
  products: PropTypes.array,
};
