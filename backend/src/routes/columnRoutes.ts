import { Router } from 'express';
import {
  createColumn,
  getColumnsForProject,
  updateColumn,
  deleteColumn
} from '../controllers/columnController';
// import { protect } from '../middleware/authMiddleware'; // Not needed here as parent router (projectRoutes) will apply it

const router = Router({ mergeParams: true }); // Essential for accessing :projectId

// Note: 'protect' middleware is assumed to be applied in the parent router (projectRoutes.ts)
// If it weren't, you'd uncomment and use: router.use(protect);

router.post('/', createColumn);
router.get('/', getColumnsForProject);
router.put('/:columnId', updateColumn);
router.delete('/:columnId', deleteColumn);

export default router;
