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
    async searchRecipes(inputSearch){ 
      let queryString ='';  let queryCountString = '';
      let pagination = util.getPageLimitText(inputSearch.getpage,inputSearch.limit);
      let pageLimit = " LIMIT "+pagination.limit+" OFFSET "+pagination.offset;
      let resSearchOption = inputSearch; 
      let searchCondition = [inputSearch.searchKey];

      switch(inputSearch.searchOption){
      case "recipeId" : 
        if (inputSearch.searchKey > 0){  
          queryCountString = `select count(*) as totalrows from recipes where id=$1`;
          queryString = `select * from recipes where id=$1 order by id asc `+pageLimit;
        }else{
          searchCondition = [];
          resSearchOption.searchOption = 'Non';
          resSearchOption.searchKey = 'Non';
          queryCountString = `select count(*) as totalrows from recipes`;
          queryString = `select * from recipes order by id asc `+pageLimit;
        }
      break;
      case "username" : 
        queryCountString = `select count(*) as totalrows from recipes r
          inner join users u on r.user_id = u.id
          where  u.username = $1 and u.approved = 'approved'`; 
        queryString = `SELECT r.* from recipes r
          inner join users u on r.user_id = u.id
          where  u.username = $1 and u.approved = 'approved' order by r.id asc `+pageLimit; 
      break;
      case "recipeSlug" : 
        queryCountString = `select count(*) as totalrows from recipes where slug = $1`;
        queryString = `select * from recipes where slug = $1 order by id asc `+pageLimit;
      break;
      case "categorySlug" : 
        queryCountString = `select count(*) as totalrows from recipes r
          inner join categories ca on r.category_id = ca.id 
          where ca.slug =$1`;
        queryString = `SELECT r.* from recipes r
          inner join categories ca on r.category_id = ca.id 
          where ca.slug =$1 order by r.id asc `+pageLimit;
      break;
      case "IngredientSlug" : 
        queryCountString = `select count(*) as totalrows from ingredients i
          inner join ingredient_bundle b on b.ingredient_id = i.id
          inner join recipes r on b.recipe_id = r.id
          where i.slug =$1`;
        queryString = `SELECT r.* from ingredients i
          inner join ingredient_bundle b on b.ingredient_id = i.id
          inner join recipes r on b.recipe_id = r.id
          where i.slug =$1  order by r.id asc `+pageLimit;
      break;
      default: 
        searchCondition = [];
        resSearchOption.searchOption = 'Non';
        resSearchOption.searchKey = 'Non';
        queryString = `select * from recipes  order by id asc `+pageLimit;
      break;
      } 
      console.log(queryString);
       
      let resCount = await pgPool.query(queryCountString, searchCondition);
      console.log(resCount.rows[0].totalrows); 
      let data = await pgPool.query(queryString, searchCondition); 

      let resVal = {};
      resVal.rowCount = resCount.rows[0].totalrows;
      resVal.totalPage = Math.ceil(resCount.rows[0].totalrows/pagination.limit); 
      resVal.searchKey = resSearchOption;
      resVal.rows = humps.camelizeKeys(data.rows);  
      //console.log(resVal);
      
      return resVal
    },
    async searchCategories(inputSearch){ 
      let queryString ='';  let queryCountString = '';
      let pagination = util.getPageLimitText(inputSearch.page,inputSearch.limit);
      let pageLimit = " LIMIT "+pagination.limit+" OFFSET "+pagination.offset;
      let resSearchOption = inputSearch; 
      let searchCondition = [inputSearch.searchKey]; 

      switch(inputSearch.searchOption){
      case "categoryId" : 
        if (inputSearch.searchKey > 0){  
          queryCountString = `select count(*) as totalrows from categories where slug = $1`;
          queryString = queryString = `select * from categories where slug = $1 order by id asc `+pageLimit;
        }else{
          searchCondition = [];
          resSearchOption.searchOption = 'Non';
          resSearchOption.searchKey = 'Non';
          queryCountString = `select count(*) as totalrows from categories`;
          queryString = `select * from categories order by id asc `+pageLimit;
        }
      break;
      case "categorySlug" :  
        queryCountString = `select count(*) as totalrows from categories where slug = $1`;
        queryString = queryString = `select * from categories where slug = $1 order by r.id asc `+pageLimit; 
      break;
      case "username" :  
        queryCountString = `select count(*) as totalrows from categories ca
          inner join users u on ca.user_id = u.id
          where  u.username = $1 and u.approved = 'approved' `;
        queryString = `SELECT ca.* from categories ca
          inner join users u on ca.user_id = u.id
          where  u.username = $1 and u.approved = 'approved'  order by ca.id asc `+pageLimit; 
      break;
      default: 
        searchCondition = [];
        resSearchOption.searchOption = 'Non';
        resSearchOption.searchKey = 'Non';
        queryString = `select * from categories order by id asc `+pageLimit;
      break;
      } 
        console.log(queryString);
        
      let resCount = await pgPool.query(queryCountString, searchCondition);
      //console.log(resCount.rows[0].totalrows); 
      let data = await pgPool.query(queryString, searchCondition); 

      let resVal = {};
      resVal.rowCount = resCount.rows[0].totalrows;
      resVal.totalPage = Math.ceil(resCount.rows[0].totalrows/pagination.limit); 
      resVal.searchKey = resSearchOption;
      resVal.rows = humps.camelizeKeys(data.rows);  
      return resVal

    },
    async searchIngredients(inputSearch){
      let queryString ='';  let queryCountString = '';
      let pagination = util.getPageLimitText(inputSearch.page,inputSearch.limit);
      let pageLimit = " LIMIT "+pagination.limit+" OFFSET "+pagination.offset;
      let resSearchOption = inputSearch; 
      let searchCondition = [inputSearch.searchKey]; 

      switch(inputSearch.searchOption){
      case "ingredientId" : 
        if (inputSearch.searchKey > 0){  
          queryCountString = `select count(*) as totalrows from ingredients where id = $1`;
          queryString = `select * from ingredients where id = $1 order by id asc `+pageLimit;
        }else{
          searchCondition = [];
          resSearchOption.searchOption = 'Non';
          resSearchOption.searchKey = 'Non';
          queryCountString = `select count(*) as totalrows from ingredients `;
          queryString = `select * from ingredients order by id asc `+pageLimit;
        }
      break;
      case "ingredientSlug" :  
        queryCountString = `select count(*) as totalrows from ingredients where slug = $1`;
        queryString = `select * from ingredients where slug = $1 order by id asc `+pageLimit; 
      break;
      case "username" :  
             queryCountString = `select count(*) as totalrows from ingredients i
                inner join users u on i.user_id = u.id
                where  u.username = $1 and u.approved = 'approved'  `;
             queryString = `SELECT i.* from ingredients i
                inner join users u on i.user_id = u.id
                where  u.username = $1 and u.approved = 'approved'  order by i.id asc ` +pageLimit; 
      break;
      default: 
        searchCondition = [];
        resSearchOption.searchOption = 'Non';
        resSearchOption.searchKey = 'Non';
        queryCountString = `select count(*) as totalrows from ingredients`;
        queryString = `select * from ingredients order by id asc `+pageLimit;
      break;
      }

      let resCount = await pgPool.query(queryCountString, searchCondition);
      let data = await pgPool.query(queryString, searchCondition); 

      let resVal = {};
      resVal.rowCount = resCount.rows[0].totalrows;
      resVal.totalPage = Math.ceil(resCount.rows[0].totalrows/pagination.limit); 
      resVal.searchKey = resSearchOption;
      resVal.rows = humps.camelizeKeys(data.rows);  
      
      return resVal
    },
    
  }
};