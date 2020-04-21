const description = require('../../../lib/shema_description'); 

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

 const authorInfo = require('../../share/author_info');
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
    createdBy: { type: new GraphQLNonNull(authorInfo),
    responseStatus: { type: new GraphQLNonNull(responseStatusTag) }
    } 
  }
})