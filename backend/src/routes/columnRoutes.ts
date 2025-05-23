import { Router } from 'express';
import {
  createColumn,
  getColumnsForProject,
  updateColumn,
  deleteColumn
} from '../controllers/columnController';
import taskRoutes from './taskRoutes'; // Import task routes

const router = Router({ mergeParams: true }); // For :projectId

// Column specific routes (already defined)
router.post('/', createColumn);
router.get('/', getColumnsForProject);
router.put('/:columnId', updateColumn);
router.delete('/:columnId', deleteColumn);

// Nested Task routes
// Path will be /api/projects/:projectId/columns/:columnId/tasks
router.use('/:columnId/tasks', taskRoutes);

export default router;
