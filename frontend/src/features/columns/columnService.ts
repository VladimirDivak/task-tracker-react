import axios from 'axios';

const API_BASE_URL = '/api/projects/'; // Base URL for projects

export interface IColumnCreateData {
  name: string;
}

export interface IColumnUpdateData {
  name: string;
  // Potentially order if you implement reordering
}

// Create new column
const createColumn = async (projectId: string, columnData: IColumnCreateData) => {
  const response = await axios.post(`${API_BASE_URL}${projectId}/columns`, columnData);
  return response.data;
};

// Get columns for a specific project
const getColumnsForProject = async (projectId: string) => {
  const response = await axios.get(`${API_BASE_URL}${projectId}/columns`);
  return response.data;
};

// Update a column
const updateColumn = async (projectId: string, columnId: string, columnData: IColumnUpdateData) => {
  const response = await axios.put(`${API_BASE_URL}${projectId}/columns/${columnId}`, columnData);
  return response.data;
};

// Delete a column
const deleteColumn = async (projectId: string, columnId: string) => {
  const response = await axios.delete(`${API_BASE_URL}${projectId}/columns/${columnId}`);
  // Typically, delete operations might return a success message or the ID of the deleted item
  // Or sometimes a 204 No Content response, ensure backend consistency.
  // For this example, let's assume it returns some data or a success message.
  return response.data; 
};

const columnService = {
  createColumn,
  getColumnsForProject,
  updateColumn,
  deleteColumn,
};

export default columnService;
