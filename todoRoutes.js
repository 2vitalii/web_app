import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

/**
 * @route   GET /todos
 * @desc    Get all todos for the authenticated user
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: req.userId }
    });
    res.json(todos);
  } catch (error) {
    console.error('Fetch todos error:', error);
    res.sendStatus(503);
  }
});

/**
 * @route   POST /todos
 * @desc    Create a new todo for the authenticated user
 * @access  Private
 */
router.post('/', async (req, res) => {
  const { task } = req.body;

  try {
    const newTodo = await prisma.todo.create({
      data: {
        task,
        userId: req.userId
      }
    });
    res.json(newTodo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.sendStatus(503);
  }
});

/**
 * @route   PUT /todos/:id
 * @desc    Mark a todo as completed or not
 * @access  Private
 */
router.put('/:id', async (req, res) => {
  const todoId = Number(req.params.id);
  const { completed } = req.body;

  try {
    const updated = await prisma.todo.update({
      where: {
        id_userId: { id: todoId, userId: req.userId }
      },
      data: {
        completed: Boolean(completed)
      }
    });
    res.json(updated);
  } catch (error) {
    console.error('Update todo error:', error);
    res.sendStatus(503);
  }
});

/**
 * @route   DELETE /todos/:id
 * @desc    Delete a todo by ID for the authenticated user
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  const todoId = Number(req.params.id);

  try {
    await prisma.todo.delete({
      where: {
        id_userId: { id: todoId, userId: req.userId }
      }
    });
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.sendStatus(503);
  }
});

export default router;
