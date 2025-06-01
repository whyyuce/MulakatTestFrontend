import PropTypes from 'prop-types';

import Pagination, { paginationClasses } from '@mui/material/Pagination';

import DesingReviewItem from './desing-review-item';

// ----------------------------------------------------------------------

export default function DesingReviewList({ reviews }) {
  return (
    <>
      {reviews.map((review) => (
        <DesingReviewItem key={review.id} review={review} />
      ))}

      <Pagination
        count={10}
        sx={{
          mx: 'auto',
          [`& .${paginationClasses.ul}`]: {
            my: 5,
            mx: 'auto',
            justifyContent: 'center',
          },
        }}
      />
    </>
  );
}

DesingReviewList.propTypes = {
  reviews: PropTypes.array,
};
