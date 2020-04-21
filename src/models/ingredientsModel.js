const util = require('../lib/util');
const validation = require('../lib/validation');
const humps = require('humps');

module.exports = pgPool => {
  return {
    getLoaderIngredientsByIds({ ingredientIds }) {
      let queryString = `select * from ingredients where id = ANY($1)`;
      return pgPool.query(queryString, [ingredientIds]).then(res => {
        return util.orderedFor(res.row, ingredientIds, 'id', true); // 'id' = pk
      });
    },

    async saveRecord(inputObject){ 
      //# save ingredient 
      let responseArr = []
      let userInfoArr = [];
      let responseStatusTag = {}
      let returnRoot = {};

      let r =  inputObject.ingredient;  // contains : title,description,amount,remark
      let savedIngredientsInfo = await this.saveIngredients(r);
      //console.log(savedIngredientsInfo);
      
      if (typeof savedIngredientsInfo.id != 'undefined') { 
        responseStatusTag = util.getResponseStatusTag(200);  
      }else{
        responseStatusTag = savedIngredientsInfo; // if not success function will return response status
      } 
       // return value
      returnRoot = savedIngredientsInfo;
      returnRoot.createdBy=global.userLoginInfo; 
      returnRoot.responseStatus=responseStatusTag;
      return returnRoot;
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
    saveIngredients(i){
      let isvalidate = {};
      
      isvalidate = validation.maxLengthValue(i.title,'title');  // #1 category: check length
      if (isvalidate.status == 200){
        i.slug = validation.slugTag(i.title,i.slug); // #2 category: check slug format
        i.description = util.striptags(i.description);
        isvalidate = validation.maxLengthValue(i.slug,'slug'); // #3 category :check length of slug 
         if (isvalidate.status == 200){ // #4 check length of recipe Title 
          let sqlString = `INSERT INTO ingredients (user_id,slug, title, description,image) VALUES ($1, $2, $3, $4,$5)
          ON CONFLICT (slug,user_id) DO UPDATE SET title=$3, description=$4,image=$5
          where ingredients.user_id=$6
          returning * `; 
          return  pgPool.query(sqlString, [global.UserId, i.slug, i.title, i.description,i.image,global.UserId])
              .then(res => {
                  let ingredient =  humps.camelizeKeys(res.rows[0]); 
                  return ingredient; 
                }); 
          }else{ 
            return isvalidate; // category: solg length more than 50
          }
      }else{ 
        return isvalidate; // category: title length more than 90
      }
    }
  }
}