const graphql = require('graphql');
//Import type hemlper from grapql-js
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} = graphql;

// The root query type is where in the data graph
// we can start asking questions
const RootQueryType = new GraphQLObjectType({
  name : "RootQueryType",

  fields : {
    hello : {
      type: GraphQLString,
      description : 'The *mandatory* hello world. type {hello} to see result.',
      resolve: () => 'Hello world'
    } 
  }
});

const ncSchema = new GraphQLSchema({
  query : RootQueryType
  //mutation : 
});

module.exports = ncSchema;