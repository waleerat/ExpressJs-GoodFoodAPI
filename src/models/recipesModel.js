const { orderedFor } = require('../lib/util');

module.exports = pgPool => {
  return {
    getIngredientsByRecipeId(userIds) {
      const queryString = `select * from users where id = ANY($1)`;
      return pgPool.query(queryString, [userIds]).then(res => {
        return orderedFor(res.row, userIds, 'id', true); 
      });
    },
    getHowtoByRecipeIds({ howtoIds }) {
      const queryString = `select * from recipe_howto where id = ANY($1)`;
      return pgPool.query(queryString, [howtoIds]).then(res => {
        return orderedFor(res.row, howtoIds, 'id', true); // 'id' = pk
      });
    },
    saveRecord(){
      console.log('get submit recipe')
    },
    updateRecord(){

    }

  }
    
}