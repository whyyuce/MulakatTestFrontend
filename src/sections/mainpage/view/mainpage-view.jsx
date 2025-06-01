import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useSettingsContext } from 'src/components/settings';

import AnalyticsCurrentVisits from '../analytics-current-visits';
import AnalyticsWebsiteVisits from '../analytics-website-visits';
import AnalyticsWidgetSummary from '../analytics-widget-summary';
import AnalyticsCurrentSubject from '../analytics-current-subject';
import AnalyticsConversionRates from '../analytics-conversion-rates';
// ----------------------------------------------------------------------

export default function MainView() {
  const settings = useSettingsContext();
  const theme = useTheme(); // Theme'ü burada kullanıyoruz
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Marine Management System
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Remark Module"
            road="rmk"
            //  total={7140}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/remark.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Construction Module"
            road="cst"
            sx={{
              '& .MuiTypography-root': {
                color: '#880e4f', // Başlık rengini kırmızı olarak ayarlıyoruz
              },
              // bgGradient ve alpha fonksiyonlarını kullanırken tema objesinden yararlanıyoruz
              backgroundImage: `linear-gradient(135deg, ${alpha(
                theme.palette.purple.def,
                0.2
              )} 0%, ${alpha(theme.palette.pink.def, 0.2)} 100%)`,
            }}
            icon={<img alt="icon" src="/assets/icons/glass/construction.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Meeting Module"
            road="mtn"
            //  total={2340}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/meeting.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Planing Module"
            road="mtn"
            //  total={2340}
            sx={{
              '& .MuiTypography-root': {
                color: '#4a148c', // Başlık rengini kırmızı olarak ayarlıyoruz
              },
              // bgGradient ve alpha fonksiyonlarını kullanırken tema objesinden yararlanıyoruz
              backgroundImage: `linear-gradient(135deg, ${alpha(
                theme.palette.secondary.light,
                0.2
              )} 0%, ${alpha(theme.palette.secondary.dark, 0.2)} 100%)`,
            }}
            icon={<img alt="icon" src="/assets/icons/glass/planning.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Project Management Module "
            road="mtn"
            //  total={2340}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/projectmanagement.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Quality Control Module"
            road="mtn"
            //  total={2340}
            color="primary"
            icon={<img alt="icon" src="/assets/icons/glass/quality.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Shipyard Organization Module"
            road="mtn"
            //  total={2340}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/shipyardorg.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Desing & Document Module"
            road="dsn"
            //  total={1723}
            color="primary"
            icon={<img alt="icon" src="/assets/icons/glass/desing.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="Situations"
            subheader="(+43%) than last year"
            chart={{
              labels: [
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ],
              series: [
                {
                  name: 'Authorized',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },

                {
                  name: 'Inprogress',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Done',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Projects  Status"
            chart={{
              series: [
                { label: 'NB001', value: 4344 },
                { label: 'NB002', value: 5435 },
                { label: 'NB003', value: 1443 },
                { label: 'NB004', value: 4443 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title="Performance Rates"
            subheader="(+43%) than last year"
            chart={{
              series: [
                { label: 'Jan', value: 51 },
                { label: 'Feb', value: 73 },
                { label: 'Mar', value: 94 },
                { label: 'Apr', value: 147 },
                { label: 'May', value: 154 },
                { label: 'Jun', value: 158 },
                { label: 'Jul', value: 169 },
                { label: 'Aug', value: 110 },
                { label: 'Sep', value: 120 },
                { label: 'Oct', value: 138 },
                { label: 'Nov', value: 138 },
                { label: 'Dec', value: 138 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentSubject
            title="Current Status"
            chart={{
              categories: [
                'InProgress',
                'Suspended',
                'Done',
                'Cancelled',
                'Published',
                'Closed',
                'Authorized',
              ],
              series: [
                { name: 'NB001', data: [180, 150, 130, 140, 145, 135, 160] },
                { name: 'NB002', data: [120, 130, 140, 150, 140, 160, 134] },
                { name: 'NB003', data: [144, 176, 178, 128, 167, 85, 117] },
                { name: 'NB004', data: [114, 106, 88, 92, 137, 105, 77] },
              ],
            }}
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={8}>
          <AnalyticsNews title="News" list={_analyticPosts} />
        </Grid> */}
        {/* 
        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Order Timeline" list={_analyticOrderTimeline} />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsTrafficBySite title="Traffic by Site" list={_analyticTraffic} />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsTasks title="Tasks" list={_analyticTasks} />
        </Grid> */}
      </Grid>
    </Container>
  );
}
