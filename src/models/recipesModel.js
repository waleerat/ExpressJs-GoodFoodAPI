/* eslint-disable no-unused-vars */
const util = require('../lib/util');
const validation = require('../lib/validation');
const categoriesModel = require('../models/categoriesModel');
const ingredientsModel = require('../models/ingredientsModel');
const humps = require('humps');
const slugify = require('slugify');

module.exports = pgPool => {
  return {

    updateStatus(Ids){
      let newStatus= Ids.newStatus;
      let arrRecipeIds= Object.entries(Ids.recipes);
      let  recipeIds= []; 
      for (let deleteId of arrRecipeIds) {
        recipeIds.push(deleteId[1].id);
      } 
      //let UpdatedStatusRows = recipeIds.length;
      let sqlString  = '';let rowCount = 0;
      let res = sqlString = `UPDATE  recipes SET status=$1 WHERE id=ANY($2)  and user_id=$3;`;
      pgPool.query(sqlString, [newStatus,recipeIds,global.UserId]);  
      
      sqlString = `UPDATE  ingredient_bundle SET status=$1  WHERE recipe_id=ANY($2) and recipe_id 
        in (select recipe_id from ingredients where user_id=$3);`;
      pgPool.query(sqlString, [newStatus,recipeIds,global.UserId]); 
      
      sqlString = `UPDATE  recipe_howto SET status=$1  WHERE recipe_id=ANY($2) and user_id=$3;`;
      pgPool.query(sqlString, [newStatus,recipeIds,global.UserId]); 

      if (res.rows){ rowCount = res.rowCount; }
      
      let responseStatusTag = util.getResponseStatusTag(301);
      responseStatusTag.message = responseStatusTag.message.replace('#number#',rowCount);
      responseStatusTag.message = responseStatusTag.message.replace('#number2#',recipeIds.length);
      return responseStatusTag; 
    },
    deleteRecords(Ids){
      let arrRecipeIds= Object.entries(Ids.recipes);
      let  recipeIds= []; 
      for (let deleteId of arrRecipeIds) {
        recipeIds.push(deleteId[1].id);
      }

     // let deletedRows = recipeIds.length;
      let sqlString  = ''; 
      let rowCount = 0;
       sqlString = `DELETE FROM ingredient_bundle WHERE recipe_id=ANY($1) and recipe_id 
       in (select recipe_id from ingredients where user_id=$2);`;
        let res = pgPool.query(sqlString, [recipeIds,global.UserId]); 
        
        sqlString = `DELETE FROM recipe_howto WHERE recipe_id=ANY($1) and user_id=$2;`;
        pgPool.query(sqlString, [recipeIds,global.UserId]); 
       
        sqlString = `DELETE FROM recipes WHERE id=ANY($1) and user_id=$2;`;
        pgPool.query(sqlString, [recipeIds,global.UserId]);

        if (res.rows){ rowCount = res.rowCount; }
        let responseStatusTag = util.getResponseStatusTag(302);
        responseStatusTag.message = responseStatusTag.message.replace('#number#',rowCount);
        responseStatusTag.message = responseStatusTag.message.replace('#number2#',recipeIds.length);
        return responseStatusTag;
    },
    async saveRecord(inputObject){
      //console.log(Ids);
      let r = inputObject.recipe; //recipe
      let c = r.category[0]; // category
      let b = {}; // ingredient bundle
      let arrIngredients = Object.entries(r.ingredients);
      let arrhowto = Object.entries(r.howto);  
      
      let returnRoot = {};
      let resIngredientArr = []; 
      let resHowtoArr = [];
      let responseStatusTag = {}; 
  
      let saveCategoryInfo = await categoriesModel(pgPool).saveCategory(c); // save category
      if (typeof saveCategoryInfo.id != 'undefined') {
        r.categoryId = saveCategoryInfo.id;  
        //console.log('saved saveCategoryInfo Id : '+r.categoryId);  
        let saveRecipeInfo = await this.saveRecipe(r);
        
        if (typeof saveRecipeInfo.id != 'undefined') { 
          r.id = saveRecipeInfo.id;
          r.recipeId = saveRecipeInfo.id;
          //console.log('saved saveRecipeInfo Id : '+r.recipeId);  
          //# save ingredient  
          for (let i of arrIngredients) { 
            let savedIngredientInfo = await ingredientsModel(pgPool).saveIngredients(i[1]); // save recipe
            if (typeof savedIngredientInfo.id != 'undefined') {
              // Update current ingredients and howto to status inactive
              this.changeStatusToInactive(r.recipeId); 

              //console.log('saved savedIngredientInfo Id : '+savedIngredientInfo.id); 
               //# save ingredient bundle
               b.recipeId = r.recipeId;
               b.ingredientId =  savedIngredientInfo.id  
               b.amount = i[1].amount;
              // #save Bundle
              let savedBundleInfo = await this.saveIngredientBundle(b);
              savedIngredientInfo.amount = b.amount;
              resIngredientArr.push(savedIngredientInfo);  
              //console.log(' savedBundleInfo recipeId : '+savedBundleInfo.recipeId+ '  ingredientId : '+savedBundleInfo.ingredientId);
            }

          }
          // #save How to
          for (let howto of arrhowto) { 
            let s = howto[1]; 
            s.recipeId = r.recipeId
            let savedHowtoStepsInfo = await this.saveHowtoSteps(s);
            //console.log(' savedHowtoStepsInfo recipeId : '+savedHowtoStepsInfo.recipeId);
            resHowtoArr.push(savedHowtoStepsInfo);
         } 
             // Delete existing  ingredient_bundle Recored if status=inactive
            this.DeleteExiteRecipeBundle(r.recipeId);  
            returnRoot =r; 
            returnRoot.category = saveCategoryInfo;
            returnRoot.ingredients = resIngredientArr;
            returnRoot.howto = resHowtoArr; 
            responseStatusTag = util.getResponseStatusTag(200);  
        } else {
          responseStatusTag = util.getResponseStatusTag(921);  // recipe: can't add/modify
        }
      } else {
        responseStatusTag = util.getResponseStatusTag(920);  // category: can't add/modify
      }  
     
    returnRoot.createdBy=global.userLoginInfo;
    returnRoot.responseStatus=responseStatusTag;
    return returnRoot;

    },
    saveRecipe(r){
      let isvalidate = {};
      isvalidate = validation.maxLengthValue(r.title,'title');  // #1 category: check length
      if (isvalidate.status == 200){
        r.slug = validation.slugTag(r.title,r.slug); // #2 category: check slug format
        r.description = util.striptags(r.description);
        isvalidate = validation.maxLengthValue(r.slug,'slug'); // #3 category :check length of slug 
         if (isvalidate.status == 200){ // #4 check length of recipe Title
          let sqlString = `
          INSERT INTO recipes (user_id,category_id,slug, title, description,image,remark)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (slug,user_id)
          DO UPDATE SET title=$4, description=$5, image=$6,remark=$7 where recipes.user_id = $8
          returning *
        `; 
          return pgPool.query(sqlString, [global.UserId,r.categoryId, r.slug , r.title, r.description,r.image,r.remark,global.UserId])
            .then(res => {  
              return humps.camelizeKeys(res.rows[0]);
            });      
          } else { 
            return isvalidate; // category: solg length more than 50
          }
      } else { 
        return isvalidate; // category: title length more than 90
      }
    },
    saveIngredientBundle(b){
       // #save Bundle
        let sqlString = `
        INSERT INTO  ingredient_bundle (ingredient_id,recipe_id, amount) VALUES ($1, $2, $3)
        ON CONFLICT (ingredient_id,recipe_id) DO UPDATE SET  amount=$3,status='active'
        returning *
        `; 
        return pgPool.query(sqlString, [b.ingredientId, b.recipeId, b.amount])
          .then(res => {
            return humps.camelizeKeys(res.rows[0]); 
          }); 
    },
    saveHowtoSteps(s){
       // #save How to 
      s.title = util.striptags(s.title); 
      s.description = util.striptags(s.description);
      let sqlString = `INSERT INTO recipe_howto (user_id,recipe_id,order_step, title, description,image) VALUES ($1, $2, $3, $4,$5,$6)
        ON CONFLICT (recipe_id,order_step) DO UPDATE SET title=$4, description=$5,image=$6,status='active'
        where recipe_howto.user_id=$7
        returning * `;
      return pgPool.query(sqlString, [global.UserId, s.recipeId, s.order, s.title, s.description,s.image,global.UserId])
              .then(res => {
                return humps.camelizeKeys(res.rows[0]); 
              });
    },
    changeStatusToInactive(recipeId){
      let sqlString;
      sqlString = `UPDATE  ingredient_bundle SET status='inactive' WHERE recipe_id=$1 and recipe_id 
      in (select recipe_id from ingredients where user_id=$2);`;
      pgPool.query(sqlString, [recipeId,global.UserId]); 

      sqlString = `UPDATE  recipe_howto SET status='inactive' WHERE recipe_id=$1  and user_id=$2;`;
      pgPool.query(sqlString, [recipeId,global.UserId]);

    },
    DeleteExiteRecipeBundle(recipeId){
      let sqlString;
      sqlString = `delete from  ingredient_bundle where status='inactive' and recipe_id = $1 and recipe_id 
      in (select recipe_id from ingredients where user_id=$2);`;
      
      pgPool.query(sqlString,[recipeId,global.UserId]);  
      sqlString = `delete from  recipe_howto where status='inactive' and recipe_id = $1 and user_id=$2;`;
      pgPool.query(sqlString,[recipeId,global.UserId]); 
    }
  }
}