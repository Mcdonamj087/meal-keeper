import {Response} from 'express';
import asyncHandler from 'express-async-handler';
import {HydratedDocument} from 'mongoose';
import {AuthBody} from '../middleware/verifyAuthToken';

import Recipe from '../models/recipe.model';
import {IRecipe} from '../typings/recipe.types';

import {
  TypedRequest,
  TypedRequestBody,
  TypedRequestParams,
} from '../typings/express.types';

/**
 * @desc    Get a single recipe by id or get all recipes
 * @route   GET /api/recipes/:id
 * @access  Public
 */
const getRecipes = asyncHandler(
  async (req: TypedRequestParams<{id: string}>, res: Response) => {
    if (req.params.id) {
      const recipe = await Recipe.findById(req.params.id);

      if (!recipe) {
        res.status(400);
        throw new Error('Recipe not found');
      }

      res.status(200).json(recipe);
    }

    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  }
);

/**
 * @desc    Get the active user's single recipe by id or get all recipes
 * @route   GET /api/recipe/me
 * @access  Public
 */
const getMyRecipes = asyncHandler(
  async (req: TypedRequestBody<AuthBody>, res: Response) => {
    const recipes = await Recipe.find({user: req.body.user.id});
    res.status(200).json(recipes);
  }
);

/**
 * @desc    Create recipe
 * @route   POST /api/recipes
 * @access  Private
 */
const addRecipe = asyncHandler(
  async (req: TypedRequestBody<AuthBody & IRecipe>, res: Response) => {
    if (!req.body.title) {
      res.status(400);
      throw new Error('Please provide a "title"');
    }

    const recipeObj: Omit<IRecipe, 'createdAt' | 'updatedAt'> = {
      ...req.body,
      title: req.body.title,
      user: req.body.user.id!, // Asserting that user will be part of body since if the verifyAuthToken middleware fails, this code will never run
    };

    const recipe: HydratedDocument<IRecipe> = await Recipe.create(recipeObj);

    res.status(201).json(recipe);
  }
);

/**
 * @desc    Update recipe
 * @route   PUT /api/recipes/:id
 * @access  Private
 */
const updateRecipe = asyncHandler(
  async (
    req: TypedRequest<{id: string}, AuthBody & IRecipe>,
    res: Response
  ) => {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      res.status(400);
      throw new Error('Recipe not found');
    }

    // Check if auth user's ID matches the recipe's user id
    if (!!recipe && recipe.user.toString() !== req.body.user.id) {
      res.status(401);
      throw new Error('User not authorized to update this recipe');
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updatedRecipe);
  }
);

/**
 * @desc    Delete recipe
 * @route   DELETE /api/recipes/:id
 * @access  Private
 */
const deleteRecipe = asyncHandler(
  async (req: TypedRequestParams<{id: string}>, res: Response) => {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      res.status(400);
      throw new Error('Recipe not found');
    }

    // Check if auth user's ID matches the recipe's user id
    if (!!recipe && recipe.user.toString() !== req.body.user.id) {
      res.status(401);
      throw new Error('User not authorized to delete this recipe');
    }

    await recipe.delete();
    res.status(200).json({id: req.params.id});
  }
);

export default {
  getRecipes,
  getMyRecipes,
  addRecipe,
  updateRecipe,
  deleteRecipe,
};
