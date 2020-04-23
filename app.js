const express = require('express');
const app = express();
const pgPool = require('./src/lib/dbConnect');

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: 'development.env' })
} 

//#1 get user authentication
app.use((req) => {
  getuserLoginInfo(req,pgPool); 
}); 

app.get('/', (req, res) => {
  res.send('welcome to my route API');
}); 

// all APIs are in foutes
var index = require('./routes/index');
app.use('/api', index); 


// Default port is 8000 / development.env
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

//#1 Check Token value
const jwtToken = require('./src/lib/jwt_token'); 
async function getuserLoginInfo(req,pgPool) {
  const tokenAccess = jwtToken.getTokenAccess(req);
  if (tokenAccess){
    const val = jwtToken.verify(tokenAccess); 
    global.token = val.token;  
    const userModel = require('./src/models/usersModel')(pgPool);   
     return await userModel.geUserInfoByToken(global.token).then(function(res) {
       if (res) {
        global.userLoginInfo = res;
        global.UserId = global.userLoginInfo.id;
        global.isAuthen = true;
      }else global.isAuthen = false;    
      req.next();
    });
  }else {
    req.next();
  }
}