import React, { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';

import { useSettingsContext } from 'src/components/settings';

import ProductFileData from '../product-file-data';
import ProjectCurrentPie from '../project-current-pie';
import ProjectLineChart from '../product-reports-linechart';

// ----------------------------------------------------------------------

export default function ProductReportsView() {
  const theme = useTheme();
  const settings = useSettingsContext();

  const [dailyData, setDailyData] = useState({});

  const [PieData, setPieData] = useState({});
  const [monthlyData, setMonthlyData] = useState({});
  const [yearlyDataForMonth, setYearlyData] = useState({});
  const [yearslyData, setYearsData] = useState({});
  const [ProjectsData, setProjectsData] = useState({});

  const [DailyRes, setDailyResultData] = useState({});

  const [WeeklyRes, setWeeklyResultData] = useState({});
  const [MonthlyRes, setMonthlyResultData] = useState({});
  const [YearslyRes, setYearslyResultData] = useState({});

  const [selectedProject, setSelectedProject] = useState('NB001'); // Default selected project
  const [selectedTimeRange, setSelectedTimeRange] = useState('week'); // Default selected time range

  function toplaStatuleriYilaGore(veri) {
    const sonuc = {};

    // Her bir proje için döngü oluşturun
    for (const proje in veri) {
      // Her bir yıl için döngü oluşturun
      for (const yil in veri[proje]) {
        // Her bir durum için döngü oluşturun
        for (const durumObjesi of veri[proje][yil]) {
          const durum = durumObjesi.statu;
          // Eğer yıl henüz sonuç nesnesinde yoksa, ekleyin
          if (!(yil in sonuc)) {
            sonuc[yil] = {};
          }
          // Eğer durum henüz yıl nesnesinde yoksa, ekleyin
          if (!(durum in sonuc[yil])) {
            sonuc[yil][durum] = 0;
          }
          // Durum sayısını artırın
          sonuc[yil][durum] += durumObjesi.count;
        }
      }
    }

    return sonuc;
  }

  useEffect(() => {
    const fetchStatistics = async (timerange) => {
      try {
        const response = await fetch(`http://localhost:3000/api/remarks/statistics/${timerange}`);
        const data = await response.json();

        console.log('daTA', data);
        return data.data;
      } catch (error) {
        console.error(`Error fetching ${timerange} data:`, error);
        return {};
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/project');
        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error(`Error fetching project data:`, error);
        return {};
      }
    };
    const fetchAllProjects = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/remarks/allprojectdata');
        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error(`Error fetching project data:`, error);
        return {};
      }
    };

    const fetchData = async () => {
      const dayData = await fetchStatistics('days');
      const weekData = await fetchStatistics('weeks');
      const yearDataForMonth = await fetchStatistics('year');
      const yearsData = await fetchStatistics('years');
      const ProjectData = await fetchProjects();
      const Allproject = await fetchAllProjects();

      //  const summary = yearsData ? summarizeData(yearsData) : null;
      console.log('yearsdata', yearsData);
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];

      // Define the order of days
      const allStatusOptions = [
        'Published',
        'Authorized',
        'InProgress',
        'Suspended',
        'Done',
        'Closed',
        'Cancelled',
        'Draft',
      ];
      const yearlyTotalStats = {};

      for (const project in yearsData) {
        for (const year in yearsData[project]) {
          if (!yearlyTotalStats[year]) {
            yearlyTotalStats[year] = {};
          }
          yearsData[project][year].forEach((item) => {
            // Her bir year altındaki array'i dön
            const month = new Date(item.date).toLocaleString('default', { month: 'short' }); // item.date'den ay adını al

            if (!yearlyTotalStats[year][month]) {
              yearlyTotalStats[year][month] = {};
            }
            if (!yearlyTotalStats[year][month][item.statu]) {
              yearlyTotalStats[year][month][item.statu] = 0;
            }

            yearlyTotalStats[year][month][item.statu] += item.count;
          });
        }
      }

      console.log('sst', yearlyTotalStats);

      const orderedProjectIds = ProjectData.map((project) => project.project_name);
      // Transform the response data into the format expected by the pie chart
      const transformedDataforProject = orderedProjectIds.map((projectId) => {
        const projectData = Allproject[projectId];

        // Projedeki her bir statü için seri oluştur
        const chartSeries = allStatusOptions.map((status) => ({
          label: status,
          value:
            projectData[status] && projectData[status].length > 0
              ? projectData[status][0].count
              : 0,
        }));

        return {
          projectId,
          chart: {
            series: chartSeries,
          },
        };
      });

      console.log('trm', transformedDataforProject);

      const transformedData = transformData(yearDataForMonth, selectedProject);

      const transformedDataByYears = transformDataByYears(yearsData, selectedProject);
      const transformedDataByWeek = transformDataByWeeks(weekData, selectedProject);

      const transformedDataByDay = transformDataByDay(dayData, selectedProject);

      setDailyResultData(transformedDataByDay);

      setWeeklyResultData(transformedDataByWeek);

      setMonthlyResultData(transformedData);

      setYearslyResultData(transformedDataByYears);

      setDailyData(dayData);

      setPieData(transformedDataforProject);
      setMonthlyData(weekData);
      setYearlyData(yearDataForMonth);
      setYearsData(yearsData);
      setProjectsData(ProjectData);
      console.log('alres', yearDataForMonth);
    };

    fetchData();
  }, [selectedProject]);

  const fetchStatistics = async (timerange) => {
    console.log('week', timerange);
    try {
      const response = await fetch(`http://localhost:3000/api/remarks/statistics/${timerange}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error fetching ${timerange} data:`, error);
      return {};
    }
  };
  function transformData(data, project) {
    console.log('gelendata', data);
    const months = [
      'jan',
      'feb',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec',
    ];
    const statuses = [
      'Published',
      'Authorized',
      'InProgress',
      'Suspended',
      'Done',
      'Closed',
      'Cancelled',
      'Draft',
    ]; // Buraya tüm statüleri ekleyin
    const result = [];

    // Her statü için başlangıç değeri oluştur
    statuses.forEach((status) => {
      result.push({
        name: status,
        data: Array(12).fill(0),
      });
    });

    // Gelen veriyi işleyip result dizisini doldur
    const selectedProjectData = data[project];
    if (selectedProjectData) {
      months.forEach((month, monthIndex) => {
        selectedProjectData[month].forEach((entry) => {
          const statusIndex = result.findIndex((res) => res.name === entry.statu);
          if (statusIndex !== -1) {
            result[statusIndex].data[monthIndex] += entry.count;
          }
        });
      });
    } else {
      console.error(`Project ${project} not found in data`);
    }

    return result;
  }
  function transformDataByDay(data, project) {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const statuses = [
      'Published',
      'Authorized',
      'InProgress',
      'Suspended',
      'Done',
      'Closed',
      'Cancelled',
      'Draft',
    ];
    const result = [];

    // Her statü için başlangıç değeri oluştur
    statuses.forEach((status) => {
      result.push({
        name: status,
        data: Array(days.length).fill(0),
      });
    });

    // Seçilen proje verisini işleyip result dizisini doldur
    const selectedProjectData = data[project];
    if (selectedProjectData) {
      days.forEach((day, dayIndex) => {
        if (selectedProjectData[day]) {
          selectedProjectData[day].forEach((entry) => {
            const statusIndex = result.findIndex((res) => res.name === entry.statu);
            if (statusIndex !== -1) {
              result[statusIndex].data[dayIndex] += entry.count;
            }
          });
        }
      });
    } else {
      console.error(`Project ${project} not found in data`);
    }

    return result;
  }

  function transformDataByYears(data, project) {
    const years = [2020, 2021, 2022, 2023, 2024];
    const statuses = [
      'Published',
      'Authorized',
      'InProgress',
      'Suspended',
      'Done',
      'Closed',
      'Cancelled',
      'Draft',
    ];
    const result = [];

    // Her statü için başlangıç değeri oluştur
    statuses.forEach((status) => {
      result.push({
        name: status,
        data: Array(years.length).fill(0),
      });
    });

    // Seçilen proje verisini işleyip result dizisini doldur
    const selectedProjectData = data[project];
    if (selectedProjectData) {
      years.forEach((year, yearIndex) => {
        if (selectedProjectData[year]) {
          selectedProjectData[year].forEach((entry) => {
            const statusIndex = result.findIndex((res) => res.name === entry.statu);
            if (statusIndex !== -1) {
              result[statusIndex].data[yearIndex] += entry.count;
            }
          });
        }
      });
    } else {
      console.error(`Project ${project} not found in data`);
    }

    return result;
  }

  function transformDataByWeeks(data, project) {
    const weeks = Array.from({ length: 52 }, (_, i) => i + 1);
    const statuses = [
      'Published',
      'Authorized',
      'InProgress',
      'Suspended',
      'Done',
      'Closed',
      'Cancelled',
      'Draft',
    ];
    const result = [];

    // Her statü için başlangıç değeri oluştur
    statuses.forEach((status) => {
      result.push({
        name: status,
        data: Array(weeks.length).fill(0),
      });
    });

    // Seçilen proje verisini işleyip result dizisini doldur
    const selectedProjectData = data[project];
    if (selectedProjectData) {
      weeks.forEach((week, yearIndex) => {
        if (selectedProjectData[week]) {
          selectedProjectData[week].forEach((entry) => {
            const statusIndex = result.findIndex((res) => res.name === entry.statu);
            if (statusIndex !== -1) {
              result[statusIndex].data[yearIndex] += entry.count;
            }
          });
        }
      });
    } else {
      console.error(`Project ${project} not found in data`);
    }

    return result;
  }
  function transformYearsData(data, project) {
    const months = [
      'jan',
      'feb',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec',
    ];
    const statuses = [
      'Published',
      'Authorized',
      'InProgress',
      'Suspended',
      'Done',
      'Closed',
      'Cancelled',
      'Draft',
    ]; // Buraya tüm statüleri ekleyin
    const result = [];

    // Her statü için başlangıç değeri oluştur
    statuses.forEach((status) => {
      result.push({
        name: status,
        data: Array(12).fill(0),
      });
    });

    // Gelen veriyi işleyip result dizisini doldur
    Object.values(data).forEach((item) => {
      months.forEach((month, monthIndex) => {
        item[month].forEach((entry) => {
          const statusIndex = result.findIndex((res) => res.name === entry.statu);
          if (statusIndex !== -1) {
            result[statusIndex].data[monthIndex] += entry.count;
          }
        });
      });
    });

    return result;
  }

  const handleProjectChange = (project) => {
    setSelectedProject(project);
  };
  console.log('pr', ProjectsData);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid xs={12} md={6} lg={8}>
        {Object.keys(ProjectsData).length > 0 && (
          <ProductFileData
            title="Projects Reports"
            project={selectedProject}
            projectData={ProjectsData}
            onProjectChange={handleProjectChange}
            chart={{
              labels: {
                Day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                Week: Array.from({ length: 52 }, (_, i) => (i + 1).toString()),

                month: [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ],
                year: ['2020', '2021', '2022', '2023', '2024'],
              },
              colors: [
                theme.palette.secondary.main,
                theme.palette.info.light,
                theme.palette.success.light,
                theme.palette.warning.main,
                theme.palette.success.dark,
                theme.palette.error.main,

                theme.palette.warning.main,

                //  theme.palette.primary.dark,
                theme.palette.text.disabled,
              ],
              series: [
                {
                  type: 'Day',
                  data: DailyRes,
                },
                {
                  type: 'Week',
                  data: WeeklyRes,
                },
                {
                  type: 'Month',
                  data: MonthlyRes,
                },
                {
                  type: 'Year',
                  data: YearslyRes,
                },
              ],
            }}
          />
        )}
      </Grid>

      <Grid container marginTop={-1} marginBottom={-1} spacing={12}>
        {Object.keys(PieData).length > 0 &&
          PieData?.map((projectData) => (
            <Grid item xs={12} md={6} lg={4}>
              <ProjectCurrentPie
                key={projectData.projectId}
                title={projectData.projectId}
                total={projectData.total}
                chart={{
                  series: projectData.chart.series,
                  colors: [
                    theme.palette.secondary.main,
                    theme.palette.info.light,
                    theme.palette.success.light,
                    theme.palette.warning.main,
                    theme.palette.success.dark,
                    theme.palette.error.main,

                    theme.palette.warning.main,

                    //  theme.palette.primary.dark,
                    theme.palette.text.disabled,
                  ],
                }}
              />
            </Grid>
          ))}
      </Grid>

      {/* <Grid xs={12} md={6} lg={4}>
        <ProjectSecondPie
          title="Sale By Gender"
          total={23240}
          chart={{
            series: [
              { label: 'ınprogress', value: 10 },
              { label: 'suspend', value: 24 },
              { label: 'close', value: 34 },
              { label: 'done', value: 44 },
              { label: 'cancel', value: 54 },
              { label: 'draf', value: 64 },
              { label: 'publish', value: 74 },
              { label: 'Womens', value: 85 },
            ],
          }}
        />
      </Grid> */}
      <Grid xs={12} md={6} lg={8}>
        <ProjectLineChart
          title="Yearly Remarks"
          subheader="Statu of All"
          chart={{
            colors: [
              theme.palette.secondary.main,
              theme.palette.info.light,
              theme.palette.success.light,
              theme.palette.warning.main,
              theme.palette.success.dark,
              theme.palette.error.main,

              theme.palette.warning.main,

              //  theme.palette.primary.dark,
              theme.palette.text.disabled,
            ],
            categories: [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ],
            series: [
              {
                year: '2023',
                data: YearslyRes,
              },
              {
                year: '2024',
                data: [
                  {
                    name: 'Published',
                    data: [17, 21, 25, 20, 24, 29, 34, 30, 35, 39, 44, 40],
                  },
                  {
                    name: 'Authorized',
                    data: [28, 23, 27, 30, 25, 21, 26, 22, 20, 25, 29, 24],
                  },
                  {
                    name: 'InProgress',
                    data: [3, 8, 6, 11, 7, 2, 7, 12, 10, 5, 10, 15],
                  },
                  {
                    name: 'Suspended',
                    data: [22, 27, 23, 28, 23, 28, 13, 18, 22, 27, 22, 17],
                  },
                  {
                    name: 'Done',
                    data: [11, 15, 10, 14, 19, 24, 20, 15, 20, 24, 29, 24],
                  },
                  {
                    name: 'Cancelled',
                    data: [29, 24, 20, 25, 50, 25, 20, 15, 20, 25, 29, 20],
                  },
                  {
                    name: 'Draft',
                    data: [8, 3, 7, 2, 6, 11, 6, 1, 6, 10, 5, 0],
                  },
                ],
              },
            ],
          }}
        />
      </Grid>
    </Container>
  );
}
