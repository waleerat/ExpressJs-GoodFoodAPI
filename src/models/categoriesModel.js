const util = require('../lib/util');
const validation = require('../lib/validation');
const humps = require('humps');

module.exports = pgPool => {
  return { 
    async saveRecord(inputObject){ 
      //# save category  
      let responseStatusTag = {}
      let returnRoot = {};

      let c =  inputObject.category;  // contains : title,description,amount,remark
      let savedIngredientsInfo = await this.saveCategory(c);
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
      let arrIngredientsIds= Object.entries(Ids.categories);
      let  categoryIds= []; 
      for (let deleteId of arrIngredientsIds) {
        categoryIds.push(deleteId[1].id);
      } 
      
      //let UpdatedStatusRows = categoryIds.length;
      let sqlString  = `UPDATE  categories SET status=$1  WHERE id=ANY($2) and user_id=$3
      and id not in (select category_id from recipes where category_id=ANY($4))`;
       return pgPool.query(sqlString, [newStatus,categoryIds,global.UserId,categoryIds]).then(res => {
        if (res.rows){
          let response = util.getResponseStatusTag(301);
          response.message = response.message.replace('#number#',res.rowCount);
          response.message = response.message.replace('#number2#',categoryIds.length);
          return response; 
        }
      }) ;  
    },

    deleteRecords(Ids){
      let arrRecipeIds= Object.entries(Ids.categories);
      let  categoryIds= []; 
      for (let deleteId of arrRecipeIds) {
        categoryIds.push(deleteId[1].id);
      } 
     // let deletedRows = categoryIds.length;
   
      let sqlString  = `DELETE FROM categories   WHERE id=ANY($1) and user_id=$2
      and id not in (select category_id from recipes where category_id=ANY($3))`;
       return pgPool.query(sqlString, [categoryIds,global.UserId,categoryIds]).then(res => {
        if (res.rows){
          let response = util.getResponseStatusTag(302);
          response.message = response.message.replace('#number#',res.rowCount);
          response.message = response.message.replace('#number2#',categoryIds.length);
          return response; 
        }
      }) ; 
    },

    saveCategory(c){ 
      let isvalidate = {};
      isvalidate = validation.maxLengthValue(c.title,'title');  // #1 category: check length
      if (isvalidate.status == 200){
        c.slug = validation.slugTag(c.title,c.slug); // #2 category: check slug format
        
        c.description = util.striptags(c.description);
        isvalidate = validation.maxLengthValue(c.slug,'slug'); // #3 category :check length of slug 
         if (isvalidate.status == 200){ // #4 check length of recipe Title 
          
              let sqlString = `
              INSERT INTO categories (user_id,slug, title, description,image)
              VALUES ($1, $2, $3, $4, $5)
              ON CONFLICT (slug,user_id)
              DO UPDATE SET title=$3, description=$4, image=$5 where categories.user_id = $6
              returning *
            `; 
            return  pgPool.query(sqlString, [global.UserId,c.slug, c.title, c.description,c.image,global.UserId])
            .then(res => { 
               return humps.camelizeKeys(res.rows[0]);  
            });  
          }else{ 
            return isvalidate; // category: solg length more than 50
          }
      }else{ 
        return isvalidate; // category: title length more than 90
      }  
    },

  }
}