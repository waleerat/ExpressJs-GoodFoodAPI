const util = require('../lib/util');
const humps = require('humps');
const slugify = require('slugify');
module.exports = pgPool => {
  return {
    isRecipeExistBySlug(slug){
      const queryString = `select * from recipes where slug = $1`;
      return pgPool.query(queryString, [slug]).then(res => {
        return  (res.rows)?  true :  false;
      });
    },
    getIngredientsByRecipeId({ recipeId }) {
      const queryString = `select * from ingredients where id = ANY($1)`;
      return pgPool.query(queryString, [recipeId]).then(res => {
        return util.orderedFor(res.row, recipeId, 'id', true); // 'id' = pk
      });
    },
 
    getHowtoByRecipeIds({ howtoIds }) {
      const queryString = `select * from recipe_howto where id = ANY($1)`;
      return pgPool.query(queryString, [howtoIds]).then(res => {
        return util.orderedFor(res.row, howtoIds, 'id', true); // 'id' = pk
      });
    },
    saveRecord(inputObject){ 
      console.log(inputObject);
      const o = inputObject;
      const title = util.striptags(o.recipe.title);
      const slug = slugify(title); 
     
      const userId = 65; const categoryId = 1; const unqueValueColumn = slug;
        const sqlString = `
                  insert into recipes
                  (user_id,category_id,slug, title, description)
                  select $1, $2, $3, $4, $5 
                  where not exists (select 1 from recipes where slug = $6 )
                  returning *
                  `;
                  
        return pgPool.query(sqlString, [userId,categoryId, slug, o.recipe.title, o.recipe.description,unqueValueColumn]).then(res => {
          if (res.rows[0]){
            console.log(humps.camelizeKeys(res.rows[0]));
            
            const newRecipeInfo =  humps.camelizeKeys(res.rows[0]);
            const recipeId = newRecipeInfo.id;
            console.log(recipeId);
            
          }else{
            console.log('dupicate+++++');
            
             return 'duplicate data!!!!!'
          }
 
          
        }).catch(e => {
          console.log("Something went wrong : " , e)
        }); 
    },
  
  }
    
}