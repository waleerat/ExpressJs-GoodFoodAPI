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
    //-----Start-------
    slug: { type: GraphQLString },
    title: { type: new GraphQLNonNull(GraphQLString)},
    description: { type: GraphQLString },
    image: { type: GraphQLString },
    category: { type: new GraphQLList(
      // ingredient
      new GraphQLInputObjectType({
        name: 'categoryType',
        fields: () => ({
          slug: { type: GraphQLString },
          title: { type: new GraphQLNonNull(GraphQLString) },
          image: { type: GraphQLString },
          description: { type: GraphQLString },
          })
      }) 
      // ingredient
    )},

    ingredients: {
      type: new GraphQLList( 
        // ingredient
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
        // ingredient
      ),
    }, 

    howto: {
      type: new GraphQLList( 
        // ingredient
        new GraphQLInputObjectType({
          name: 'howtoType',
          fields: () => ({
            order: { type: new GraphQLNonNull(GraphQLInt) },
            title: { type: new GraphQLNonNull(GraphQLString) },
            image: { type: GraphQLString },
            description : { type: new GraphQLNonNull(GraphQLString) },
            remark: { type: GraphQLString }
            })
        }) 
        // ingredient
      ),
    }, 
 
    remark: { type: GraphQLString }
    //-----End-------
  }
}); 

module.exports = InputType;
 