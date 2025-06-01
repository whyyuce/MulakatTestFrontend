import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';

import TaskAdd from './task-add';
import TaskItem from './task-item';
import TaskColumnToolBar from './task-column-tool-bar';

// ----------------------------------------------------------------------

export default function TaskColumn({ column, tasks, index }) {
  const { enqueueSnackbar } = useSnackbar();
  const openAddTask = useBoolean();

  // Make sure column has required properties
  if (!column || !column.id) {
    console.error('Invalid column data:', column);
    return null;
  }

  const handleAddTask = useCallback(
    async (taskData) => {
      try {
        const response = await fetch('http://localhost:3000/api/task/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...taskData,
            columnId: column.id,
          }),
        });

        if (response.ok) {
          const responseData = await response.json();
          // Assuming responseData contains the newly added task data
          const newTaskData = responseData.task;

          enqueueSnackbar('Task added successfully!', {
            variant: 'success',
            anchorOrigin: { vertical: 'top', horizontal: 'center' },
          });

          // Close the Add Task modal
          openAddTask.onFalse();
        } else {
          // Handle error response
          console.error('Error:', response.statusText);
          enqueueSnackbar('Failed to add task', {
            variant: 'error',
            anchorOrigin: { vertical: 'top', horizontal: 'center' },
          });
        }
      } catch (error) {
        // Handle fetch error
        console.error('Fetch Error:', error);
        enqueueSnackbar('Error adding task', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
      }
    },
    [column.id, enqueueSnackbar, openAddTask]
  );

  const renderAddTask = (
    <Stack
      spacing={2}
      sx={{
        pb: 3,
      }}
    >
      {openAddTask.value && (
        <TaskAdd
          status={column.name || ''}
          onAddTask={handleAddTask}
          onCloseAddTask={openAddTask.onFalse}
        />
      )}

      <Button
        fullWidth
        size="large"
        color="inherit"
        startIcon={
          <Iconify
            icon={openAddTask.value ? 'solar:close-circle-broken' : 'mingcute:add-line'}
            width={18}
            sx={{ mr: -0.5 }}
          />
        }
        onClick={openAddTask.onToggle}
        sx={{ fontSize: 14 }}
      >
        {openAddTask.value ? 'Close' : 'Add Task'}
      </Button>
    </Stack>
  );

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided, snapshot) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          sx={{
            px: 2,
            borderRadius: 2,
            bgcolor: 'background.neutral',
            ...(snapshot.isDragging && {
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.24),
            }),
          }}
        >
          <Stack {...provided.dragHandleProps}>
            <TaskColumnToolBar
              columnName={column.name || 'Untitled'}
            />

            <Droppable droppableId={column.id} type="TASK">
              {(dropProvided) => (
                <Stack
                  ref={dropProvided.innerRef}
                  {...dropProvided.droppableProps}
                  spacing={2}
                  sx={{
                    py: 3,
                    width: 280,
                  }}
                >
                  {column.taskIds && column.taskIds.length > 0 ? (
                    column.taskIds.map((taskId, taskIndex) => {
                      // Find the task by ID
                      const task = tasks && typeof tasks === 'object' 
                        ? (tasks[taskId] || null) 
                        : null;
                      
                      if (!task) {
                        console.warn(`Task with ID ${taskId} not found`);
                        return null;
                      }

                      return (
                        <TaskItem
                          key={taskId}
                          index={taskIndex}
                          task={task}
                        />
                      );
                    })
                  ) : (
                    <Stack
                      alignItems="center"
                      justifyContent="center"
                      sx={{ py: 3, color: 'text.secondary' }}
                    >
                      No tasks yet
                    </Stack>
                  )}
                  {dropProvided.placeholder}
                </Stack>
              )}
            </Droppable>

            {renderAddTask}
          </Stack>
        </Paper>
      )}
    </Draggable>
  );
}

TaskColumn.propTypes = {
  column: PropTypes.object,
  index: PropTypes.number,
  tasks: PropTypes.object,
};
