const description = require('../../../lib/shema_description'); 
const {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt
} = require('graphql');

const recipesModel = require('../../../models/recipesModel');
const sqlQueryStatus = require('../type/query_status'); 

const InputType = new GraphQLInputObjectType({
  name: "recipeIDs",
  description: description['recipeDeleteRecords'],
  fields: 
    { 
      recipes: { type: new GraphQLList( 
        new GraphQLInputObjectType({
          name: 'recipeIds',
          fields: () => ({
            recipeId: { type: new GraphQLNonNull(GraphQLInt) }
            })
        }) 

      ) }
    }
});

module.exports = {
  type: sqlQueryStatus,
  args: {
    input: { type: new GraphQLNonNull(InputType) }
  },
  resolve(obj, { input }, { pgPool }) {
    return recipesModel(pgPool).deleteRecords(input);
  }
};