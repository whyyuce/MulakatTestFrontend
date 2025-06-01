import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetDesing } from 'src/api/desing';
import { PRODUCT_PUBLISH_OPTIONS } from 'src/_mock';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';

import { DesingDetailsSkeleton } from '../desing-skeleton';
import DesingDetailsReview from '../desing-details-review';
import DesingDetailsSummary from '../desing-details-summary';
import DesingDetailsToolbar from '../desing-details-toolbar';
import DesingDetailsCarousel from '../desing-details-carousel';

// ----------------------------------------------------------------------

const SUMMARY = [
  {
    title: '100% Original',
    description: 'Chocolate bar candy canes ice cream toffee cookie halvah.',
    icon: 'solar:verified-check-bold',
  },
  {
    title: '10 Day Replacement',
    description: 'Marshmallow biscuit donut dragée fruitcake wafer.',
    icon: 'solar:clock-circle-bold',
  },
  {
    title: 'Year Warranty',
    description: 'Cotton candy gingerbread cake I love sugar sweet.',
    icon: 'solar:shield-check-bold',
  },
];

// ----------------------------------------------------------------------

export default function DesingDetailsView({ id }) {
  const { desing, desingLoading, desingError } = useGetDesing(id);

  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('description');

  const [publish, setPublish] = useState('');

  useEffect(() => {
    if (desing) {
      setPublish(desing?.publish);
    }
  }, [desing]);

  const handleChangePublish = useCallback((newValue) => {
    setPublish(newValue);
  }, []);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const renderSkeleton = <DesingDetailsSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${desingError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.dashboard.desing.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Back to List
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderDesing = desing && (
    <>
      <DesingDetailsToolbar
        backLink={paths.dashboard.desing.root}
        editLink={paths.dashboard.desing.edit(`${desing?.id}`)}
        liveLink={paths.desing.details(`${desing?.id}`)}
        publish={publish || ''}
        onChangePublish={handleChangePublish}
        publishOptions={PRODUCT_PUBLISH_OPTIONS}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <DesingDetailsCarousel desing={desing} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          <DesingDetailsSummary disabledActions desing={desing} />
        </Grid>
      </Grid>

      {/* <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        sx={{ my: 10 }}
      >
        {SUMMARY.map((item) => (
          <Box key={item.title} sx={{ textAlign: 'center', px: 5 }}>
            <Iconify icon={item.icon} width={32} sx={{ color: 'primary.main' }} />

            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
              {item.title}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box> */}

      <Card>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 3,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {[
            // {
            //   value: 'description',
            //   label: 'Description',
            // },
            {
              value: 'reviews',
              label: `Reviews (${desing.reviews.length})`,
            },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>
        {
          // tek tab olarak güncelledik Bu kısımda description  var
        }
        {/* {currentTab === 'description' && (
          <DesingDetailsDescription description={desing?.description} />
        )} */}

        {/* {currentTab === 'reviews' && ( */}
        <DesingDetailsReview
          ratings={desing.ratings}
          reviews={desing.reviews}
          totalRatings={desing.totalRatings}
          totalReviews={desing.totalReviews}
        />
        {/* )} */}
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {desingLoading && renderSkeleton}

      {desingError && renderError}

      {desing && renderDesing}
    </Container>
  );
}

DesingDetailsView.propTypes = {
  id: PropTypes.string,
};
