const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull 
  
} = require('graphql');

const InputType = new GraphQLInputObjectType({
  name: 'ingredientInputInfo',
  fields: { 
    title: { type: new GraphQLNonNull(GraphQLString)},
    slug: { type: GraphQLString },
    description: { type: GraphQLString },
    image: { type: GraphQLString }, 
    remark: { type: GraphQLString }
  }
}); 

module.exports = InputType;
 