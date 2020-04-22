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
        return util.orderedFor(res.rows, categoryIds, 'id', false); 
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

    getRecipes(recipeId) {
      console.log(recipeId); 
      const queryString = `select * from recipes limit 1`; // where recipe_id = $1
      return pgPool.query(queryString).then(res => {  
        return humps.camelizeKeys(res.rows); 
      });
    },

    getHowtoByRecipeId(recipeId) {
      const queryString = `select * from recipe_howto where recipe_id = $1`;
      return pgPool.query(queryString, [recipeId]).then(res => {  
        return humps.camelizeKeys(res.rows); 
      });
    },
    getIngredientByRecipeId(recipeId) {
  /*     const queryString = `SELECT i.id,b.recipe_id,i.id as ingredientId,
            i.slug,i.title,b.amount,i.description,i.image 
            FROM ingredients i
            INNER JOIN ingredient_bundle b ON i.id = b.ingredient_id where b.recipe_id = $1`;
 */
             const queryString = `SELECT concat(recipe_id,id) as id,b.recipe_id,i.id as ingredientId,
            i.slug,i.title,b.amount,i.description,i.image 
            FROM ingredients i
            INNER JOIN ingredient_bundle b ON i.id = b.ingredient_id where b.recipe_id = $1`;  
      return pgPool.query(queryString, [recipeId]).then(res => { 
        console.log('-----------getIngredientByRecipeId -------------'); 
    console.log(res.rows);
        return humps.camelizeKeys(res.rows); 
      });
    },
    searchRecipes(searchKeys){
       let searchCondition=[];
       let queryString ='';
       let searchKey ='';

      if (searchKeys.recipeTitle){
        searchCondition = [searchKeys.recipeTitle];
        searchKey = {"type": "recipeTitle", "key":searchKeys.recipeTitle };
        queryString = `select * from recipes where title = $1`;
      }else if (searchKeys.categoryTitle){
        searchCondition = [searchKeys.categoryTitle];
        searchKey = {"type": "categoryTitle", "key":searchKeys.categoryTitle };
        queryString = `SELECT r.* from recipes r
                      inner join categories ca on r.category_id = ca.id 
                      where ca.title =$1`;
      }else if (searchKeys.IngredientTitle){
        searchCondition = [searchKeys.IngredientTitle];
        searchKey = {"type": "IngredientTitle", "key":searchKeys.IngredientTitle };
        queryString = `SELECT r.* from ingredients i
                      inner join ingredient_bundle b on b.ingredient_id = i.id
                      inner join recipes r on b.recipe_id = r.id
                      where i.title =$1`;
      }else{
         queryString = `select * from recipes`;
      }
      
      console.log(queryString);
      
      return pgPool.query(queryString, searchCondition).then(res => { 
        let resVal = {}; 
        resVal.rowCount = res.rowCount;
        resVal.searchKey = searchKey;
        resVal.rows = humps.camelizeKeys(res.rows);  
        return resVal
      });
    }
    
  }
};