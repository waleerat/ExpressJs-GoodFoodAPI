const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt
} = require('graphql');
 
const InputType = new GraphQLInputObjectType({
  name: 'recipeInputInfo',
  fields: { 
    slug: { type: GraphQLString },
    title: { type: new GraphQLNonNull(GraphQLString)},
    description: { type: GraphQLString },
    image: { type: GraphQLString },
    category: { type: new GraphQLList(
      new GraphQLInputObjectType({
        name: 'categoryType',
        fields: () => ({
          slug: { type: GraphQLString },
          title: { type: new GraphQLNonNull(GraphQLString) },
          image: { type: GraphQLString },
          description: { type: GraphQLString },
          })
      })
    )},
    ingredients: {
      type: new GraphQLList( 
        new GraphQLInputObjectType({
          name: 'ingredientType',
          fields: () => ({
            slug: { type: GraphQLString },
            title: { type: new GraphQLNonNull(GraphQLString) },
            image: { type: GraphQLString },
            amount : { type: new GraphQLNonNull(GraphQLString) },
            remark: { type: GraphQLString }
            })
        }) 
      ),
    }, 
    howto: {
      type: new GraphQLList( 
        new GraphQLInputObjectType({
          name: 'howtoType',
          fields: () => ({
            order: { type: new GraphQLNonNull(GraphQLInt) },
            image: { type: GraphQLString },
            description : { type: new GraphQLNonNull(GraphQLString) },
            remark: { type: GraphQLString }
            })
        }) 
      ),
    }, 
    remark: { type: GraphQLString }
  }
}); 

module.exports = InputType;
 