import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function ProductTableToolbar({
  filters,
  onFilters,
  //
  projectArrayOptions,

  statuarrayOptions,
}) {
  const popover = usePopover();

  const [projectarray, setStock] = useState(filters.projectarray);

  const [statuarray, setPublish] = useState(filters.statuarray);

  const handleChangeStock = useCallback((event) => {
    const {
      target: { value },
    } = event;
    setStock(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleChangePublish = useCallback((event) => {
    const {
      target: { value },
    } = event;
    setPublish(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleCloseStock = useCallback(() => {
    onFilters('projectarray', projectarray);
  }, [onFilters, projectarray]);

  const handleClosePublish = useCallback(() => {
    onFilters('statuarray', statuarray);
  }, [onFilters, statuarray]);

  return (
    <>
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 180 },
        }}
      >
        <InputLabel>Project</InputLabel>

        <Select
          multiple
          value={projectarray}
          onChange={handleChangeStock}
          input={<OutlinedInput label="Stock" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          onClose={handleCloseStock}
          sx={{ textTransform: 'capitalize' }}
        >
          {projectArrayOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox disableRipple size="small" checked={projectarray.includes(option.value)} />
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 180 },
        }}
      >
        <InputLabel>Status</InputLabel>

        <Select
          multiple
          value={statuarray}
          onChange={handleChangePublish}
          input={<OutlinedInput label="Publish" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          onClose={handleClosePublish}
          sx={{ textTransform: 'capitalize' }}
        >
          {statuarrayOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox disableRipple size="small" checked={statuarray.includes(option.value)} />
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </CustomPopover>
    </>
  );
}

ProductTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  statuarrayOptions: PropTypes.array,

  projectArrayOptions: PropTypes.array,
};
