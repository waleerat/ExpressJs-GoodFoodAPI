const description = require('../../lib/shema_description'); 

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const IngredientInfo = require('./type/category_info'); 

const RootQueryType = new GraphQLObjectType({
  name : "CategoryQuery", 
  fields : {
    category : {
      type: IngredientInfo,
      description : description['categoryQuery'],
      args: {
        key: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: () => {
        return {
          
        } 
      }
    } 
  }
});

const modifyRecord = require('./mutations/modify');
const updateStatusResult = require('./mutations/update_status');
const deleteRecords = require('./mutations/delete');

const RootMutationType = new GraphQLObjectType({
  name: 'IngredientMutation',
  description : description['IngredientMutation'],
  fields: () => ({
    modifyRecord: modifyRecord,
    updateStatusResult : updateStatusResult,
    deleteResult : deleteRecords,
  })
});


const ncSchema = new GraphQLSchema({
  query : RootQueryType,
  mutation : RootMutationType
});

module.exports = ncSchema;
