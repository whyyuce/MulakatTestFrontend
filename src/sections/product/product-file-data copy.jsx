import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';
import CardHeader from '@mui/material/CardHeader';

import { fData } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import Chart, { useChart } from 'src/components/chart';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------
export default function ProductFileData({
  title,
  subheader,
  chart,
  selectedProject,
  selectedTimeRange,
  onTimeRangeChange,
  onProjectChange,
  ...other
}) {
  const { labels, colors, series, options } = chart;

  const timePopover = usePopover();
  const projectPopover = usePopover();

  const [seriesData, setSeriesData] = useState('week');
  const [projectData, setProjectData] = useState('NB001'); // Set the initial project to the first one in the series

  const chartOptions = useChart({
    chart: {
      stacked: true,
    },
    colors,
    stroke: {
      width: 0,
    },
    xaxis: {
      categories:
        (seriesData === 'week' && labels.week) ||
        (seriesData === 'month' && labels.month) ||
        labels.year,
    },
    tooltip: {
      y: {
        formatter: (value) => fData(value),
      },
    },
    plotOptions: {
      bar: {
        borderRadius: (seriesData === 'week' && 8) || (seriesData === 'month' && 6) || 10,
        columnWidth: '20%',
      },
    },
    ...options,
  });

  const handleChangeSeries = useCallback(
    (newValue) => {
      timePopover.onClose();
      setSeriesData(newValue);
    },
    [timePopover]
  );
  // const handleChangeSeries = useCallback(
  //   (newValue) => {
  //     onTimeRangeChange(newValue);
  //   },
  //   [onTimeRangeChange]
  // );

  // const handleChangeProject = useCallback(
  //   (newValue) => {
  //     onProjectChange(newValue);
  //   },
  //   [onProjectChange]
  // );

  return (
    <>
      <Card {...other}>
        <CardHeader
          title={title}
          subheader={subheader}
          action={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ButtonBase
                onClick={timePopover.onOpen}
                sx={{
                  pl: 1,
                  py: 0.5,
                  pr: 0.5,
                  borderRadius: 1,
                  typography: 'subtitle2',
                  bgcolor: 'background.neutral',
                  mr: 1,
                }}
              >
                {seriesData}

                <Iconify
                  width={16}
                  icon={
                    timePopover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'
                  }
                  sx={{ ml: 0.5 }}
                />
              </ButtonBase>
              {/* 
              <ButtonBase
                onClick={projectPopover.onOpen}
                sx={{
                  pl: 1,
                  py: 0.5,
                  pr: 0.5,
                  borderRadius: 1,
                  typography: 'subtitle2',
                  bgcolor: 'background.neutral',
                }}
              >
                {projectData}

                <Iconify
                  width={16}
                  icon={
                    projectPopover.open
                      ? 'eva:arrow-ios-upward-fill'
                      : 'eva:arrow-ios-downward-fill'
                  }
                  sx={{ ml: 0.5 }}
                />
              </ButtonBase> */}
            </Box>
          }
        />

        {series.map((item) => (
          <Box key={item.type} sx={{ mt: 3, mx: 3 }}>
            {item.type === seriesData && (
              <Chart
                dir="ltr"
                type="bar"
                series={item.data}
                options={chartOptions}
                width="100%"
                height={364}
              />
            )}
          </Box>
        ))}
      </Card>

      <CustomPopover open={timePopover.open} onClose={timePopover.onClose} sx={{ width: 140 }}>
        {['week', 'month', 'year'].map((option) => (
          <MenuItem
            key={option.type}
            selected={option.type === seriesData}
            onClick={() => handleChangeSeries(option.type)}
          >
            {option.type}
          </MenuItem>
        ))}
      </CustomPopover>

      <CustomPopover
        open={projectPopover.open}
        onClose={projectPopover.onClose}
        sx={{ width: 140 }}
      >
        {series.map((option) => (
          <MenuItem
            key={option.type}
            selected={option.type === projectData}
            onClick={() => handleChangeProject(option.type)}
          >
            {option.type}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}

ProductFileData.propTypes = {
  chart: PropTypes.shape({
    labels: PropTypes.shape({
      week: PropTypes.arrayOf(PropTypes.string),
      month: PropTypes.arrayOf(PropTypes.string),
      year: PropTypes.arrayOf(PropTypes.string),
    }),
    colors: PropTypes.arrayOf(PropTypes.string),
    series: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        data: PropTypes.arrayOf(
          PropTypes.shape({
            count: PropTypes.number.isRequired,
            statu: PropTypes.string.isRequired,
          })
        ),
      })
    ),
    options: PropTypes.object,
  }),
  subheader: PropTypes.string,
  title: PropTypes.string,
};
