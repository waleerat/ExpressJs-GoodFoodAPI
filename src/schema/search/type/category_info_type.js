const description = require('../../../lib/shema_description'); 

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt
} = require('graphql');
 
module.exports = new GraphQLObjectType({
  name : 'categoryInfo',
  description : description['CategoryInfo'],
  fields: { 
    id: { type: GraphQLID  },
    orderStep: { type: GraphQLInt },
    slug: { type: GraphQLString },
    title: { type: GraphQLString },
    description : { type: GraphQLString },
    image: { type: GraphQLString },
    remark: { type: GraphQLString }
  }
})