import useSWR, { mutate } from 'swr';
import { useMemo, useState, useEffect } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

// Change the URL to use the local endpoint to avoid CORS issues
const URL = 'http://localhost:3000/api/board/data';

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetBoard() {
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  const memoizedValue = useMemo(
    () => {
      // Add safety checks to prevent null property access
      const boardData = data || { order: { columnIds: [] }, columns: {}, tasks: {} };
      
      return {
        board: boardData,
        boardLoading: isLoading,
        boardError: error,
        boardValidating: isValidating,
        boardEmpty: !isLoading && (!boardData.order || !boardData.order.columnIds || boardData.order.columnIds.length === 0),
      };
    },
    [data, error, isLoading, isValidating]
  );
  
  return memoizedValue;
}

export function useFetchBoardData() {
  const [boardData, setBoardData] = useState(null);
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/board/data');
        if (!response.ok) {
          throw new Error('Failed to fetch board data');
        }
        const data = await response.json();
        setBoardData(data);
        setLoading(false); // Set loading to false after data is fetched
        setError(null);
      } catch (error) {
        console.error('Error fetching board data:', error);
        // Provide a default structure
        setBoardData({
          order: { columnIds: [] },
          columns: {},
          tasks: {}
        });
        setLoading(false); // Set loading to false in case of error
        setError(error);
      }
    };

    fetchBoardData();
  }, []);

  return { boardData, loading, error };
}

// ----------------------------------------------------------------------

export async function createColumn(columnData) {
  try {
    // Try to use local API first
    const response = await fetch('http://localhost:3000/api/board/create-column', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ columnData }),
    });

    if (!response.ok) {
      throw new Error('Failed to create column on server');
    }

    // If server request succeeds, update the local cache
    mutate(URL);
    return await response.json();
  } catch (error) {
    console.error('Error creating column:', error);
    
    // Fallback to local state mutation if API fails
    mutate(
      URL,
      (currentData) => {
        if (!currentData || !currentData.order || !currentData.columns) {
          console.error('Invalid board data for mutation');
          return currentData;
        }

        const columns = {
          ...currentData.columns,
          // add new column in board.columns
          [columnData.id]: columnData,
        };

        // add new column in board.ordered
        const columnIds = [...(currentData.order.columnIds || []), columnData.id];

        return {
          ...currentData,
          order: {
            ...currentData.order,
            columnIds,
          },
          columns,
        };
      },
      false
    );
  }
}

// ----------------------------------------------------------------------

export async function updateColumn(columnId, columnName) {
  try {
    // Try to use local API first
    const response = await fetch('http://localhost:3000/api/board/update-column', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ columnId, columnName }),
    });

    if (!response.ok) {
      throw new Error('Failed to update column on server');
    }

    // If server request succeeds, update the local cache
    mutate(URL);
    return await response.json();
  } catch (error) {
    console.error('Error updating column:', error);
    
    // Fallback to local state mutation if API fails
    mutate(
      URL,
      (currentData) => {
        if (!currentData || !currentData.columns) {
          console.error('Invalid board data for mutation');
          return currentData;
        }

        // current column
        const column = currentData.columns[columnId];
        if (!column) {
          console.error('Column not found:', columnId);
          return currentData;
        }

        const columns = {
          ...currentData.columns,
          // update column in board.columns
          [column.id]: {
            ...column,
            name: columnName,
          },
        };

        return {
          ...currentData,
          columns,
        };
      },
      false
    );
  }
}

// ----------------------------------------------------------------------

export async function moveColumn(newOrdered) {
  try {
    // Try to use local API first
    const response = await fetch('http://localhost:3000/api/board/move-column', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newOrdered }),
    });

    if (!response.ok) {
      throw new Error('Failed to move column on server');
    }

    // If server request succeeds, update the local cache
    mutate(URL);
    return await response.json();
  } catch (error) {
    console.error('Error moving column:', error);
    
    // Fallback to local state mutation if API fails
    mutate(
      URL,
      (currentData) => {
        if (!currentData || !currentData.order) {
          console.error('Invalid board data for mutation');
          return currentData;
        }

        return {
          ...currentData,
          order: {
            ...currentData.order,
            columnIds: newOrdered,
          },
        };
      },
      false
    );
  }
}

// ----------------------------------------------------------------------

export async function clearColumn(columnId) {
  /**
   * Work on server
   */
  // const data = { columnId };
  // await axios.post(endpoints.kanban, data, { params: { endpoint: 'clear-column' } });

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData) => {
      const { board } = currentData;

      const { tasks } = board;

      // current column
      const column = board.columns[columnId];

      // delete tasks in board.tasks
      column.taskIds.forEach((key) => {
        delete tasks[key];
      });

      const columns = {
        ...board.columns,
        [column.id]: {
          ...column,
          // delete task in column
          taskIds: [],
        },
      };

      return {
        ...currentData,
        board: {
          ...board,
          columns,
          tasks,
        },
      };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function deleteColumn(columnId) {
  /**
   * Work on server
   */
  // const data = { columnId };
  // await axios.post(endpoints.kanban, data, { params: { endpoint: 'delete-column' } });

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData) => {
      const { board } = currentData;

      const { columns, tasks } = board;

      // current column
      const column = columns[columnId];

      // delete column in board.columns
      delete columns[columnId];

      // delete tasks in board.tasks
      column.taskIds.forEach((key) => {
        delete tasks[key];
      });

      // delete column in board.ordered
      const ordered = board.order.columnIds.filter((id) => id !== columnId);

      return {
        ...currentData,
        board: {
          ...board,
          columns,
          tasks,
          order: {
            ...board.order,
            columnIds: ordered,
          },
        },
      };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function createTask(columnId, taskData) {
  /**
   * Work on server
   */
  // const data = { columnId, taskData };
  // await axios.post(endpoints.kanban, data, { params: { endpoint: 'create-task' } });

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData) => {
      const { board } = currentData;

      // current column
      const column = board.columns[columnId];

      const columns = {
        ...board.columns,
        [columnId]: {
          ...column,
          // add task in column
          taskIds: [...column.taskIds, taskData.id],
        },
      };

      // add task in board.tasks
      const tasks = {
        ...board.tasks,
        [taskData.id]: taskData,
      };

      return {
        ...currentData,
        board: {
          ...board,
          columns,
          tasks,
        },
      };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function updateTask(taskData) {
  /**
   * Work on server
   */
  // const data = { taskData };
  // await axios.post(endpoints.kanban, data, { params: { endpoint: 'update-task' } });

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData) => {
      const { board } = currentData;

      const tasks = {
        ...board.tasks,
        // add task in board.tasks
        [taskData.id]: taskData,
      };

      return {
        ...currentData,
        board: {
          ...board,
          tasks,
        },
      };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function moveTask(updateColumns) {
  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData) => {
      const { board } = currentData;

      // update board.columns
      const columns = updateColumns;

      return {
        ...currentData,
        board: {
          ...board,
          columns,
        },
      };
    },
    false
  );

  /**
   * Work on server
   */
  // const data = { updateColumns };
  // await axios.post(endpoints.kanban, data, { params: { endpoint: 'move-task' } });
}

// ----------------------------------------------------------------------

export async function deleteTask(columnId, taskId) {
  /**
   * Work on server
   */
  // const data = { columnId, taskId };
  // await axios.post(endpoints.kanban, data, { params: { endpoint: 'delete-task' } });

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData) => {
      const { board } = currentData;

      const { tasks } = board;

      // current column
      const column = board.columns[columnId];

      const columns = {
        ...board.columns,
        [column.id]: {
          ...column,
          // delete tasks in column
          taskIds: column.taskIds.filter((id) => id !== taskId),
        },
      };

      // delete tasks in board.tasks
      delete tasks[taskId];

      return {
        ...currentData,
        board: {
          ...board,
          columns,
          tasks,
        },
      };
    },
    false
  );
}
