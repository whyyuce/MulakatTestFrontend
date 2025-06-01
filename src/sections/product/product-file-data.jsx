import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';
import CardHeader from '@mui/material/CardHeader';

import Iconify from 'src/components/iconify';
import Chart, { useChart } from 'src/components/chart';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function ProductFileData({
  title,
  subheader,
  project,
  onProjectChange,
  projectData,
  chart,
  ...other
}) {
  const { labels, colors, series, options } = chart;

  const popover = usePopover();
  const projectPopover = usePopover();

  const [seriesData, setSeriesData] = useState('Week');

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
        (seriesData === 'Day' && labels.Day) ||
        (seriesData === 'Month' && labels.month) ||
        (seriesData === 'Week' && labels.Week) ||
        labels.year,
    },
    tooltip: {
      y: {
        formatter: (value) => value,
      },
    },
    plotOptions: {
      bar: {
        borderRadius:
          (seriesData === 'Day' && 8) ||
          (seriesData === 'Month' && 6) ||
          (seriesData === 'Week' && 6) ||
          10,
        columnWidth: '20%',
      },
    },
    ...options,
  });

  const handleChangeSeries = useCallback(
    (newValue) => {
      popover.onClose();
      setSeriesData(newValue);
    },
    [popover]
  );

  const handleChangeProject = useCallback(
    (newProject) => {
      projectPopover.onClose();
      onProjectChange(newProject);
    },
    [projectPopover, onProjectChange]
  );

  return (
    <>
      <Card {...other}>
        <CardHeader
          title={title}
          subheader={subheader}
          action={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ButtonBase
                onClick={popover.onOpen}
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
                  icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                  sx={{ ml: 0.5 }}
                />
              </ButtonBase>

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
                {project}

                <Iconify
                  width={16}
                  icon={
                    projectPopover.open
                      ? 'eva:arrow-ios-upward-fill'
                      : 'eva:arrow-ios-downward-fill'
                  }
                  sx={{ ml: 0.5 }}
                />
              </ButtonBase>
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

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {series.map((option) => (
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
        {projectData.map((projectItem) => (
          <MenuItem
            key={projectItem.project_name}
            selected={projectItem.project_name === project}
            onClick={() => handleChangeProject(projectItem.project_name)}
          >
            {projectItem.project_name}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}

ProductFileData.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  project: PropTypes.string,
  onProjectChange: PropTypes.func,
  projectData: PropTypes.arrayOf(PropTypes.object), // Updated to array of objects
  title: PropTypes.string,
};
