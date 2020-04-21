const util = require('../lib/util');
const humps = require('humps');
module.exports = pgPool => {
  return {
    getLoaderUsersByIds(userIds) {
      const queryString = `select * from users where id = ANY($1)`;
      return pgPool.query(queryString, [userIds]).then(res => { 
        return util.orderedFor(res.rows, userIds, 'id', true); 
      });
    }, 

    getLoaderCategoryByIds(categoryIds) {
      const queryString = `select * from categories where id = ANY($1)`;
      return pgPool.query(queryString, [categoryIds]).then(res => { 
        return util.orderedFor(res.rows, categoryIds, 'id', true); 
      });
    },  

    getLoaderRecipesByIds(userIds) {
      const queryString = `select * from recipes where id = ANY($1)`;
      return pgPool.query(queryString, [userIds]).then(res => {
        return util.orderedFor(res.rows, userIds, 'id', true); 
      });
    }, 

    getLoaderHowtoByRecipeIds(recipeIds) {
      const queryString = `select * from recipe_howto where recipe_id = ANY($1)`;
      return pgPool.query(queryString, [recipeIds]).then(res => {  
        return util.orderedFor(res.rows, recipeIds, 'recipe_id', false); 
      });
    },
    getLoaderIngredientByRecipeIds(recipeIds) {
      const queryString = `SELECT b.recipe_id,b.amount,i.* FROM ingredients i
      INNER JOIN ingredient_bundle b ON i.id = b.ingredient_id where b.recipe_id = ANY($1)`;
      return pgPool.query(queryString, [recipeIds]).then(res => { 
        return util.orderedFor(res.rows, recipeIds, 'recipe_id', false); 
      });
    },

    getHowtoByRecipeId(recipeId) {
      const queryString = `select * from recipe_howto where recipe_id = $1`;
      return pgPool.query(queryString, [recipeId]).then(res => {  
        return humps.camelizeKeys(res.rows); 
      });
    },
    getIngredientByRecipeId(recipeId) {
      const queryString = `SELECT b.recipe_id,b.amount,i.* FROM ingredients i
      INNER JOIN ingredient_bundle b ON i.id = b.ingredient_id where b.recipe_id = $1`;
      return pgPool.query(queryString, [recipeId]).then(res => { 
        return humps.camelizeKeys(res.rows); 
      });
    },
    
  }
};