const graphql = require('graphql')
const {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString
} = graphql;


module.exports = new GraphQLObjectType({
  name : 'authorInfo',
  fields: {
    id: { type: GraphQLID },
    username: { type : GraphQLString},
    fullName: {
      type: GraphQLString,
      resolve: obj => `${obj.firstName} ${obj.lastName}`
    },
    image: { type : GraphQLString },
    website: { type : GraphQLString },
    facebook: { type : GraphQLString },
    instagram: { type : GraphQLString }
  }
})