# Custom List View Component

This component provides a customizable list view with filtering, sorting, and export capabilities.

## Features

- Tabbed interface for filtering by status
- Project filtering dropdown
- Excel export functionality
- Customizable columns with visibility toggle
- Responsive design
- Pagination
- Row selection

## Usage

```jsx
import CustomListView from 'src/sections/construction/view/custom-list-view';

function YourPage() {
  return <CustomListView />;
}
```

## Customization

### Project Options

You can customize the project options by modifying the `PROJECT_OPTIONS` constant in the component:

```jsx
const PROJECT_OPTIONS = [
  { value: 'PRJ001', label: 'Project 001' },
  { value: 'PRJ002', label: 'Project 002' },
  // Add more projects as needed
];
```

### Status Options

You can customize the status options by modifying the `STATUS_OPTIONS` constant:

```jsx
const STATUS_OPTIONS = [
  { value: 'All', label: 'All' },
  { value: 'Active', label: 'Active' },
  // Add more statuses as needed
];
```

### Columns

You can customize the columns by modifying the `columns` array in the component:

```jsx
const columns = [
  {
    field: 'id',
    headerName: 'ID',
    width: 120,
    flex: 1,
  },
  // Add more columns as needed
];
```

## Data Source

By default, the component uses mock data. To connect it to a real API, modify the `useEffect` hook that populates the `tableData` state. 