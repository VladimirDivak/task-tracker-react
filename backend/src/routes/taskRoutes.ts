import { Router } from 'express';
import {
  createTask,
  getTasksForColumn,
  getTaskInColumn,
  updateTask,
  deleteTask
} from '../controllers/taskController';

// mergeParams: true allows access to :projectId and :columnId from parent routers
const router = Router({ mergeParams: true });

// Routes are relative to /api/projects/:projectId/columns/:columnId/tasks

router.post('/', createTask);
router.get('/', getTasksForColumn);
router.get('/:taskId', getTaskInColumn); // :taskId will be req.params.taskId
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

export default router;