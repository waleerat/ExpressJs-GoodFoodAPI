const util = require('../lib/util');
const humps = require('humps');
const slugify = require('slugify');
module.exports = pgPool => {
  return {
    isIngredientExistBySlug(slug){
      const queryString = `select * from ingredients where slug = $1`;
      return pgPool.query(queryString, [slug]).then(res => {
        return  (res.rows)?  true :  false;
      });
    },
    getIngredientsByIngredientId({ ingredientId }) {
      const queryString = `select * from ingredients where id = ANY($1)`;
      return pgPool.query(queryString, [ingredientId]).then(res => {
        return util.orderedFor(res.row, ingredientId, 'id', true); // 'id' = pk
      });
    },

    saveRecord(inputObject){
      const userId = global.UserId;
      //# save ingredient 
      let igd =  inputObject;  // contains : title,description,amount,remark
      let igdSlug = slugify(igd.title);
      //clear html tag
      igd.title = util.striptags(igd.title); 
      igd.description = util.striptags(igd.description); 
      igd.amount = util.striptags(igd.amount); 
      igd.remark = util.striptags(igd.remark); 

      const sqlString = `INSERT INTO ingredients (user_id,slug, title, description) VALUES ($1, $2, $3, $4)
                      ON CONFLICT (slug) DO UPDATE SET title=$3, description=$4
                      returning * `;
      pgPool.query(sqlString, [userId, igdSlug, igd.title, igd.description]).then(res => {
        if (res.rows[0]){
          return humps.camelizeKeys(res.rows[0]);
        }
      }).catch(); 
      //# save ingredient  
    },
    moveIngredientsToTrash(moveIds){
      console.log(moveIds); 
      const moveToTrashRows = '[Number]';
       return {"status": 200, "message": "Moved to trash "+moveToTrashRows+" rows"}   
    },
    deleteIngredientsPernant(deleteIds){
      console.log(deleteIds);
      const moveToTrashRows = '[Number]';
      return {"status": 200, "message": "Deleted to trash "+moveToTrashRows+" rows"}        
    }
  }
}