const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const description = require('../../../lib/shema_description'); 
const responseStatusTag = require('../../share/response_status'); 

module.exports = new GraphQLObjectType({
  name : 'categoryInfo',
  description : description['CategoryInfo'],
  fields: { 
    id: { type: GraphQLID },
    userId: { type: GraphQLID },
    slug: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    image : { type: GraphQLString },
    remark: { type: GraphQLString }, 
    responseStatus: { type: new GraphQLNonNull(responseStatusTag) }
  }
})