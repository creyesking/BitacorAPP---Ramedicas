import { checkRole } from './../middlewares/role';
import { checkJwt } from './../middlewares/jwt';
import { TaskController } from './../controller/TaskController';
import { Router } from 'express';

const router = Router();

// Get all tasks
router.get('/', TaskController.getAll);

// Get one tasks
router.get('/:userId', TaskController.getByUserId);


// router.get('/task/:id', TaskController.getById);

// Create a new tasks
router.post('/', [checkJwt], TaskController.new);

// Edit tasks
router.patch('/:id', TaskController.edit);

// Delete
router.delete('/:id', TaskController.delete);

export default router;

// [checkJwt, checkRole(['suscriptor'])]
