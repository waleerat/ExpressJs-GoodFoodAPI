const jwt   = require('jsonwebtoken');

module.exports = {
  signToken: (payload) => {
  // Token signing options
  return jwt.sign(payload , process.env.JWT_KEY);
/*   return new Promise(resolve => {
    resolve(jwt.sign(payload , process.env.JWT_KEY))
  }) */
 /*  var signOptions = {  // ** Note: not sure how it works
    issuer:  process.env.ISSUER,
    subject:  process.env.SUBJECT,
    audience:  process.env.AUDIENCE,
    expiresIn:  process.env.EXPIRES_IN, 
    algorithm:  process.env.ALGORITHM    
  };
  return jwt.sign(payload, process.env.JWT_KEY, signOptions); */
},
verify: (token) => {
  var verifyOptions = {
    issuer:  process.env.ISSUER,
    subject:  process.env.SUBJECT,
    audience:  process.env.AUDIENCE,
    expiresIn:  process.env.EXPIRES_IN, 
    algorithm:  process.env.ALGORITHM    
  };
   try{
     return jwt.verify(token, process.env.JWT_KEY, verifyOptions);
   }catch (err){
     return false;
   }
},
setTokenAccess: (user) => {
  const playload = { 
    'username' : user['username'],
    'token' : user['token']
  }; 
  return playload;
},
getTokenAccess: (req) => {
  if (req.headers.authorization && req.headers.authorization.includes('Bearer')) {
    return req.headers.authorization.split(' ')[1]
  }else return false;
},
 decode: (token) => {
  return jwt.decode(token, {complete: true});
 }
}