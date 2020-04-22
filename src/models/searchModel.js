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
      const queryString = `SELECT concat(recipe_id,id) as id,b.recipe_id,i.id as ingredientId,
        i.slug,i.title,b.amount,i.description,i.image 
        FROM ingredients i
        INNER JOIN ingredient_bundle b ON i.id = b.ingredient_id where b.recipe_id = $1`;  
      return pgPool.query(queryString, [recipeId]).then(res => { 
        return humps.camelizeKeys(res.rows); 
      });
    },
    searchRecipes(searchKeys){
       let searchCondition=[];
       let queryString ='';
       let searchKey ='';
       
       if (searchKeys.recipeId > 0){ 
        searchCondition = [searchKeys.recipeId];
        searchKey = {"type": "recipeId", "key":searchKeys.recipeId };
        queryString = `select * from recipes where id=$1`;
      } else if (searchKeys.username){
        searchCondition = [searchKeys.username];
        searchKey = {"type": "username", "key":searchKeys.username };
        queryString = `SELECT r.* from recipes r
          inner join users u on r.user_id = u.id
          where  u.username = $1 and u.approved = 'appoved'`;  
      } else if (searchKeys.recipeSlug){
        searchCondition = [searchKeys.recipeSlug];
        searchKey = {"type": "recipeSlug", "key":searchKeys.recipeSlug };
        queryString = `select * from recipes where slug = $1`;
      } else if (searchKeys.categorySlug){
        searchCondition = [searchKeys.categorySlug];
        searchKey = {"type": "categorySlug", "key":searchKeys.categorySlug };
        queryString = `SELECT r.* from recipes r
          inner join categories ca on r.category_id = ca.id 
          where ca.slug =$1`;
      }else if (searchKeys.IngredientSlug){
        searchCondition = [searchKeys.IngredientSlug];
        searchKey = {"type": "IngredientSlug", "key":searchKeys.IngredientSlug };
        queryString = `SELECT r.* from ingredients i
          inner join ingredient_bundle b on b.ingredient_id = i.id
          inner join recipes r on b.recipe_id = r.id
          where i.slug =$1`;
      } else {
         queryString = `select * from recipes`;
         searchKey = {"type": "none", "key":"all" };
      }
        
      return pgPool.query(queryString, searchCondition).then(res => { 
        let resVal = {}; 
        resVal.rowCount = res.rowCount;
        resVal.searchKey = searchKey;
        resVal.rows = humps.camelizeKeys(res.rows);  
        return resVal
      });
    },
    searchCategories(searchKeys){
      let searchCondition=[];
      let queryString ='';
      let searchKey ='';
      if (searchKeys.categoryId > 0){
        searchCondition = [searchKeys.categoryId];
        searchKey = {"type": "categoryId", "key":searchKeys.categoryId };
        queryString = `select * from categories where id=$1`;
      } else if (searchKeys.categorySlug){
        searchCondition = [searchKeys.categorySlug];
        searchKey = {"type": "categorySlug", "key":searchKeys.categorySlug };
        queryString = `select * from categories where slug = $1`;
      } else if (searchKeys.username){
        searchCondition = [searchKeys.username];
        searchKey = {"type": "username", "key":searchKeys.username };
        queryString = `SELECT ca.* from categories ca
          inner join users u on ca.user_id = u.id
          where  u.username = $1 and u.approved = 'appoved'`;  
      } else {
        queryString = `select * from categories`;
        searchKey = {"type": "none", "key":"all" };
      }
 

      return pgPool.query(queryString, searchCondition).then(res => { 
        let resVal = {}; 
        resVal.rowCount = res.rowCount;
        resVal.searchKey = searchKey;
        resVal.rows = humps.camelizeKeys(res.rows);  
        return resVal
      });

    },
    searchIngredients(searchKeys){
      let searchCondition=[];
      let queryString ='';
      let searchKey ='';
      if (searchKeys.ingredientId > 0){
        searchCondition = [searchKeys.ingredientId];
        searchKey = {"type": "ingredientId", "key":searchKeys.ingredientId };
        queryString = `select * from ingredients where id=$1`;
      } else if (searchKeys.ingredientSlug){
        searchCondition = [searchKeys.ingredientSlug];
        searchKey = {"type": "ingredientSlug", "key":searchKeys.ingredientSlug };
        queryString = `select * from ingredients where slug = $1`;
      } else if (searchKeys.username){
        searchCondition = [searchKeys.username];
        searchKey = {"type": "username", "key":searchKeys.username };
        queryString = `SELECT r.* from ingredients i
          inner join users u on i.user_id = u.id
          where  u.username = $1 and u.approved = 'appoved'`;  
      } else {
        queryString = `select * from categories`;
        searchKey = {"type": "none", "key":"all" };
      }
      
      return pgPool.query(queryString, searchCondition).then(res => { 
        let resVal = {}; 
        resVal.rowCount = res.rowCount;
        resVal.searchKey = searchKey;
        resVal.rows = humps.camelizeKeys(res.rows);  
        return resVal
      });
      
    },
  }
};