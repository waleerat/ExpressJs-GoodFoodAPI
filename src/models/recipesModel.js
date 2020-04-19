const util = require('../lib/util');
const humps = require('humps');
const slugify = require('slugify');
module.exports = pgPool => {
  return {
/*     isRecipeExistBySlug(slug){
      const queryString = `select * from recipes where slug = $1`;
      return pgPool.query(queryString, [slug]).then(res => {
        return  (res.rows)?  true :  false;
      });
    }, */
    getRecipesByIds({ RecipeIds }) {
      const queryString = `select * from ingredients where id = ANY($1)`;
      return pgPool.query(queryString, [RecipeIds]).then(res => {
        return util.orderedFor(res.row, RecipeIds, 'id', true); // 'id' = pk
      });
    }, 
 
    getHowtoByRecipeIds({ howtoIds }) {
      const queryString = `select * from recipe_howto where id = ANY($1)`;
      return pgPool.query(queryString, [howtoIds]).then(res => {
        return util.orderedFor(res.row, howtoIds, 'id', true); // 'id' = pk
      });
    },
    updateStatus(Ids){
      const newStatus= Ids.newStatus;
      const arrRecipeIds= Object.entries(Ids.recipes);
      const  recipeIds= []; 
      for (let deleteId of arrRecipeIds) {
        recipeIds.push(deleteId[1].id);
      } 
      //const UpdatedStatusRows = recipeIds.length;
      let sqlString  = '';
       sqlString = `UPDATE  recipes SET status=$1 WHERE id=ANY($2)  and user_id=$3;`;
          pgPool.query(sqlString, [newStatus,recipeIds,global.UserId]);  
       sqlString = `UPDATE  ingredient_bundle SET status=$1  WHERE recipe_id=ANY($2) and recipe_id 
       in (select recipe_id from ingredients where user_id=$3);`;
          pgPool.query(sqlString, [newStatus,recipeIds,global.UserId]); 
       sqlString = `UPDATE  recipe_howto SET status=$1  WHERE recipe_id=ANY($2) and user_id=$3;`;
          pgPool.query(sqlString, [newStatus,recipeIds,global.UserId]); 

      return util.getResponseStatusTag(301); 
    },
    deleteRecords(Ids){
      const arrRecipeIds= Object.entries(Ids.recipes);
      const  recipeIds= []; 
      for (let deleteId of arrRecipeIds) {
        recipeIds.push(deleteId[1].id);
      }

     // const deletedRows = recipeIds.length;
      let sqlString  = '';   
       sqlString = `DELETE FROM ingredient_bundle WHERE recipe_id=ANY($1) and recipe_id 
       in (select recipe_id from ingredients where user_id=$2);`;
          pgPool.query(sqlString, [recipeIds,global.UserId]); 
       sqlString = `DELETE FROM recipe_howto WHERE recipe_id=ANY($1) and user_id=$2;`;
          pgPool.query(sqlString, [recipeIds,global.UserId]); 
          sqlString = `DELETE FROM recipes WHERE id=ANY($1) and user_id=$2;`;
          pgPool.query(sqlString, [recipeIds,global.UserId]);
          
      return util.getResponseStatusTag(302);       
    },
    async saveRecord(inputObject){   
      // # saveRecord 
      const o = inputObject.recipe;
      const recipeSlug = slugify(o.title);
      // clear html tag
      o.title = util.striptags(o.title); 
      o.description = util.striptags(o.description);
      o.remark = util.striptags(o.remark);

      const arrIngredients = Object.entries(o.ingredients);
      const arrhowto = Object.entries(o.howto); 
      // # Add recipe
      let sqlString = `
                  INSERT INTO recipes (user_id,category_id,slug, title, description,image,remark)
                  VALUES ($1, $2, $3, $4, $5, $6, $7)
                  ON CONFLICT (slug,user_id)
                  DO UPDATE SET title=$4, description=$5, image=$6,remark=$7 where recipes.user_id = $8
                  returning *
                `; 
          const recipe = await pgPool.query(sqlString, [global.UserId,o.categoryId, recipeSlug , o.title, o.description,o.image,o.remark,global.UserId])
          .then(res => { 
            return humps.camelizeKeys(res.rows[0]);
          }); 
           const recipeId = recipe.id; 
          // Update current ingredients and howto to status inactive
          sqlString = `UPDATE  ingredient_bundle SET status='inactive' WHERE recipe_id=$1 and recipe_id 
                      in (select recipe_id from ingredients where user_id=$2);`;
          pgPool.query(sqlString, [recipeId,global.UserId]); 
          sqlString = `UPDATE  recipe_howto SET status='inactive' WHERE recipe_id=$1  and user_id=$2;`;
          pgPool.query(sqlString, [recipeId,global.UserId]);
           
            //# save ingredient list
            let resIngredientArr = [];
            let resStepArr = [];
            for (let ingredient of arrIngredients) {
              let resIngredient = await this.saveIngredients(recipeId,ingredient);
              resIngredientArr.push(resIngredient);
            }  
            // #save How to
           for (let step of arrhowto) {  
               let resStep = await this.saveHowtoSteps(recipeId,step);
               resStepArr.push(resStep);
           } 
             // Delete exist  ingredient_bundle Recored if status=inactive
            sqlString = `delete from  ingredient_bundle where status='inactive' and recipe_id = $1 and recipe_id 
            in (select recipe_id from ingredients where user_id=$2);`;
            pgPool.query(sqlString,[recipeId,global.UserId]);  
            sqlString = `delete from  recipe_howto where status='inactive' and recipe_id = $1 and user_id=$2;`;
            pgPool.query(sqlString,[recipeId,global.UserId]);  
      // #End Add recipe
     
      var root = recipe;
      root.ingredients = resIngredientArr;
      root.howto = resStepArr;
      //console.log(root);
      
      return root;
    }, 
     saveIngredients(recipeId,jsonIngredient){ 
        //# save ingredient list
        let igd =  jsonIngredient[1];
        let igdSlug = slugify(igd.title);
        //clear html tag
        igd.title = util.striptags(igd.title); 
        igd.description = util.striptags(igd.description); 
        igd.amount = util.striptags(igd.amount); 
        igd.remark = util.striptags(igd.remark);  

        const sqlString = `INSERT INTO ingredients (user_id,slug, title, description,image) VALUES ($1, $2, $3, $4,$5)
                      ON CONFLICT (slug,user_id) DO UPDATE SET title=$3, description=$4,image=$5
                      where ingredients.user_id=$6
                      returning * `;
     
         return  pgPool.query(sqlString, [global.UserId, igdSlug, igd.title, igd.description,igd.image,global.UserId])
                .then(res => {
                    const ingredient =  humps.camelizeKeys(res.rows[0]); 
                    let ingredientId = ingredient.id; 
                    ingredient.amount = igd.amount;
                    // #save Bundle
                    this.saveIngredientBundle(ingredientId, recipeId, igd);
                    return ingredient; 
                  }); 
    },
    saveIngredientBundle(ingredientId, recipeId, JsonIgd){
       // #save Bundle
        let sqlString = `
        INSERT INTO  ingredient_bundle (ingredient_id,recipe_id, amount, remark) VALUES ($1, $2, $3, $4)
        ON CONFLICT (ingredient_id,recipe_id) DO UPDATE SET  amount=$3,  remark=$4,status='active'
        returning *
        `; 
        return pgPool.query(sqlString, [ingredientId, recipeId, JsonIgd.amount, JsonIgd.remark])
              .then(res => {
                return humps.camelizeKeys(res.rows[0]); 
              }); 
    },
    saveHowtoSteps(recipeId,JsonStep){
       // #save How to
      let s =  JsonStep[1];  // contains : title,description,amount,remark 
      s.title = util.striptags(s.title); 
      s.description = util.striptags(s.description); 
      let sqlString = `INSERT INTO recipe_howto (user_id,recipe_id,order_step, title, description,image) VALUES ($1, $2, $3, $4,$5,$6)
                      ON CONFLICT (recipe_id,order_step) DO UPDATE SET title=$4, description=$5,image=$6,status='active'
                      where recipe_howto.user_id=$7
                      returning * `;
      return pgPool.query(sqlString, [global.UserId, recipeId, s.order, s.title, s.description,s.image,global.UserId])
                  .then(res => {
                    return humps.camelizeKeys(res.rows[0]); 
                  });
    } 
  }
}