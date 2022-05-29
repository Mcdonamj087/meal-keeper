import {Response} from 'express';
import asyncHandler from 'express-async-handler';
import {HydratedDocument} from 'mongoose';
import {AuthBody} from '../middleware/authMiddleware';

import Goal, {IGoal} from '../models/goals.model';

import {
  TypedRequest,
  TypedRequestBody,
  TypedRequestParams,
} from '../typings/express.types';

/**
 * @desc    Get goals
 * @route   GET /api/goals
 * @access  Private
 */
const getGoals = asyncHandler(
  async (req: TypedRequestBody<AuthBody>, res: Response) => {
    const goals = await Goal.find({user: req.body.user});
    res.status(200).json(goals);
  }
);

/**
 * @desc    Create goal
 * @route   POST /api/goals
 * @access  Private
 */
const createGoal = asyncHandler(
  async (req: TypedRequestBody<AuthBody & {text: string}>, res: Response) => {
    if (!req.body.text) {
      throw new Error('Please provide a "text" field');
    }
    const goal: HydratedDocument<IGoal> = await Goal.create({
      user: req.body.user.id,
      text: req.body.text,
    });

    res.status(201).json(goal);
  }
);

/**
 * @desc    Update goal
 * @route   PUT /api/goals/:id
 * @access  Private
 */
const updateGoal = asyncHandler(
  async (req: TypedRequest<{id: string}, AuthBody>, res: Response) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      res.status(400);
      throw new Error('Goal not found');
    }

    // Check if auth user's ID matches the goal's user id
    if (!!goal && goal.user.toString() !== req.body.user.id) {
      res.status(401);
      throw new Error('User not authorized to update this goal');
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedGoal);
  }
);

/**
 * @desc    Delete goal
 * @route   DELETE /api/goals/:id
 * @access  Private
 */
const deleteGoal = asyncHandler(
  async (req: TypedRequestParams<{id: string}>, res: Response) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      res.status(400);
      throw new Error('Goal not found');
    }

    // Check if auth user's ID matches the goal's user id
    if (!!goal && goal.user.toString() !== req.body.user.id) {
      res.status(401);
      throw new Error('User not authorized to delete this goal');
    }

    await goal.delete();
    res.status(200).json({id: req.params.id});
  }
);

export default {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
};
