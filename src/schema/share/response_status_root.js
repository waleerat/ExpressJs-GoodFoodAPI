const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'responseStatus', 
  fields: {
    category: {
      type: new GraphQLNonNull( 
        new GraphQLObjectType({
          name: 'category',
          fields:  {
            status: { type: GraphQLString },
            message: { type: GraphQLString }
          }
        }) 
      ),resolve(obj) {
        return obj.responseStatus;
      }
    }
  }
});