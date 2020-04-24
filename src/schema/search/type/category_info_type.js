const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql');

const description = require('../../../lib/shema_description');
const authorInfo = require('../../share/author_info');

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
    remark: { type: GraphQLString },
    status: { type: GraphQLString },
    createdBy: {type: new GraphQLNonNull(authorInfo),
      resolve(obj, args, { loaders }) { 
        return loaders.usersByIds.load(obj.userId);
      }
    },
  }
});