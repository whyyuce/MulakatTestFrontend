import React, { useRef, useState, useEffect } from 'react';

import Tooltip from '@mui/material/Tooltip';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Box,
  Table,
  Paper,
  Button,
  Collapse,
  TableRow,
  TableBody,
  TableCell,
  TextField,
  TableHead,
  IconButton,
  Typography,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TankPipePenForm from '../TankPipePenForm';

function Row(props) {
  const { row, onAddColumn, onUpdateColumn } = props;
  const [open, setOpen] = useState(false);
  const [newColumn, setNewColumn] = useState('');
  const [newValue, setNewValue] = useState('');
  const [columnValues, setColumnValues] = useState(row.columns);

  useEffect(() => {
    setColumnValues(row.columns);
  }, [row.columns]);

  const handleAddColumn = () => {
    if (!newColumn || !newValue) {
      alert('Both Column name and Value are required!');
      return;
    }
    onAddColumn(row._id, newColumn, newValue);
    setNewColumn('');
    setNewValue('');
  };

  const handleValueChange = (column, value) => {
    setColumnValues((prevValues) => ({ ...prevValues, [column]: value }));
    onUpdateColumn(row._id, column, value);
  };

  return (
    <>
      <TableRow
        sx={{
          backgroundColor: props.index % 2 === 0 ? '#e6e6e6' : '#ffffff',
          '& > *': { borderBottom: 'unset' },
        }}
      >
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.projectName}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Systems
              </Typography>
              {/* TableContainer with horizontal scroll enabled */}
              <TableContainer component={Paper} sx={{ maxHeight: 300, overflowX: 'auto' }}>
                <Table
                  size="small"
                  aria-label="columns"
                  sx={{ minWidth: '1000px', tableLayout: 'auto', whiteSpace: 'nowrap' }}
                >
                  <TableHead>
                    <TableRow>
                      {Object.keys(columnValues).map((colName) => (
                        <Tooltip title={colName} key={colName}>
                          <TableCell
                            key={colName}
                            sx={{
                              padding: '8px 16px',
                              textAlign: 'center',
                              fontSize: '16px', // Kolon başlıklarının yazı boyutu
                              fontWeight: 'bold',
                              minWidth: '150px', // Minimum genişlik, kolonun daralmasını önler
                            }}
                          >
                            {colName}
                          </TableCell>
                        </Tooltip>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      {Object.entries(columnValues).map(([column, value]) => (
                        <TableCell
                          key={column}
                          sx={{
                            padding: '8px 16px',
                            textAlign: 'center',
                            fontSize: '16px', // Değerlerin yazı boyutu
                            minWidth: '150px', // Değer hücrelerinin daralmasını önler
                          }}
                        >
                          <TextField
                            value={value}
                            onChange={(e) => handleValueChange(column, e.target.value)}
                            fullWidth
                            variant="outlined"
                            size="small"
                            sx={{
                              '& .MuiInputBase-input': {
                                padding: '8px 14px',
                              },
                            }}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ marginTop: '10px' }}>
                <TextField
                  label="New Column"
                  value={newColumn}
                  onChange={(e) => setNewColumn(e.target.value)}
                  sx={{ marginRight: '10px' }}
                />
                <TextField
                  label="New Value"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                />
                <Button
                  onClick={handleAddColumn}
                  variant="contained"
                  color="primary"
                  sx={{ marginLeft: '10px', marginTop: '10px' }}
                >
                  Add System
                </Button>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export function TankPenTestView() {
  const [rows, setRows] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleImport = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // İlk sayfayı okuyoruz
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Verileri JSON formatına dönüştürüyoruz
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Verileri işleme (API isteği gönderme vb.)
        console.log('Excel Verisi:', jsonData);
      };
      reader.readAsArrayBuffer(selectedFile);
    } else {
      alert('Lütfen bir Excel dosyası seçin!');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/tankpipepen');
        const data = await response.json();
        setRows(data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleUpdateColumn = async (id, column, value) => {
    try {
      const response = await fetch(`http://localhost:3000/api/tankpipepen/update-column/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          columns: {
            [column]: value,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update column');
      }

      // Gelen yanıtı işle (örneğin, güncellenmiş satırı state'e ekleyin)
      const updatedRow = await response.json();
      setRows((prevRows) => prevRows.map((row) => (row._id === id ? updatedRow.data : row)));
    } catch (error) {
      console.error('Error updating column:', error);
    }
  };

  const handleAddColumn = async (id, newColumn, newValue) => {
    try {
      const response = await fetch(`http://localhost:3000/api/tankpipepen/add-column/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          columns: {
            [newColumn]: newValue,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add new column');
      }

      const updatedRow = await response.json();
      setRows((prevRows) => prevRows.map((row) => (row._id === id ? updatedRow.data : row)));
    } catch (error) {
      console.error('Error adding new column:', error);
    }
  };

  const handleProjectAdded = (newProject) => {
    setRows((prevRows) => [...prevRows, newProject]);
  };

  return (
    <>
      <CustomBreadcrumbs
        heading="Tank Pipe Penetration Follow List"
        links={[
          { name: 'Construction Module', href: paths.dashboard.root },
          {
            name: 'Piping Submodule',
          },
          {
            name: 'Tank Pipe Penetration',
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
          paddingBottom: 10,
          mb: {
            xs: 1,
            md: 1,
          },
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
        <Button
          variant="contained"
          component="a" // <a> etiketine dönüştürmek için
          href="/path/to/your/excel/template.xlsx" // Excel dosyasının linki
          download="tank_pipe_penetration_template.xlsx" // İndirilecek dosya adı
          sx={{ marginRight: 2 }} // Sağdaki buton ile arasına boşluk ekle
        >
          Create New Tank
        </Button>
        <Button
          variant="contained"
          component="a" // <a> etiketine dönüştürmek için
          href="/path/to/your/excel/template.xlsx" // Excel dosyasının linki
          download="tank_pipe_penetration_template.xlsx" // İndirilecek dosya adı
          sx={{ marginRight: 2 }} // Sağdaki buton ile arasına boşluk ekle
        >
          Download Excel Template
        </Button>
        <Button variant="contained" component="label" onClick={() => fileInputRef.current.click()}>
          Import Excel
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept=".xlsx, .xls"
        />
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          borderLeft: 1,
          borderRight: 1,
          borderBottom: 1,
          borderLeftWidth: 1,

          borderRightWidth: 1,

          borderBottomWidth: 1,

          borderColor: '#c2cccb',

          maxWidth: '100%',
          overflowX: 'auto',
          minWidth: 800,
        }}
      >
        <Table aria-label="collapsible table" sx={{ minWidth: 800, tableLayout: 'auto' }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontSize: '30px',
                  fontWeight: 'bold',
                  backgroundColor: '#c2cccb',
                  borderTopLeftRadius: 10,
                }}
              />
              <TableCell
                sx={{
                  fontSize: '2.5rem',
                  fontWeight: 'bolder',
                  borderTopRightRadius: 10,
                  color: '#007868',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                  backgroundColor: '#c2cccb',
                }}
              >
                Tank Name
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ fontSize: '30px', fontWeight: 'bold' }}>
            {rows.map((row, index) => (
              <Row
                sx={{ fontSize: '30px', fontWeight: 'bold' }}
                key={row._id}
                row={row}
                index={index}
                onAddColumn={handleAddColumn}
                onUpdateColumn={handleUpdateColumn}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TankPipePenForm onProjectAdded={handleProjectAdded} />
    </>
  );
}
