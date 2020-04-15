const express = require('express');
const app = express();

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: 'development.env' })
}
 
// Check Token value
const jwtToken = require('./src/lib/jwt_token'); 
app.use((req) => {
  const tokenAccess = jwtToken.getTokenAccess(req);
  if (tokenAccess){
    const val = jwtToken.verify(tokenAccess); 
    global.token = val.token;
    req.next();
  }else{ 
    console.log('no token');
    req.next();
  }

}); 

app.get('/', (req, res) => {
  res.send('welcome to my route API');
}); 
var index = require('./routes/index');
app.use('/api', index); 


// #000 Port section
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
// #000 Port section End