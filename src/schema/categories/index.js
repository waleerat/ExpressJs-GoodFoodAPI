const {
  GraphQLSchema,
  GraphQLObjectType
} = require('graphql');

const description = require('../../lib/shema_description'); 
const categoryInfo = require('./type/category_info'); 

const RootQueryType = new GraphQLObjectType({
  name : "CategoryQuery", 
  fields : {
    category : {
      type: categoryInfo,
      description : description['categoryQuery']
    } 
  }
});

const modifyRecord = require('./mutations/modify');
const updateStatusResult = require('./mutations/update_status');
const deleteRecords = require('./mutations/delete');

const RootMutationType = new GraphQLObjectType({
  name: 'categoryMutation',
  description : description['CategoryMutation'],
  fields: () => ({
    modifyRecord: modifyRecord,
    updateResult : updateStatusResult,
    deleteResult : deleteRecords,
  })
});


const ncSchema = new GraphQLSchema({
  query : RootQueryType,
  mutation : RootMutationType
});

module.exports = ncSchema;
