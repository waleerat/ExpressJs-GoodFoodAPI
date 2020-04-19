const util = require('../lib/util');
const humps = require('humps');
const slugify = require('slugify');

module.exports = pgPool => {
  return {
    getIngredientsByIds({ ingredient_id }) {
      const queryString = `select * from ingredients where id = ANY($1)`;
      return pgPool.query(queryString, [ingredient_id]).then(res => {
        return util.orderedFor(res.row, ingredient_id, 'id', true); // 'id' = pk
      });
    },

    saveRecord(inputObject){
      const userId = global.UserId;
      //# save ingredient 
      let igd =  inputObject.ingredient;  // contains : title,description,amount,remark
      let igdSlug = slugify(igd.title);
      //clear html tag
      igd.title = util.striptags(igd.title); 
      igd.description = util.striptags(igd.description); 
      igd.amount = util.striptags(igd.amount); 
      igd.remark = util.striptags(igd.remark);  
  //console.log(igd.title);
  
      const sqlString = `INSERT INTO ingredients (user_id,slug, title, description,image) VALUES ($1, $2, $3, $4,$5)
      ON CONFLICT (slug,user_id) DO UPDATE SET title=$3, description=$4,image=$5
      where ingredients.user_id=$6
      returning * `;  
      return pgPool.query(sqlString, [userId, igdSlug, igd.title, igd.description,igd.image,userId]).then(res => {
        if (res.rows[0]){ 
          console.log(res.rows[0]); 
          return humps.camelizeKeys(res.rows[0]);
        }
      }).catch();
      //# save ingredient  
    },
    updateStatus(Ids){
      const userId = global.UserId;
      const newStatus= Ids.newStatus;
      const arrRecipeIds= Object.entries(Ids.recipes);
      const  recipeIds= []; 
      for (let deleteId of arrRecipeIds) {
        recipeIds.push(deleteId[1].id);
      } 
      //const UpdatedStatusRows = recipeIds.length;
      let sqlString  = '';
      sqlString = `UPDATE  ingredients SET status=$1  WHERE id=ANY($2) user_id=$2
                  and id not in (select ingredient_id from ingredient_bundle where ingredient_id=ANY($3);`;
         pgPool.query(sqlString, [newStatus,recipeIds,userId]);
      return util.getResponseStatusTag(301);  
    },
    deleteRecords(Ids){
      const userId = global.UserId; 
      const arrRecipeIds= Object.entries(Ids.recipes);
      const  recipeIds= []; 
      for (let deleteId of arrRecipeIds) {
        recipeIds.push(deleteId[1].id);
      }

     // const deletedRows = recipeIds.length;
      let sqlString  = '';
       sqlString = `DELETE FROM ingredients WHERE recipe_id=ANY($1) and user_id=$2
                    id not in (select ingredient_id from ingredient_bundle where ingredient_id=ANY($3));`;
          pgPool.query(sqlString, [recipeIds,userId,recipeIds]); 
          
      return util.getResponseStatusTag(302);     
    }
  }
}