var express = require('express');
var router = express.Router(); 
const graphqlHTTP = require('express-graphql');

const DataLoader = require('dataloader'); 
const pgPool = require('../src/lib/dbConnect');
const searchModel = require('../src/models/searchModel')(pgPool);
 
router.post('/', (req, res) => {  // juset test  
  res.send('my  API route');
});  

router.use('/login', (req, res) => {
  const ncSchemalogin = require('../src/schema/users/login');
  const loaders = {};
  graphqlHTTP({
    schema: ncSchemalogin,
    graphiql: true,
    context: { pgPool, loaders }
  })(req, res);
}); 


router.use('/user', (req, res) => {
  const ncSchemaUser = require('../src/schema/users');
  const loaders = {};
  graphqlHTTP({
    schema: ncSchemaUser,
    graphiql: true,
    context: { pgPool, loaders }
  })(req, res);
});
 
router.use('/recipe', (req, res) => {
  const ncSchemaUser = require('../src/schema/recipes'); 
  const loaders = {};
    graphqlHTTP({
      schema: ncSchemaUser,
      graphiql: true,
      context: { pgPool, loaders }
    })(req, res);
  });
    

router.use('/ingredient', (req, res) => {
  const ncSchemaUser = require('../src/schema/ingredient');
  const loaders = {};
  graphqlHTTP({
    schema: ncSchemaUser,
    graphiql: true,
    context: { pgPool, loaders }
  })(req, res);
});

router.use('/category', (req, res) => {
  const ncSchemaUser = require('../src/schema/categories');
  const loaders = {};
  graphqlHTTP({
    schema: ncSchemaUser,
    graphiql: true,
    context: { pgPool, loaders }
  })(req, res);
});

router.use('/search', (req, res) => {
  const ncSchemaUser = require('../src/schema/search');
  const loaders = { 
    categoryByIds: new DataLoader(searchModel.getLoaderCategoryByIds),
    recipeByIds: new DataLoader(searchModel.getLoaderRecipesByIds), 
    howtoByRecipeIds: new DataLoader(searchModel.getLoaderHowtoByRecipeIds),
    usersByIds: new DataLoader(searchModel.getLoaderUsersByIds),
    };
  graphqlHTTP({
    schema: ncSchemaUser,
    graphiql: true,
    context: { pgPool, loaders }
  })(req, res);
});

module.exports = router;