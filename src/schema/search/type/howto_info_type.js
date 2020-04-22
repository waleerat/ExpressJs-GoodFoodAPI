const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt
} = require('graphql');

const description = require('../../../lib/shema_description');

module.exports = new GraphQLObjectType({
  name : 'howtoInfo',
  description : description['HowtoInfo'],
  fields: () => (
    { 
      id: { type: GraphQLID  },
      orderStep: { type: GraphQLInt },
      title: { type: GraphQLString },
      description : { type: GraphQLString },
      image: { type: GraphQLString },
      remark: { type: GraphQLString }
    })
})