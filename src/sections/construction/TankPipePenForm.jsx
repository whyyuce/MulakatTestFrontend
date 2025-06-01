import React, { useState } from 'react';

import { Box, Button, TextField, Typography } from '@mui/material';

export default function TankPipePenForm({ onProjectAdded }) {
  const [projectName, setProjectName] = useState('');
  const [Tank_Number, setTankNumber] = useState('');
  const [columns, setColumns] = useState({
    'Remote Sounding': '',
    'Tank Airing Line': '',
    'Tank Fiiling Line': '',
  });

  const handleColumnChange = (e) => {
    const { name, value } = e.target;
    setColumns((prevColumns) => ({
      ...prevColumns,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/tankpipepen/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          columns,
        }),
      });
      const newProject = await response.json();
      onProjectAdded(newProject);
    } catch (error) {
      console.error('Error adding TankPipePen:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add New Tank
      </Typography>
      <TextField
        label="Tank  Number"
        fullWidth
        value={Tank_Number}
        onChange={(e) => setProjectName(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Tank  Name"
        fullWidth
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" color="primary" type="submit">
        Add TankPipePen
      </Button>
    </Box>
  );
}
