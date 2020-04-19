const util = require('../lib/util');
const humps = require('humps');
const slugify = require('slugify');

module.exports = pgPool => {
  return {
    getIngredientsByIds({ ingredient_id }) {
      let queryString = `select * from ingredients where id = ANY($1)`;
      return pgPool.query(queryString, [ingredient_id]).then(res => {
        return util.orderedFor(res.row, ingredient_id, 'id', true); // 'id' = pk
      });
    },

    updateStatus(Ids){
      let newStatus= Ids.newStatus;
      let arrIngredientsIds= Object.entries(Ids.ingredients);
      let  ingredientIds= []; 
      for (let deleteId of arrIngredientsIds) {
        ingredientIds.push(deleteId[1].id);
      } 
      //let UpdatedStatusRows = ingredientIds.length;
      let sqlString  = `UPDATE  ingredients SET status=$1  WHERE id=ANY($2) and user_id=$3
      and id not in (select ingredient_id from ingredient_bundle where ingredient_id=ANY($4))`;
       return pgPool.query(sqlString, [newStatus,ingredientIds,global.UserId,ingredientIds]).then(res => {
        if (res.rows){
          let response = util.getResponseStatusTag(301);
          response.message = response.message.replace('#number#',res.rowCount);
          response.message = response.message.replace('#number2#',ingredientIds.length);
          return response; 
        }
      }) ;  
    },

    deleteRecords(Ids){
      let arrRecipeIds= Object.entries(Ids.ingredients);
      let  ingredientIds= []; 
      for (let deleteId of arrRecipeIds) {
        ingredientIds.push(deleteId[1].id);
      } 
     // let deletedRows = ingredientIds.length;
   
      let sqlString  = `DELETE FROM ingredients   WHERE id=ANY($1) and user_id=$2
      and id not in (select ingredient_id from ingredient_bundle where ingredient_id=ANY($3))`;
       return pgPool.query(sqlString, [ingredientIds,global.UserId,ingredientIds]).then(res => {
        if (res.rows){
          let response = util.getResponseStatusTag(302);
          response.message = response.message.replace('#number#',res.rowCount);
          response.message = response.message.replace('#number2#',ingredientIds.length);
          return response; 
        }
      }) ; 
    },

    saveRecord(inputObject){
      let userId = global.UserId;
      //# save ingredient 
      let igd =  inputObject.ingredient;  // contains : title,description,amount,remark
      let igdSlug = slugify(igd.title);
      //clear html tag
      igd.title = util.striptags(igd.title); 
      igd.description = util.striptags(igd.description); 
      igd.amount = util.striptags(igd.amount); 
      igd.remark = util.striptags(igd.remark);  
  //console.log(igd.title);
  
      let sqlString = `INSERT INTO ingredients (user_id,slug, title, description,image) VALUES ($1, $2, $3, $4,$5)
      ON CONFLICT (slug,user_id) DO UPDATE SET title=$3, description=$4,image=$5
      where ingredients.user_id=$6
      returning * `;  
      return pgPool.query(sqlString, [userId, igdSlug, igd.title, igd.description,igd.image,userId]).then(res => {
        if (res.rows[0]){  
          return humps.camelizeKeys(res.rows[0]);
        }
      })
      //# save ingredient  
    }
  }
}