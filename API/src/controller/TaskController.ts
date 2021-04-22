import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { Task } from '../entity/Task';

import { validate } from 'class-validator';

export class TaskController {
  static getAll = async (req: Request, res: Response) => {
    const taskRepository = getRepository(Task);

    let tasks;

    try {
      tasks = await taskRepository.find({
        select: [
          'id',
          'description',
          'time',
          'userId',
          'createdAt',
          'updatedAt',
        ],
      });
    } catch (e) {
      res.status(404).json({ message: 'Somenthing goes wrong!' });
    }

    if (tasks.length > 0) {
      res.send(tasks);
    } else {
      res.status(404).json({ message: 'Not result' });
    }
  }

  static getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const taskRepository = getRepository(Task);
    try {
      const task = await taskRepository.findOneOrFail(id);
      res.send(task);
    } catch (e) {
      res.status(404).json({ message: 'Not result' });
    }
  }

  static getByUserId = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const taskRepository = getRepository(Task);
    let tasks: any;
    try {
      tasks = await taskRepository.find({
        select: [
          'id',
          'description',
          'time',
          'userId',
          'createdAt',
          'updatedAt',
        ],
        where: { userId },
      });
      res.send(tasks);
    } catch (e) {
      res.status(404).json({ message: 'Not result' });
    }
  }

  static new = async (req: Request, res: Response) => {
    const { description, time, userId } = req.body;
    const task = new Task();

    task.description = description;
    task.time = time;
    task.userId = userId;

    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(task, validationOpt);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const taskRepository = getRepository(Task);

    let taskInstance;
    try {
      taskInstance = taskRepository.create(task);
      await taskRepository.save(taskInstance);
    } catch (e) {
      return res.status(409).json({ message: 'taskname already exist' });
    }
    res.send(taskInstance);
  }

  static edit = async (req: Request, res: Response) => {
    let task: any;
    const { id } = req.params;
    const { description, time, userId } = req.body;

    const taskRepository = getRepository(Task);

    // Try get task
    try {
      task = await taskRepository.findOneOrFail(id);
      task.description = description;
      task.time = time;
      task.userId = userId;
    } catch (e) {
      return res.status(404).json({ message: 'task not found' });
    }

    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(task, validationOpt);

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    // Try to save task
    try {
      await taskRepository.save(task);
    } catch (e) {
      return res.status(409).json({ message: 'taskname already in use' });
    }

    res.status(201).json({ message: 'task update' });
  }

  static delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const taskRepository = getRepository(Task);
    let taskRequest: Task;

    try {
      taskRequest = await taskRepository.findOneOrFail(id);
    } catch (e) {
      return res.status(404).json({ message: 'task not found' });
    }

    // Remove task
    taskRepository.delete(id);
    res.status(201).json({ message: ' task deleted' });
  }
}

export default TaskController;
