import express from 'express';
import goals from './controllers/goals.controller';
import auth from './controllers/auth.controller';
import recipes from './controllers/recipes.controller';
import refreshToken from './controllers/refreshToken.controller';
import {isValidMongoId} from './middleware/isValidMongoId';
import verify from './middleware/verifyAuthToken';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('hello');
});
// Goals
router.get('/goals', verify, goals.getGoals);
router.post('/goals', verify, goals.createGoal);
router.put('/goals/:id', verify, isValidMongoId, goals.updateGoal);
router.delete('/goals/:id', verify, isValidMongoId, goals.deleteGoal);

// User Authentication
router.post('/auth', auth.register);
router.post('/auth/login', auth.login);
router.get('/auth/logout', auth.logout);
router.get('/auth/me', verify, auth.getMe);

// Refresh Token
router.get('/refresh', refreshToken.getNewRefreshToken);

// Recipe
router.get('/recipes/me', verify, recipes.getMyRecipes);
router.get('/recipes/:id?', isValidMongoId, recipes.getRecipes);
router.post('/recipes', verify, recipes.addRecipe);
router.put('/recipes/:id', verify, isValidMongoId, recipes.updateRecipe);
router.delete('/recipes/:id', verify, isValidMongoId, recipes.deleteRecipe);

export default router;
