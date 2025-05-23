import { Router } from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../controllers/projectController';
import { protect } from '../middleware/authMiddleware';
import columnRoutes from './columnRoutes'; // Import column routes

const router = Router();

router.use(protect); // Apply protect middleware to all project routes and sub-routes

// Project specific routes
// @route   POST api/projects
// @desc    Create a new project
// @access  Private (due to 'protect' middleware)
router.post('/', createProject);

// @route   GET api/projects
// @desc    Get all projects for the logged-in user
// @access  Private
router.get('/', getProjects);

// @route   GET api/projects/:id
// @desc    Get a single project by ID
// @access  Private
router.get('/:id', getProjectById); // This :id is projectId

// @route   PUT api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', updateProject);   // This :id is projectId

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', deleteProject); // This :id is projectId

// Nested Column routes
// When a request comes for /api/projects/:projectId/columns, it will be handled by columnRoutes
router.use('/:projectId/columns', columnRoutes); // Use columnRoutes for nested paths

export default router;
