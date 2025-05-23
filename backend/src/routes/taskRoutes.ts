import express, { Router, RequestHandler } from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/taskController';

const router: Router = express.Router();

// Task routes
router.get('/', getTasks as RequestHandler);
router.get('/:id', getTask as RequestHandler);
router.post('/', createTask as RequestHandler);
router.put('/:id', updateTask as RequestHandler);
router.delete('/:id', deleteTask as RequestHandler);

export default router; 