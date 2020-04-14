var express = require('express');
var router = express.Router(); 
const graphqlHTTP = require('express-graphql');

const DataLoader = require('dataloader'); 
const pgPool = require('../src/lib/dbConnect');
const userModel = require('../src/models/usersModel')(pgPool);  
const recipesModel = require('../src/models/recipesModel')(pgPool); 
const jwtToken = require('../src/lib/jwt_token');
 
 
router.post('/authen', (req, res) => {  // juset test  
   const tokenAccess = jwtToken.getTokenAccess(req); 
   
   if (tokenAccess){
     jwtToken.verify(tokenAccess); 
    res.sendStatus(200);
   }else{
    res.sendStatus(403);
   }
});  

router.use('/login', (req, res) => {
  const ncSchemalogin = require('../src/schema/users/login');
  const loaders = {
    usersByIds: new DataLoader(userModel.getUsersByIds),
  };
  graphqlHTTP({
    schema: ncSchemalogin,
    graphiql: true,
    context: { pgPool, loaders }
  })(req, res);
}); 


router.use('/user', (req, res) => {
  const ncSchemaUser = require('../src/schema/users');
  const loaders = {
    usersByIds: new DataLoader(userModel.getUsersByIds),
  };
  graphqlHTTP({
    schema: ncSchemaUser,
    graphiql: true,
    context: { pgPool, loaders }
  })(req, res);
});

router.use('/recipe', (req, res) => {
  const ncSchemaUser = require('../src/schema/recipes/index');
  const loaders = {
    ingredientsByRecipeIds: new DataLoader(recipesModel.getIngredientsByRecipeId),
    howtoByRecipeIds: new DataLoader(recipesModel.getHowtoByRecipeIds),
    usersByIds: new DataLoader(userModel.getUsersByIds),
  };
   
  graphqlHTTP({
    schema: ncSchemaUser,
    graphiql: true, 
    context: { pgPool, loaders }
  })(req, res);
});


router.use('/simple', (req, res) => {
  const ncSchemaUser = require('../src/schema/sample-shema');
  graphqlHTTP({
    schema: ncSchemaUser,
    graphiql: true
  })(req, res);
});

module.exports = router;