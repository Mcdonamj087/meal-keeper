import {ObjectId} from 'mongoose';

export type UnitOfMeasure =
  | 'teaspoon'
  | 'tablespoon'
  | 'fluid ounce'
  | 'gill'
  | 'cup'
  | 'pint'
  | 'quart'
  | 'gallon'
  | 'milliliter'
  | 'liter'
  | 'deciliter'
  | 'pound'
  | 'ounce'
  | 'milligram'
  | 'gram'
  | 'kilogram'
  | 'pinch'
  | 'inch';

export type Cuisine =
  | 'african'
  | 'american'
  | 'asian'
  | 'chinese'
  | 'french'
  | 'japanese'
  | 'mexican'
  | 'middle eastern'
  | 'persian';

export type DietType =
  | 'vegetarian'
  | 'vegan'
  | 'gluten free'
  | 'paleo'
  | 'keto'
  | 'sugar conscious';

export type MealType =
  | 'appetizer'
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'dessert'
  | 'snacks';

// export interface Ingredient {
//   ingredient: string;
//   amount: number;
//   unit: UnitOfMeasure;
// }

export interface IRecipe {
  title: string;
  image?: string;
  user: ObjectId | string;
  prepTime?: number; // Seconds
  cookTime?: number; // Seconds
  servings?: [number, number?]; // Min / Max
  about?: string;
  ingredients?: Array<string>;
  directions?: Array<string>;
  notes?: string;
  cuisine?: Array<Cuisine>;
  dietaryTypes?: Array<DietType>;
  meal?: MealType;
  createdAt: string;
  updatedAt: string;
}
