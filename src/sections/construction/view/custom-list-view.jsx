import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { alpha } from '@mui/material/styles';
import { FormControl, InputLabel, OutlinedInput, Select } from '@mui/material';

import { useTable, getComparator } from 'src/components/table';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useGridApiRef,
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridActionsCellItem,
  GridToolbarExportContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridCsvExportMenuItem,
  useGridApiContext,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useGetProducts } from 'src/api/product';

import * as XLSX from 'xlsx';

// ----------------------------------------------------------------------

// Define your new project options
const PROJECT_OPTIONS = [
  { value: 'PRJ001', label: 'Project 001' },
  { value: 'PRJ002', label: 'Project 002' },
  { value: 'PRJ003', label: 'Project 003' },
  { value: 'PRJ004', label: 'Project 004' },
  { value: 'PRJ005', label: 'Project 005' },
];

// Define your status options
const STATUS_OPTIONS = [
  { value: 'All', label: 'All' },
  { value: 'Active', label: 'Active' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

// Define columns to hide by default
const HIDE_COLUMNS = {
  created_at: false,
  updated_at: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['id'];

// ----------------------------------------------------------------------

// Helper functions
const downloadExcel = (data) => {
  console.log('data', data);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, 'CustomListData.xlsx');
};

// ----------------------------------------------------------------------

// ProductTableToolbar component for filtering
function ProductTableToolbar({ filters, onFilters, projectOptions }) {
  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 200 },
        }}
      >
        <InputLabel>Project</InputLabel>

        <Select
          value={filters.project}
          onChange={(event) => onFilters('project', event.target.value)}
          input={<OutlinedInput label="Project" />}
          renderValue={(selected) => {
            const selectedOption = projectOptions.find((option) => option.value === selected);
            return selectedOption ? selectedOption.label : '';
          }}
        >
          <MenuItem value="">All</MenuItem>
          {projectOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}

ProductTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  projectOptions: PropTypes.array,
};

// ----------------------------------------------------------------------

export default function CustomListView() {
  const [defaultFilters, setDefaultFilters] = useState({
    status: [],
    project: '',
    projectArray: [],
  });

  const state = useLocation();
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const noButtonRef = React.useRef(null);
  const confirmRows = useBoolean();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const settings = useSettingsContext();

  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const { products, productsLoading } = useGetProducts();

  const [tableData, setTableData] = useState([]);
  const [tableExcelData, setTableExcelData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);
  const [selectedItem, setSelectedItem] = useState(null);

  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);
  
  const [selectedTab, setSelectedTab] = useState('All');

  // Mock data for demonstration
  useEffect(() => {
    // This would normally be an API call
    const mockData = Array.from({ length: 50 }, (_, index) => ({
      id: `ITEM-${index + 1000}`,
      project: PROJECT_OPTIONS[Math.floor(Math.random() * PROJECT_OPTIONS.length)].value,
      name: `Item ${index + 1}`,
      description: `Description for item ${index + 1}`,
      status: STATUS_OPTIONS[Math.floor(Math.random() * (STATUS_OPTIONS.length - 1)) + 1].value,
      assignee: `User ${Math.floor(Math.random() * 10) + 1}`,
      priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
      created_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      updated_at: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
    }));
    
    setItems(mockData);
    setTableData(mockData);
  }, []);

  // Filter handlers
  const handleFilterStatus = (event, newValue) => {
    setSelectedTab(newValue);
    
    setFilters((prevState) => ({
      ...prevState,
      status: newValue !== 'All' ? [newValue] : [],
    }));
  };

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  // Apply filters to data
  const dataFiltered = applyFilter({
    inputData: tableData,
    filters,
  });

  // Handle row click
  const handleViewRow = (row) => {
    navigate(`/dashboard/custom/details/${row.id}`);
  };

  // Define columns
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 120,
      flex: 1,
    },
    {
      field: 'project',
      headerName: 'Project',
      width: 140,
      flex: 1,
      renderCell: (params) => (
        <Box>
          {PROJECT_OPTIONS.find((option) => option.value === params.value)?.label || params.value}
        </Box>
      ),
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 180,
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ fontWeight: 'bold' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 240,
      flex: 3,
    },
    {
      field: 'assignee',
      headerName: 'Assignee',
      width: 140,
      flex: 1,
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 120,
      flex: 1,
      renderCell: (params) => (
        <Label
          variant="soft"
          color={
            (params.value === 'High' && 'error') ||
            (params.value === 'Medium' && 'warning') ||
            'success'
          }
        >
          {params.value}
        </Label>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      flex: 1,
      renderCell: (params) => (
        <Label
          variant="soft"
          color={
            (params.value === 'Completed' && 'success') ||
            (params.value === 'Active' && 'info') ||
            (params.value === 'Pending' && 'warning') ||
            (params.value === 'Cancelled' && 'error') ||
            'default'
          }
        >
          {params.value}
        </Label>
      ),
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      width: 160,
      flex: 1,
      renderCell: (params) => (
        <Box>
          {new Date(params.value).toLocaleDateString()}
        </Box>
      ),
    },
    {
      field: 'updated_at',
      headerName: 'Updated At',
      width: 160,
      flex: 1,
      renderCell: (params) => (
        <Box>
          {new Date(params.value).toLocaleDateString()}
        </Box>
      ),
    },
  ];

  // Custom toolbar component
  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExportContainer>
        <GridCsvExportMenuItem options={{ allColumns: true }} />
        <MenuItem
          onClick={() => {
            downloadExcel(dataFiltered);
          }}
        >
          Excel
        </MenuItem>
      </GridToolbarExportContainer>
      <GridToolbarQuickFilter
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 180 },
        }}
      />
    </GridToolbarContainer>
  );

  return (
    <>
      <Container
        maxWidth="100%"
        sx={{
          flexGrow: 1,
          maxWidth: '90%',
          display: 'flex',
          flexDirection: 'column',
          padding: '40px',
        }}
      >
        <CustomBreadcrumbs
          heading="Custom List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            {
              name: 'Custom',
              href: paths.dashboard.root,
            },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href="/dashboard/custom/new"
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Item
            </Button>
          }
          sx={{
            mb: {
              xs: 1,
              md: 1,
            },
          }}
        />

        <Card
          sx={{
            height: { xs: 'auto', md: 2 },
            minHeight: { xs: 700 },
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            flexDirection: { md: 'column' },
            overflow: 'auto',
          }}
        >
          {tableData.length >= 0 && (
            <Tabs
              value={selectedTab}
              onChange={handleFilterStatus}
              sx={{
                px: 2.5,
                boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
              }}
            >
              {STATUS_OPTIONS.map((tab) => (
                <Tab
                  key={tab.value}
                  iconPosition="end"
                  value={tab.value}
                  label={tab.label}
                  icon={
                    <Label
                      variant="outlined"
                      color={
                        (tab.value === 'Completed' && 'success') ||
                        (tab.value === 'Active' && 'info') ||
                        (tab.value === 'Pending' && 'warning') ||
                        (tab.value === 'Cancelled' && 'error') ||
                        'default'
                      }
                    >
                      {tab.value === 'All'
                        ? tableData.length
                        : tableData.filter((item) => item.status === tab.value).length}
                    </Label>
                  }
                />
              ))}
            </Tabs>
          )}

          <DataGrid
            checkboxSelection
            disableRowSelectionOnClick
            rows={dataFiltered}
            columns={columns}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            onCellClick={(params) => {
              if (params.field !== 'status' && params.field !== '__check__') {
                handleViewRow(params.row);
              }
            }}
            onRowSelectionModelChange={(newSelectionModel) => {
              setSelectedRowIds(newSelectionModel);
            }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            slots={{
              toolbar: () => (
                <>
                  <ProductTableToolbar
                    filters={filters}
                    onFilters={handleFilters}
                    projectOptions={PROJECT_OPTIONS}
                  />
                  <CustomToolbar />
                </>
              ),
            }}
          />
        </Card>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

// Filter function
function applyFilter({ inputData, filters }) {
  const { status, project } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  inputData = stabilizedThis.map((el) => el[0]);

  if (status.length) {
    inputData = inputData.filter((item) => status.includes(item.status));
  }

  if (project) {
    inputData = inputData.filter((item) => item.project === project);
  }

  return inputData;
} 