import express from 'express';
import goals from './controllers/goals.controller';
import users from './controllers/users.controller';
import recipes from './controllers/recipes.controller';
import {isValidMongoId} from './middleware/isValidMongoId';
import protect from './middleware/authMiddleware';
const router = express.Router();

// Goals
router.get('/goals', protect, goals.getGoals);
router.post('/goals', protect, goals.createGoal);
router.put('/goals/:id', protect, isValidMongoId, goals.updateGoal);
router.delete('/goals/:id', protect, isValidMongoId, goals.deleteGoal);

// User
router.post('/users', users.registerUser);
router.post('/users/login', users.loginUser);
router.get('/users/me', protect, users.getMe);

// Recipe
router.get('/recipes/me', protect, recipes.getMyRecipes);
router.get('/recipes/:id?', isValidMongoId, recipes.getRecipes);
router.post('/recipes', protect, recipes.addRecipe);
router.put('/recipes/:id', protect, isValidMongoId, recipes.updateRecipe);
router.delete('/recipes/:id', protect, isValidMongoId, recipes.deleteRecipe);

export default router;
