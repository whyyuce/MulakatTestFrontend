import { useState, useEffect, useCallback } from 'react';
import { Droppable, DragDropContext } from '@hello-pangea/dnd';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { moveTask, moveColumn, useGetBoard } from 'src/api/kanban';

import Scrollbar from 'src/components/scrollbar';
import EmptyContent from 'src/components/empty-content';

import TaskColumn from '../task-column';
import TaskColumnAdd from '../task-column-add';
import { TaskColumnSkeleton } from '../task-skeleton';

// ----------------------------------------------------------------------

export default function TaskView() {
  // Commented out as it might be causing the CORS issues
  // const { board1, boardLoading2, boardEmpty3 } = useGetBoard();
  
  const [board, setBoardData] = useState(null);
  const [boardLoading, setLoading] = useState(true);
  const [boardEmpty, setEmpty] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/board/data');
        if (!response.ok) {
          throw new Error('Failed to fetch board data');
        }
        const data = await response.json();
        console.log('Board data retrieved:', data);
        
        // Check if data has the required structure
        if (!data || !data.order || !data.order.columnIds) {
          console.error('Invalid board data format', data);
          setBoardData({
            order: { columnIds: [] },
            columns: {},
            tasks: {}
          });
          setEmpty(true);
        } else {
          setBoardData(data);
          setEmpty(false);
        }
      } catch (error) {
        console.error('Error fetching board data:', error);
        // Provide a default structure to prevent null errors
        setBoardData({
          order: { columnIds: [] },
          columns: {},
          tasks: {}
        });
        setEmpty(true);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoardData();
  }, []);

  const onDragEnd = useCallback(
    async ({ destination, source, draggableId, type }) => {
      try {
        // Safety check for null board
        if (!board || !board.columns || !board.order || !board.order.columnIds) {
          console.error('Board data is not properly structured for drag operations');
          return;
        }

        if (!destination) {
          return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
          return;
        }

        // Moving column
        if (type === 'COLUMN') {
          const newOrdered = [...board.order.columnIds];

          newOrdered.splice(source.index, 1);

          newOrdered.splice(destination.index, 0, draggableId);

          // Use local state update instead of API call if API is not working
          setBoardData(prevBoard => ({
            ...prevBoard,
            order: {
              ...prevBoard.order,
              columnIds: newOrdered
            }
          }));
          
          try {
            await moveColumn(newOrdered);
          } catch (error) {
            console.error('Failed to update column order on server', error);
          }
          return;
        }

        const sourceColumn = board.columns[source.droppableId];
        const destinationColumn = board.columns[destination.droppableId];

        if (!sourceColumn || !destinationColumn) {
          console.error('Source or destination column not found');
          return;
        }

        // Moving task to same list
        if (sourceColumn.id === destinationColumn.id) {
          const newTaskIds = [...sourceColumn.taskIds];

          newTaskIds.splice(source.index, 1);

          newTaskIds.splice(destination.index, 0, draggableId);

          // Update local state first
          const updatedColumns = {
            ...board.columns,
            [sourceColumn.id]: {
              ...sourceColumn,
              taskIds: newTaskIds,
            },
          };
          
          setBoardData(prevBoard => ({
            ...prevBoard,
            columns: updatedColumns
          }));
          
          try {
            await moveTask(updatedColumns);
          } catch (error) {
            console.error('Failed to update task order on server', error);
          }

          console.info('Moving to same list!');

          return;
        }

        // Moving task to different list
        const sourceTaskIds = [...sourceColumn.taskIds];
        const destinationTaskIds = [...destinationColumn.taskIds];

        // Remove from source
        sourceTaskIds.splice(source.index, 1);

        // Insert into destination
        destinationTaskIds.splice(destination.index, 0, draggableId);

        // Update local state first
        const updatedColumns = {
          ...board.columns,
          [sourceColumn.id]: {
            ...sourceColumn,
            taskIds: sourceTaskIds,
          },
          [destinationColumn.id]: {
            ...destinationColumn,
            taskIds: destinationTaskIds,
          },
        };
        
        setBoardData(prevBoard => ({
          ...prevBoard,
          columns: updatedColumns
        }));

        try {
          await moveTask(updatedColumns);
        } catch (error) {
          console.error('Failed to update tasks between columns on server', error);
        }

        console.info('Moving to different list!');
      } catch (error) {
        console.error('Error during drag operation:', error);
      }
    },
    [board]
  );

  const renderSkeleton = (
    <Stack direction="row" alignItems="flex-start" spacing={3}>
      {[...Array(4)].map((_, index) => (
        <TaskColumnSkeleton key={index} index={index} />
      ))}
    </Stack>
  );

  return (
    <Container
      maxWidth={false}
      sx={{
        height: 1,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Task List
      </Typography>

      {boardLoading && renderSkeleton}

      {boardEmpty && (
        <EmptyContent
          filled
          title="No Data"
          sx={{
            py: 10,
            maxHeight: { md: 480 },
          }}
        />
      )}

      {board && board.order && board.order.columnIds && board.order.columnIds.length > 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" type="COLUMN" direction="horizontal">
            {(provided) => (
              <Scrollbar
                sx={{
                  height: 1,
                  minHeight: {
                    xs: '80vh',
                    md: 'unset',
                  },
                }}
              >
                <Stack
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  spacing={3}
                  direction="row"
                  alignItems="flex-start"
                  sx={{
                    p: 0.25,
                    height: 1,
                  }}
                >
                  {board.order.columnIds.map((columnId, index) => (
                    <TaskColumn
                      index={index}
                      key={columnId}
                      column={board.columns[columnId]}
                      tasks={board.tasks}
                    />
                  ))}

                  {provided.placeholder}

                  <TaskColumnAdd />
                </Stack>
              </Scrollbar>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {error && !boardLoading && (
        <EmptyContent
          filled
          title="Error loading tasks"
          description="There was a problem loading the task board. Please try again later."
          sx={{
            py: 10,
            maxHeight: { md: 480 },
          }}
        />
      )}
    </Container>
  );
}
