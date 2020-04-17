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
    // # saveRecord
      const o = inputObject.recipe;
      const recipeSlug = slugify(o.title);
      // clear html tag
      o.title = util.striptags(o.title); 
      o.description = util.striptags(o.description);
      o.remark = util.striptags(o.remark);

      const arrIngredients = Object.entries(o.ingredients);
      const arrhowto = Object.entries(o.howto); 

      const userId = 65; const categoryId = 1; 
      // # Add recipe
      let sqlString = `
                INSERT INTO recipes (user_id,category_id,slug, title, description,remark)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    ON CONFLICT (slug)
                    DO UPDATE SET title=$4, description=$5, remark=$6
                returning *
                `; 
        pgPool.query(sqlString, [userId,categoryId, recipeSlug , o.title, o.description,o.remark]).then(res => {
        if (res.rows[0]){ 
          const recipeId = res.rows[0].id;
          //console.log('recipeId = '+ recipeId);  
          const updaterowId = {};
            for (let ingredient of arrIngredients) { 
              //# save ingredient list
              let igd =  ingredient[1];  // contains : title,description,amount,remark
              let igdSlug = slugify(igd.title);
              //clear html tag
              igd.title = util.striptags(igd.title); 
              igd.description = util.striptags(igd.description); 
              igd.amount = util.striptags(igd.amount); 
              igd.remark = util.striptags(igd.remark); 

              // change ingredient_bundle/recipe_howto status to inactive
              sqlString = `UPDATE  ingredient_bundle SET status='inactive' WHERE recipe_id=$1;`;
              pgPool.query(sqlString, [recipeId]); 
              sqlString = `UPDATE  recipe_howto SET status='inactive' WHERE recipe_id=$1;`;
              pgPool.query(sqlString, [recipeId]); 

              sqlString = `INSERT INTO ingredients (user_id,slug, title, description) VALUES ($1, $2, $3, $4)
                              ON CONFLICT (slug) DO UPDATE SET title=$3, description=$4
                              returning * `;
              pgPool.query(sqlString, [userId, igdSlug, igd.title, igd.description]).then(res => {
                if (res.rows[0]){
                  let ingredientId = res.rows[0].id; 
                  updaterowId.push = {'recipeId': ingredientId} 
                  console.log('ingredientId = '+ ingredientId); 
                  // #save Bundle
                    let sqlString = `
                                INSERT INTO  ingredient_bundle (ingredient_id,recipe_id, amount, remark) VALUES ($1, $2, $3, $4)
                                ON CONFLICT (ingredient_id,recipe_id) DO UPDATE SET  amount=$3,  remark=$4,status='active'
                                returning *
                                `; 
                      pgPool.query(sqlString, [ingredientId, recipeId, igd.amount, igd.remark]).then(res => {
                      if (res.rows[0]){
                        let amount = res.rows[0].amount;
                        //console.log('amount = '+ amount); 
                        //
                      }
                    }).catch(); 
                  // #End save Bundle
                }
              }).catch(); 
              //#End save ingredient list
            } 

           // #save How to
           for (let step of arrhowto) { 
            let s =  step[1];  // contains : title,description,amount,remark 
            s.title = util.striptags(s.title); 
            s.description = util.striptags(s.description); 
            let sqlString = `INSERT INTO recipe_howto (user_id,recipe_id,order_step, title, description) VALUES ($1, $2, $3, $4,$5)
                            ON CONFLICT (recipe_id,order_step) DO UPDATE SET title=$4, description=$5,status='active'
                            returning * `;
            pgPool.query(sqlString, [userId, recipeId, s.order, s.title, s.description]).then(res => {
              if (res.rows[0]){
                //let howtoId = res.rows[0].id;
                //console.log('howtoId = '+ howtoId);   
              }
            }).catch();  
          }
           //End #save How to
             // Delete exist  ingredient_bundle Recored 
            sqlString = `delete from  ingredient_bundle where status='inactive' and recipe_id = $1;`;
            pgPool.query(sqlString,[recipeId]);  
            sqlString = `delete from  recipe_howto where status='inactive' and recipe_id = $1;`;
            pgPool.query(sqlString,[recipeId]);    
        }

        
      }).catch();  
      // #End Add recipe
    // #End saveRecord
    },
    moveRecipesToTrash(deleteIds){
      //console.log(recipeIds);
      const arrRecipeIds= Object.entries(deleteIds.recipes);
      const  recipeIds= []; 
      for (let deleteId of arrRecipeIds) {
        recipeIds.push(deleteId[1].id);
      }
      
      let sqlString  = '';
       sqlString = `UPDATE  recipes SET status='trash' WHERE id=ANY($1);`;
          pgPool.query(sqlString, [recipeIds]);  
       sqlString = `UPDATE  ingredient_bundle SET status='trash'  WHERE recipe_id=ANY($1);`;
          pgPool.query(sqlString, [recipeIds]); 
       sqlString = `UPDATE  recipe_howto SET status='trash'  WHERE recipe_id=ANY($1);`;
          pgPool.query(sqlString, [recipeIds]); 
    },
    deleteRecipesPernant(deleteIds){
      //console.log(recipeIds);
      const arrRecipeIds= Object.entries(deleteIds.recipes);
      const  recipeIds= []; 
      for (let deleteId of arrRecipeIds) {
        recipeIds.push(deleteId[1].id);
      }
      
      let sqlString  = ''; 
       sqlString = `DELETE FROM ingredient_bundle WHERE recipe_id=ANY($1);`;
          pgPool.query(sqlString, [recipeIds]); 
       sqlString = `DELETE FROM recipe_howto WHERE recipe_id=ANY($1);`;
          pgPool.query(sqlString, [recipeIds]); 
       sqlString = `DELETE FROM recipes WHERE id=ANY($1);`;
          pgPool.query(sqlString, [recipeIds]);    
    }
  }

}