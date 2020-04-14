const description = require('../../../lib/shema_description'); 

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
} = require('graphql');

 

module.exports = new GraphQLObjectType({
  name : 'HowtoType',
  description : description['HowtoType'],
  fields: { 
    id: { type: GraphQLID },
          slog: { type: GraphQLString },
          title: { type: GraphQLString },
          description: { type: GraphQLString },
          
  }
})