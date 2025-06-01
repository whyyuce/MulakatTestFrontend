import * as XLSX from 'xlsx';
import * as React from 'react';
import isEqual from 'lodash/isEqual';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Snackbar from '@mui/material/Snackbar';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {
  DataGrid,
  useGridApiContext,
  GridToolbarContainer,
  GridCsvExportMenuItem,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarExportContainer,
  gridVisibleColumnFieldsSelector,
  gridFilteredSortedRowIdsSelector,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useGetProducts } from 'src/api/product';

import Iconify from 'src/components/iconify';
import { useTable } from 'src/components/table';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { getSpools } from '../../../api/httpServices';
import { RenderSpoolZone } from '../construction-table-row';
import ProductTableFiltersResult from '../construction-table-filters-result';

// ----------------------------------------------------------------------
const getJson = (apiRef) => {
  // Select rows and columns
  const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
  const visibleColumnsField = gridVisibleColumnFieldsSelector(apiRef);

  // Format the data. Here we only keep the value
  const data = filteredSortedRowIds.map((id) => {
    const row = {};
    visibleColumnsField.forEach((field) => {
      row[field] = apiRef.current.getCellParams(id, field).value;
    });
    return row;
  });

  // Stringify with some indentation
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#parameters
  return JSON.stringify(data, null, 2);
};
const exportBlob = (blob, filename) => {
  // Save the blob in a json file
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  });
};
const printElement = (element) => {
  const windowObject = window.open('', '_blank');
  windowObject.document.write(element.outerHTML);
  windowObject.document.close();
  windowObject.print();
};

const saveAsPdf = (element) => {
  const options = {
    paperSize: 'A4',
    landscape: true,
    margin: { left: '1cm', right: '1cm', top: '1cm', bottom: '1cm' },
  };

  // savePDF(element, options);
};
const downloadExcel = (data) => {
  console.log('data', data);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, 'SpoolList.xlsx');
};
const PROJECT_OPTIONS = [
  { value: 'NB001', label: 'NB001' },

  { value: 'NB002', label: 'NB002' },

  { value: 'NB003', label: 'NB003' },

  { value: 'NB004', label: 'NB004' },

  { value: 'NB005', label: 'NB005' },

  { value: 'NB006', label: 'NB006' },

  { value: 'NB007', label: 'NB007' },
];
const PUBLISH_OPTIONS = [
  { value: 'statuarrayed', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'draft', label: 'In Progress' },
  { value: 'draft', label: 'Done' },
  { value: 'draft', label: 'Cancelled' },
  { value: 'draft', label: 'Approved' },
];

const HIDE_COLUMNS = {
  category: true,
};

async function deleteMultipleSpools(remarkIds) {
  try {
    const response = await fetch('http://localhost:3000/api/spools/deleteMultiple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: remarkIds }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete spools');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting spools:', error);
    throw error;
  }
}
const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export function ElectricalCablewayReportView() {
  const [defaultFilters, setDefaultFilters] = useState({
    statuarray: [],
    project: '',
    projectarray: [],
    stock: [],
    statu: '',
  });
  const state = useLocation();
  const [rows, setRows] = useState([]);

  console.log('sayfastate', state);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [spools, setSpools] = useState([]);
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
  const [tableExcellData, setTableExcellData] = useState([]);

  const Spool_Status_Options = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Published', label: 'Published' },

    { value: 'Authorized', label: 'Authorized' },
    { value: 'InProgress', label: 'In Progress' },

    { value: 'Suspended', label: 'Suspended' },
    { value: 'Done', label: 'Done' },
    { value: 'Closed', label: 'Closed' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];

  const STATUS_OPTIONS = [{ value: 'All', label: 'All' }, ...Spool_Status_Options];

  const [filters, setFilters] = useState(defaultFilters);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (state && state.state && state.state.Data && state.state.Data2) {
      const event = {};
      handleFilterStatus(event, state.state.Data);
      handleFilterProjectNavi(event, state.state.Data2);
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch spools
        const fetchedSpools = await getSpools();
        console.log('fetchedSpool', fetchedSpools);
        setRows([...fetchedSpools.data, createEmptyRow()]);
        setSpools(fetchedSpools.data);

        // Apply filters
        const filteredData = applyFilter({
          inputData: fetchedSpools.data,
          filters,
        });
        console.log('filt', filteredData);
        setTableData([...filteredData, createEmptyRow()]);

        // Fetch projects
        const response = await fetch('http://localhost:3000/api/project');
        const data = await response.json();
        setProjects(data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [products, filters]);

  const addSpool = async (spool) => {
    try {
      const response = await fetch('http://localhost:3000/api/spools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(spool),
      });

      if (!response.ok) {
        throw new Error('Failed to add spool');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding spool:', error);
      throw error;
    }
  };
  const canReset = !isEqual(defaultFilters, filters);
  const handleFilters = useCallback((name, value) => {
    console.log('1event', name, value);
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);
  const handleFilters1 = useCallback(
    (name, value) => {
      console.log('1event', name, value);
      if (Array.isArray(filters[name])) {
        // Eğer filters[name] bir dizi ise, yeni değeri diziye ekleyin
        setFilters((prevState) => ({
          ...prevState,
          [name]: [...prevState[name], value],
        }));
      } else {
        // Eğer filters[name] bir dizi değilse, yeni değeri doğrudan atayın
        setFilters((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    },
    [filters]
  );

  const createEmptyRow = () => ({
    id: `empty-${Date.now()}`,
    type: 'spool',
    zone: '',
    systemno: '',
    systemname: '',
    isometrino: '',
    spoolno: '',
    rev: '',
    date: '',
    weight: '',
    surface: '',
    totalspool: '',
    production: '',
    assembly: '',
    test_delivery: '',
    installation_company: '',
    manufanctuning_company: '',
  });
  const handleProcessRowUpdate = async (newRow, oldRow) => {
    const isEmptyRow = newRow.id.startsWith('empty-');
    if (isEmptyRow) {
      try {
        //  await addSpool(newRow);
        setRows((prevRows) => {
          const updatedRows = prevRows.map((row) => (row.id === oldRow.id ? newRow : row));
          return [...updatedRows, createEmptyRow()];
        });
        enqueueSnackbar('Row added successfully', { variant: 'success' });
      } catch (error) {
        console.error('Error adding row:', error);
        enqueueSnackbar('Error adding row', { variant: 'error' });
      }
    } else {
      // Update the row in the backend
      try {
        const response = await fetch(`http://localhost:3000/api/spools/${newRow.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newRow),
        });

        if (!response.ok) {
          throw new Error('Failed to update spool');
        }

        setRows((prevRows) => prevRows.map((row) => (row.id === oldRow.id ? newRow : row)));
        enqueueSnackbar('Row updated successfully', { variant: 'success' });
      } catch (error) {
        console.error('Error updating row:', error);
        enqueueSnackbar('Error updating row', { variant: 'error' });
      }
    }

    return newRow;
  };
  const handleProcessRowUpdateError = (error) => {
    console.error('Row update error:', error);
    enqueueSnackbar('Row update error', { variant: 'error' });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const nextRow = document.activeElement.parentElement.nextSibling;
      if (nextRow) {
        const cell = nextRow.querySelector('[role="cell"]');
        if (cell) {
          cell.click();
          cell.focus();
        }
      }
    }
  };
  const handleResetFilters = useCallback(() => {
    setSelectedTab('All');
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      enqueueSnackbar('Delete success!');

      setTableData(deleteRow);
    },
    [enqueueSnackbar, tableData]
  );
  const handleFilterProject = useCallback((event) => {
    const selectedProject = event.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      project: selectedProject,
    }));
  }, []);
  const [promiseArguments, setPromiseArguments] = React.useState(null);
  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.id));
    deleteMultipleSpools(deleteRows)
      .then((response) => {
        console.log('Spools deleted successfully:', response);
      })
      .catch((error) => {
        console.error('Error deleting spools:', error);
      });

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);
  }, [enqueueSnackbar, selectedRowIds, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.edit(id));
    },
    [router]
  );
  const productRef = useRef(null);

  const handleViewRow = useCallback(
    (row) => {
      console.log('ro12w', row);

      router.push(paths.dashboard.product.details(row.id), { state: { rowData: row } });
    },
    [router]
  );
  const [selectedTab, setSelectedTab] = useState('All');

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );
  const spoolsWithIds = dataFiltered.map((remark) => ({
    ...remark,
    id: remark.id,
  }));
  const columns = [
    {
      field: 'nb001',
      headerName: 'NB001',

      editable: false,
      renderCell: (params) => <RenderSpoolZone params={params} />,
    },
    {
      field: 'tray100',
      headerName: 'CABLE TRAYS 100 MM',
      minWidth: 160,
      editable: false,
      renderCell: (params) => <RenderSpoolZone params={params} />,
    },
    {
      field: 'tray200',
      headerName: 'CABLE TRAYS 200 MM',
      minWidth: 200,
      editable: false,
      renderCell: (params) => <RenderSpoolZone params={params} />,
    },
    {
      field: 'tray300',
      headerName: 'CABLE TRAYS 300 MM',
      minWidth: 190,
      editable: false,
      renderCell: (params) => <RenderSpoolZone params={params} />,
    },
    {
      field: 'tray500',
      headerName: 'CABLE TRAYS 500 MM',
      editable: false,
      renderCell: (params) => <RenderSpoolZone params={params} />,
    },
    {
      field: 'traverse200',
      headerName: 'CABLE TRAYS TRAVERS 200 MM',
      width: 100,
      minWidth: 100,
      maxWidth: 100,
      editable: false,
      renderCell: (params) => <RenderSpoolZone params={params} />,
    },
    {
      field: 'traverse300',
      headerName: 'CABLE TRAYS TRAVERS 300 MM',
      width: 140,
      editable: false,
      renderCell: (params) => <RenderSpoolZone params={params} />,
    },
    {
      field: 'traverse500',
      headerName: 'CABLE TRAYS TRAVERS 500 MM',
      minWidth: 140,
      editable: false,
      renderCell: (params) => <RenderSpoolZone params={params} />,
    },
    {
      field: 'addCableWay',
      headerName: 'ADD Cable Way',
      width: 140,
      minWidth: 140,
      maxWidth: 140,
      flex: 1,
      editable: false,
      renderCell: (params) => <RenderSpoolZone params={params} />,
    },
    {
      field: 'total',
      headerName: 'TOTAL',
      cellClassName: 'super-app-theme--header3',
      width: 100,
      minWidth: 100,
      maxWidth: 100,
      editable: false,
      renderCell: (params) => <RenderSpoolZone params={params} />,
    },
  ];

  const handleUpdateState = async (statusofremark) => {
    console.log(`paralar`, statusofremark);
    try {
      const response = await fetch(`http://localhost:3000/api/spools/update/${data._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statu: statusofremark }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      // Yeni bir yorum ekleyin
      const commentResponse = await fetch(`http://localhost:3000/api/comments/add-comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          remarkId: data._id,
          text: `Status changed to ${statusofremark}`,
          currentStatus: statusofremark,
        }),
      });

      if (!commentResponse.ok) {
        throw new Error('API request failed');
      }

      const commdata = await commentResponse.json();
      console.log('comDatam', commdata);
      // updateCommData(commdata.comments);
      const apidata = await response.json();
      //  updateSpoolData(apidata.data);
    } catch (error) {
      console.error('API request error:', error);
    }
  };
  function computeMutation(newRow, oldRow) {
    if (newRow.statu !== oldRow.statu) {
      return `Status from '${oldRow.statu}' to '${newRow.statu}'`;
    }
    return null;
  }

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      setSelectedTab(newValue);
      if (newValue === 'All') {
        // Reset the filter state to its default value
        setFilters(defaultFilters);
      }
      console.log('filters.statu:', newValue);
      handleFilters('statu', newValue);
    },
    [handleFilters]
  );
  const handleFilterProjectNavi = useCallback(
    (event, newValue) => {
      console.log('newval', newValue);
      if (newValue === 'All') {
        // Reset the filter state to its default value
        setFilters(defaultFilters);
      }
      handleFilters1('projectarray', newValue);
    },
    [handleFilters1]
  );
  const processRowUpdate = React.useCallback(
    (newRow, oldRow) =>
      new Promise((resolve, reject) => {
        console.log(`handle`, newRow, oldRow);
        const mutation = computeMutation(newRow, oldRow);
        if (mutation) {
          // Save the arguments to resolve or reject the promise later
          setPromiseArguments({ resolve, reject, newRow, oldRow });
        } else {
          resolve(oldRow); // Nothing was changed
        }
      }),
    []
  );
  const handleEntered = () => {
    // The `autoFocus` is not used because, if used, the same Enter that saves
    // the cell triggers "No". Instead, we manually focus the "No" button once
    // the dialog is fully open.
    // noButtonRef.current?.focus();
  };
  const handleNo = () => {
    const { oldRow, resolve } = promiseArguments;
    resolve(oldRow); // Resolve with the old row to not update the internal state
    setPromiseArguments(null);
  };

  const handleYes = async () => {
    const { newRow, oldRow, reject, resolve } = promiseArguments;
    try {
      const response = await fetch(`http://localhost:3000/api/spools/update/${newRow._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statu: newRow.statu }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      // Yeni bir yorum ekleyin
      const commentResponse = await fetch(`http://localhost:3000/api/comments/add-comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          remarkId: newRow._id,
          text: `Status changed to ${newRow.statu}`,
          currentStatus: oldRow.statu,
        }),
      });

      if (!commentResponse.ok) {
        throw new Error('API request failed');
      }

      setSnackbar({ children: 'Spool successfully saved', severity: 'success' });
      resolve(response);
      setPromiseArguments(null);
      const commdata = await commentResponse.json();
      console.log('comDatam', commdata);
      // updateCommData(commdata.comments);
      const apidata = await response.json();
      //  updateSpoolData(apidata.data);
    } catch (error) {
      setSnackbar({ children: 'Spool  Couldnt Saved', severity: 'error' });
      reject(oldRow);
      setPromiseArguments(null);
      console.error('API request error:', error);
    }
  };

  const renderConfirmDialog = () => {
    if (!promiseArguments) {
      return null;
    }

    const { newRow, oldRow } = promiseArguments;
    const mutation = computeMutation(newRow, oldRow);

    return (
      <Dialog
        maxWidth="xs"
        TransitionProps={{ onEntered: handleEntered }}
        open={!!promiseArguments}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent dividers>{`Pressing 'Yes' will change ${mutation}.`}</DialogContent>
        <DialogActions>
          <Button ref={noButtonRef} onClick={handleNo}>
            No
          </Button>
          <Button onClick={handleYes}>Yes</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const handleExportJson = useCallback(() => {
    const { apiRef } = table;

    if (!apiRef.current) {
      return;
    }

    const jsonString = getJson(apiRef);

    exportBlob(new Blob([jsonString], { type: 'application/json' }), 'data.json');
  }, [table.apiRef]);

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);
  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarExportContainer>
        <GridCsvExportMenuItem options={{ allColumns: true }} />
        <MenuItem
          onClick={() => {
            console.log('datafi', dataFiltered);
            downloadExcel(dataFiltered);
          }}
        >
          Excel
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            printElement(dataFiltered);
          }}
        >
          Print
        </MenuItem>
        <MenuItem
          onClick={() => {
            saveAsPdf(dataFiltered);
          }}
        >
          PDF
        </MenuItem> */}
      </GridToolbarExportContainer>
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
          heading="Electrical Cable Way Follow List"
          links={[
            { name: 'Construction Module', href: paths.dashboard.root },
            {
              name: 'Electrical System Submodule',
            },
            {
              name: 'Cable Way  Follow List',
            },
          ]}
          // action={
          //   <Button
          //     component={RouterLink}
          //     href={paths.dashboard.construction.ElectricalCablewayView}
          //     variant="contained"
          //     startIcon={<Iconify icon="mingcute:add-line" />}
          //   >
          //     New Spool
          //   </Button>
          // }
          sx={{
            mb: {
              xs: 1,
              md: 1,
            },
          }}
        />

        <Card
          sx={{
            height: { xs: '800', md: 2 },
            minHeight: { xs: 800 },
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            flexDirection: { md: 'column' },
            overflow: 'hidden', // Add overflow property here
          }}
        >
          {/* {tableData.length >= 0 && (
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
                        (tab.value === 'Done' && 'success') ||
                        (tab.value === 'Authorized' && 'info') ||
                        (tab.value === 'InProgress' && 'primary') ||
                        (tab.value === 'Suspended' && 'warning') ||
                        (tab.value === 'Cancelled' && 'warning') ||
                        (tab.value === 'Closed' && 'error') ||
                        (tab.value === 'Published' && 'secondary') ||
                        'default'
                      }
                    >
                      {[
                        'Done',
                        'Published',
                        'Authorized',
                        'Cancelled',
                        'Suspended',
                        'Closed',
                        'Draft',
                        'InProgress',
                      ].includes(tab.value)
                        ? tableData.filter((rmk) => rmk.statu === tab.value).length
                        : selectedTab === 'All'
                          ? tableData.length
                          : 0}
                    </Label>
                  }
                />
              ))}
            </Tabs>
          )} */}

          {renderConfirmDialog()}
          <Box
            sx={{
              '& .super-app-theme--header': {
                minWidth: 100,
                color: 'transparent',
              },
              '& .super-app-theme--header2': {
                backgroundColor: '#d6f1e8',
                minWidth: 100,
              },
              '& .super-app-theme--header3': {
                backgroundColor: '#e1e3e8',
                minWidth: 100,
              },
              '& .super-app-theme--header4': {
                backgroundColor: '#f1ecd6',
              },
              '& .super-app-theme--header5': {
                backgroundColor: '#0288d1',
              },
              '& .super-app-theme--header6': {
                backgroundColor: '#f1d6ef',
              },
            }}
          >
            <DataGrid
              checkboxSelection
              disableRowSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
              rows={spoolsWithIds}
              getRowId={(row) => row.id}
              // onRowClick={handleViewRow}
              sx={{
                boxShadow: 2,
                height: '70%', // SAYILAR VE BOYUT KONTROL EDİLECEK
                '& .MuiDataGrid-cell:hover': {
                  color: 'error.dark',
                },
              }}
              processRowUpdate={handleProcessRowUpdate}
              onProcessRowUpdateError={handleProcessRowUpdateError}
              columns={columns}
              // loading={productsLoading}
              getRowHeight={() => 'auto'}
              pageSizeOptions={[20, 30, 40]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 20 },
                },
              }}
              onKeyDown={handleKeyDown}
              onSelectionModelChange={(newSelection) => {
                // Seçilen öğenin ID'sini alarak veri setinden bulun
                const selectedItemId = newSelection[0];
                const selectedItem = spoolsWithIds.find((item) => item.id === selectedItemId);

                // Seçili öğenin verisini detay sayfasına iletiyoruz
                handleViewRow(selectedItem);
              }}
              onRowSelectionModelChange={(newSelectionModel) => {
                setSelectedRowIds(newSelectionModel);
              }}
              columnVisibilityModel={columnVisibilityModel}
              onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
              slots={{
                toolbar: () => (
                  <>
                    <GridToolbarContainer>
                      {/* listedeki statüs project filter alanı */}
                      {/* <ProductTableToolbar // bu component altında editleme var
                        filters={filters}
                        onFilters={handleFilters}
                        projectArrayOptions={PROJECT_OPTIONS}
                        statuarrayOptions={Spool_Status_Options}
                        projectOptions={projects.map((project) => ({
                          value: project.project_name,
                          label: project.project_name,
                        }))}
                      /> */}

                      <GridToolbarQuickFilter
                        sx={{
                          flexShrink: 0,
                          width: { xs: 1, md: 580 },
                        }}
                      />

                      <Stack
                        spacing={1}
                        flexGrow={1}
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        {!!selectedRowIds.length && (
                          <Button
                            size="small"
                            color="error"
                            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                            onClick={confirmRows.onTrue}
                          >
                            Delete ({selectedRowIds.length})
                          </Button>
                        )}
                        <CustomToolbar />
                        <GridToolbarColumnsButton />
                        <GridToolbarFilterButton />
                        {/* filtre butonu export butonu ve colums */}
                        {
                          // export butonu burasıdır
                          /* <GridToolbarExport /> */
                        }
                      </Stack>
                    </GridToolbarContainer>

                    {canReset && (
                      <ProductTableFiltersResult
                        filters={filters}
                        onFilters={handleFilters}
                        onResetFilters={handleResetFilters}
                        results={dataFiltered.length}
                        sx={{ p: 2.5, pt: 0 }}
                      />
                    )}
                  </>
                ),
                noRowsOverlay: () => <EmptyContent title="No Data" />,
                noResultsOverlay: () => <EmptyContent title="No results found" />,
              }}
              slotProps={{
                columnsPanel: {
                  getTogglableColumns,
                },
              }}
            />
          </Box>
          {!!snackbar && (
            <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
              <Alert {...snackbar} onClose={handleCloseSnackbar} />
            </Snackbar>
          )}
        </Card>
      </Container>

      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selectedRowIds.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmRows.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

const csvOptions = { delimiter: ';' };
function CustomExportButton(props) {
  return (
    <GridToolbarExportContainer {...props}>
      <GridCsvExportMenuItem options={csvOptions} />
      <JsonExportMenuItem />
    </GridToolbarExportContainer>
  );
}

// ----------------------------------------------------------------------
function JsonExportMenuItem(props) {
  const apiRef = useGridApiContext();

  const { hideMenu } = props;

  return (
    <MenuItem
      onClick={() => {
        const jsonString = getJson(apiRef);
        const blob = new Blob([jsonString], {
          type: 'text/json',
        });
        exportBlob(blob, 'DataGrid_demo.json');

        // Hide the export menu after the export
        hideMenu?.();
      }}
    >
      Export JSON
    </MenuItem>
  );
}

function applyFilter({ inputData, filters }) {
  const { statu, statuarray, projectarray } = filters;
  console.log('filter', filters);
  const filteredData = inputData;

  // if (Array.isArray(projectarray) && projectarray.length > 0) {
  //   filteredData = filteredData.filter((remark) => projectarray.includes(remark.project));
  // }

  // if (statu !== 'All' && statu !== '') {
  //   filteredData = filteredData.filter((remark) => remark.statu === statu);
  // }

  // if (Array.isArray(statuarray) && statuarray.length > 0) {
  //   filteredData = filteredData.filter((remark) => statuarray.includes(remark.statu));
  // }

  return filteredData;
}
