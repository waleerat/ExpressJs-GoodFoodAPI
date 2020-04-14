const jwt = require('jsonwebtoken')
const signToken = str => {
  return new Promise(resolve => {
    resolve(jwt.sign({ apiKey: str }, process.env.JWT_KEY))
  })
}
const verifyJwt = req => { 
  let token
  if (req.query && req.query.hasOwnProperty('access_token')) {
    token = req.query.access_token
  } else if (req.headers.authorization && req.headers.authorization.includes('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
      if (error) reject('401: User is not authenticated')
   
      resolve(decoded)
    })
  }) 
}

const getTokenValues = req => {
  const base64 = require('base64url');
  req.headers.authorization = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnB1dCI6eyJ1c2VybmFtZSI6IndhbGVlcmF0MiIsInBhc3N3b3JkIjoid2FsZWVyYXQifX0.gd7SCO3UuI5-PbZq8EMwa2_XZ2tKevbNqAYIH5SnFmY';
  const JWT_BASE64_URL = req.headers.authorization;
  //const JWT_BASE64_URL = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnB1dCI6eyJ1c2VybmFtZSI6IndhbGVlcmF0MiIsInBhc3N3b3JkIjoid2FsZWVyYXQifX0.gd7SCO3UuI5-PbZq8EMwa2_XZ2tKevbNqAYIH5SnFmY';
  // Returns an array of strings separated by the period
  const jwtParts = JWT_BASE64_URL.split('.');
  const headerInBase64UrlFormat = jwtParts[0];
  const payloadInBase64UrlFormat = jwtParts[1];
  const signatureInBase64UrlFormat = jwtParts[2];
  
  const decodedHeader = base64.decode(headerInBase64UrlFormat);
  const decodedPayload = base64.decode(payloadInBase64UrlFormat);
  const decodedSignature = base64.decode(signatureInBase64UrlFormat);

  if (decodedSignature === process.env.JWT_KEY){
    console.log('.... Right Signager *****');
  }
  
  console.log(decodedHeader);
  //console.log(decodedPayload);
  console.log(decodedSignature);
  return decodedPayload;
}


const authenticateJWT = req => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, process.env.JWT_KEY, (err) => {
          if (err) {
              return res.sendStatus(403);
          }

         return "ok!!!"; 
      });
  } else {
    return res.sendStatus(401);
  }
};


module.exports = { signToken, verifyJwt,authenticateJWT,getTokenValues }