import axios from 'axios';

const API_URL = '/api/projects/'; // Ensure this matches your backend routes

interface IProjectData {
  name: string;
}

// Create new project
const createProject = async (projectData: IProjectData) => {
  const response = await axios.post(API_URL, projectData);
  return response.data;
};

// Get user projects
const getProjects = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const projectService = {
  createProject,
  getProjects,
};

export default projectService;
