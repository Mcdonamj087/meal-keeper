import {Schema, model} from 'mongoose';
import {IRecipe} from '../typings/recipe.types';

const recipeSchema = new Schema<IRecipe>(
  {
    title: {type: String, required: true},
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    prepTime: Number,
    cookTime: Number,
    servings: [Number, Number],
    about: String,
    ingredients: [String],
    // weightSystem: {type: String, enum: ['imperial', 'metric']},
    directions: [String],
    notes: String,
    cuisine: [String],
    dietaryTypes: [String],
    meal: String,
  },
  {
    timestamps: true, // creates updatedAt and createdAt fields
  }
);

export default model<IRecipe>('Recipe', recipeSchema);
