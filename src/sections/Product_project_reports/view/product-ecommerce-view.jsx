import React, { useState, useEffect } from 'react';

import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { useSettingsContext } from 'src/components/settings';

import EcommerceSaleByGender from '../ecommerce-sale-by-gender';
import EcommerceSalesOverview from '../ecommerce-sales-overview';

// ----------------------------------------------------------------------
export default function ProductEcommerceView() {
  const { user } = useMockedUser();
  const [selectedProject, setSelectedProject] = useState('NB001');
  const [PieData, setPieData] = useState([]);
  const theme = useTheme();
  const settings = useSettingsContext();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/project');
        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error('Error fetching project data:', error);
        return [];
      }
    };

    const fetchAllProjects = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/remarks/allprojectdata');
        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error('Error fetching project data:', error);
        return [];
      }
    };

    const fetchData = async () => {
      const ProjectData = await fetchProjects();
      const Allproject = await fetchAllProjects();

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

      const orderedProjectIds = ProjectData.map((project) => project.project_name);

      const transformedDataforProject = orderedProjectIds.map((projectId) => {
        const projectData = Allproject[projectId];

        const chartSeries = allStatusOptions.map((status) => ({
          label: status,
          value:
            projectData[status] && projectData[status].length > 0
              ? projectData[status][0].count
              : 0,
        }));

        // "Opens" ve "Closeds" için toplam değerleri hesapla
        const opensLabels = ['Published', 'Authorized', 'InProgress', 'Suspended'];
        const closedsLabels = ['Done', 'Closed', 'Cancelled', 'Draft'];

        const opensTotal = calculateTotalValues(chartSeries, opensLabels);
        const closedsTotal = calculateTotalValues(chartSeries, closedsLabels);

        return {
          projectId,
          chart: {
            series: chartSeries,
          },
          opensTotal,
          closedsTotal,
        };
      });

      setPieData(transformedDataforProject);
    };

    fetchData();
  }, [selectedProject]);

  return (
    <Container
      sx={{
        paddingTop: 10, // optional, for padding inside the bordered area
      }}
      maxWidth={settings.themeStretch ? false : 'xl'}
    >
      <Typography variant="h4"> Projects Overview </Typography>
      <Grid
        container
        sx={{
          marginTop: 10,
          // optional, for padding inside the bordered area
        }}
        spacing={3}
      >
        {PieData.map((project) => (
          <Grid
            container
            spacing={3}
            key={project.projectId}
            sx={{
              marginBottom: 15,
              border: '3px solid',
              borderColor: 'grey.300', // or any color you prefer
              borderRadius: 2, // optional, for rounded corners
              padding: 2, // optional, for padding inside the bordered area
            }}
            xs={12}
            md={12}
            lg={12}
          >
            <Grid xs={12} md={6} lg={8}>
              <EcommerceSalesOverview
                title={project.projectId}
                data={project.chart.series.map((item) => ({
                  label: item.label,
                  totalAmount: item.value,
                  value: item.value,
                }))}
              />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <EcommerceSaleByGender
                title={`Open and Close for ${project.projectId}`}
                total={project.opensTotal + project.closedsTotal}
                chart={{
                  series: [
                    { label: 'Opens', value: project.opensTotal },
                    { label: 'Closeds', value: project.closedsTotal },
                  ],
                }}
              />
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

const calculateTotalValues = (series, labels) =>
  series.reduce((total, item) => {
    if (labels.includes(item.label)) {
      return total + item.value;
    }
    return total;
  }, 0);
// return (
//   <Container maxWidth={settings.themeStretch ? false : 'xl'}>
//     <Grid container spacing={3}>
//       {/* <Grid xs={12} md={8}>
//         <EcommerceWelcome
//           title={`Congratulations! \n ${user?.displayName}`}
//           description="Best seller of the month You have done 57.6% more sales today."
//           img={<MotivationIllustration />}
//           action={
//             <Button variant="contained" color="primary">
//               Go Now
//             </Button>
//           }
//         />
//       </Grid> */}

//       {/* <Grid xs={12} md={4}>
//         <EcommerceNewProducts list={_ecommerceNewProducts} />
//       </Grid> */}
//       {/*
//       <Grid xs={12} md={4}>
//         <EcommerceWidgetSummary
//           title="Product Sold"
//           percent={2.6}
//           total={765}
//           chart={{
//             series: [22, 8, 35, 50, 82, 84, 77, 12, 87, 43],
//           }}
//         />
//       </Grid> */}

//       {/* <Grid xs={12} md={4}>
//         <EcommerceWidgetSummary
//           title="Total Balance"
//           percent={-0.1}
//           total={18765}
//           chart={{
//             colors: [theme.palette.info.light, theme.palette.info.main],
//             series: [56, 47, 40, 62, 73, 30, 23, 54, 67, 68],
//           }}
//         />
//       </Grid> */}

//       {/* <Grid xs={12} md={4}>
//         <EcommerceWidgetSummary
//           title="Sales Profit"
//           percent={0.6}
//           total={4876}
//           chart={{
//             colors: [theme.palette.warning.light, theme.palette.warning.main],
//             series: [40, 70, 75, 70, 50, 28, 7, 64, 38, 27],
//           }}
//         />
//       </Grid> */}
//       {/* <Grid xs={12} md={6} lg={8}>
//         <EcommerceSalesOverview title="Sales Overview" data={_ecommerceSalesOverview} />
//       </Grid>

//       <Grid xs={12} md={6} lg={4}>
//         <EcommerceSaleByGender
//           title="Sale By Gender"
//           total={2324}
//           chart={{
//             series: [
//               { label: 'Mens', value: 44 },
//               { label: 'Womens', value: 75 },
//             ],
//           }}
//         />
//       </Grid> */}
//       {PieData?.map((project) => (
//         <Grid container spacing={3} xs={12} md={12} lg={12}>
//           <Grid xs={12} md={6} lg={8}>
//             <EcommerceSalesOverview
//               key={project.projectId}
//               title={`Project ${project.projectId} Overview`}
//               data={project.chart.series.map((item) => ({
//                 label: item.label,
//                 totalAmount: item.value, // totalAmount olarak value kullanılıyor
//                 value: item.value, // value aynı kalıyor
//               }))}
//             />
//           </Grid>
//           <Grid xs={12} md={6} lg={4}>
//             <EcommerceSaleByGender
//               title="Sale By Gender"
//               total={2324}
//               chart={{
//                 series: [
//                   { label: 'Mens', value: 44 },
//                   { label: 'Womens', value: 75 },
//                 ],
//               }}
//             />
//           </Grid>
//         </Grid>
//       ))}

//       {/* <Grid xs={12} md={6} lg={8}>
//         <EcommerceYearlySales
//           title="Yearly Sales"
//           subheader="(+43%) than last year"
//           chart={{
//             categories: [
//               'Jan',
//               'Feb',
//               'Mar',
//               'Apr',
//               'May',
//               'Jun',
//               'Jul',
//               'Aug',
//               'Sep',
//               'Oct',
//               'Nov',
//               'Dec',
//             ],
//             series: [
//               {
//                 year: '2019',
//                 data: [
//                   {
//                     name: 'Total Income',
//                     data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
//                   },
//                   {
//                     name: 'Total Expenses',
//                     data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
//                   },
//                 ],
//               },
//               {
//                 year: '2020',
//                 data: [
//                   {
//                     name: 'Total Income',
//                     data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
//                   },
//                   {
//                     name: 'Total Expenses',
//                     data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
//                   },
//                 ],
//               },
//             ],
//           }}
//         />
//       </Grid> */}

//       {/* <Grid xs={12} md={6} lg={4}>
//         <EcommerceCurrentBalance
//           title="Current Balance"
//           currentBalance={187650}
//           sentAmount={25500}
//         />
//       </Grid> */}

//       {/* <Grid xs={12} md={6} lg={8}>
//         <EcommerceBestSalesman
//           title="Best Salesman"
//           tableData={_ecommerceBestSalesman}
//           tableLabels={[
//             { id: 'name', label: 'Seller' },
//             { id: 'category', label: 'Product' },
//             { id: 'country', label: 'Country', align: 'center' },
//             { id: 'totalAmount', label: 'Total', align: 'right' },
//             { id: 'rank', label: 'Rank', align: 'right' },
//           ]}
//         />
//       </Grid>

//       <Grid xs={12} md={6} lg={4}>
//         <EcommerceLatestProducts title="Latest Products" list={_ecommerceLatestProducts} />
//       </Grid> */}
//     </Grid>
//   </Container>
// );
