const util = require('../lib/util');
const validation = require('../lib/validation');
const jwtToken = require('../lib/jwt_token');
const humps = require('humps');
const bcrypt = require('bcrypt');


module.exports = pgPool => {
  return {
    getUsersByIds(userIds) {
      const queryString = `select * from users where id = ANY($1)`;
      return pgPool.query(queryString, [userIds]).then(res => { 
        return util.orderedFor(res.rows, userIds, 'id', true); 
      });
    },
    geUserInfoByToken(token) {
      const queryString = `select * from users where token = $1`;
      return pgPool.query(queryString, [token]).then(res => { 
        return humps.camelizeKeys(res.rows[0]);
      }).catch();  
    },
    getAuthenticationInfo({ username, password }) { 
      const queryString = `select * from users where username = $1 and password = $2`; 
      return pgPool.query(queryString, [username,password]).then(res => { 
        let returnRoot = {}
        let responseStatusTag = {};
        if (res.rows[0]){
          const user = humps.camelizeKeys(res.rows[0]);
          const playload = jwtToken.setTokenAccess(res.rows[0]); 
          user.token = jwtToken.signToken(playload); 
          returnRoot = user;
          responseStatusTag = util.getResponseStatusTag(200);
        } else {
          responseStatusTag = util.getResponseStatusTag(900);  
        }
        returnRoot.responseStatus = responseStatusTag; 
       // console.log(returnRoot);
        return returnRoot;
      });
      
    }, 
    async signIn(i){
      let returnRoot = {}
      let responseStatusTag = {};
      // get userId by username
      let queryString = `select * from users where username = $1`;
      let res = await pgPool.query(queryString, [i.username]);
      if (res.rows[0]){
        // check status 
        if (res.rows[0].approved === 'approved'){
          let user = humps.camelizeKeys(res.rows[0]);
          queryString = `select * from user_bcrypt where user_id = $1 and username = $2`; 
          // get bcrypt
          let userBcrypt = await pgPool.query(queryString, [user.id,user.username]);     
          if (userBcrypt.rows[0]){
              let b = userBcrypt.rows[0];
              let HashInputPassword = await this.getUserHash(i.password, b.salt);
              // check password
              if (HashInputPassword === b.hash){  
                const playload = jwtToken.setTokenAccess(user); 
                user.token = jwtToken.signToken(playload); 
                returnRoot = user;
                this.saveAuthenToken(user.id,user.token);
                responseStatusTag = util.getResponseStatusTag(200);
              }else{
                responseStatusTag = util.getResponseStatusTag(905); 
              }
          }else{
            responseStatusTag = util.getResponseStatusTag(906); 
            
          }
        }else{
          responseStatusTag = util.getResponseStatusTag(907); 
        }
      }else{
        responseStatusTag = util.getResponseStatusTag(908);
      }
      returnRoot.responseStatus = responseStatusTag; 
       console.log(returnRoot);
       return returnRoot;
    },
    async saveRecord(i){ 
      let savedUserinfo = {};
      let returnRoot = {}
      let responseStatusTag = {}; 
      
      let isEmailFormat = validation.emailFormat(i.email);
      if (isEmailFormat){
         savedUserinfo = await this.saveUser(i); 
        
        if (savedUserinfo) { 
          returnRoot = savedUserinfo;
          responseStatusTag = util.getResponseStatusTag(200);  
        }else{
          responseStatusTag = util.getResponseStatusTag(903);  
        } 
      }else{
        responseStatusTag = util.getResponseStatusTag(913);  
      } 
       // return value 
      returnRoot.responseStatus=responseStatusTag;
      return returnRoot;
    }, 
    saveUser(i){
      i.token = util.encodeMD5(util.makeid(10)); 
      let sqlString = `INSERT INTO  users (username, email, token) VALUES ($1, $2, $3)
        ON CONFLICT (username) DO NOTHING
        returning *`;  
      return pgPool.query(sqlString, [i.username, i.email,i.token])
        .then(res => {  
          if (res.rows[0]){  
            const user = humps.camelizeKeys(res.rows[0]);
            const playload = jwtToken.setTokenAccess(res.rows[0]); 
            user.token = jwtToken.signToken(playload);
            this.saveAuthenToken(user.id,user.token);
            this.savebcryptPassword(user.id,user.username,i.password);
            return user;
          }
        });
    },
    saveAuthenToken(userId,token){ 
      let sqlString = `INSERT INTO  authen_token (user_id, http_token) VALUES ($1, $2)
                      ON CONFLICT (user_id) DO UPDATE SET http_token=$2`; 
      pgPool.query(sqlString, [userId, token]);
      
    },
    savebcryptPassword(user_id,username,password){
      let min = 1; let max = 10; 
      let salt_rounds = Math.floor(Math.random() * (max - min) ) + min;
      bcrypt.genSalt(salt_rounds, function(err, salt) { 
        bcrypt.hash(password, salt, function(err, hash) {
            // Store hash in your password DB.
            let sqlString = `INSERT INTO  user_bcrypt (user_id, username, salt , salt_rounds, hash) VALUES ($1, $2, $3,$4,$5)
            ON CONFLICT (user_id,username) DO UPDATE SET salt=$3, salt_rounds=$4, hash=$5
            returning hash`;   
            pgPool.query(sqlString, [user_id, username, salt, salt_rounds,hash]);
          });
      });
    },
    updateRecord({firstName,lastName,image,facebook,website,instagram}){  
      const sqlString = `update users set first_name =$2, last_name =$3, image  =$4, facebook =$5, website =$6, instagram =$7
            where token = $1
            returning *`;
          
      return pgPool.query(sqlString , [global.token,firstName,lastName,image,facebook,website,instagram]).then(res => { 
        let returnRoot = {};
        let responseStatusTag = {}; 
        if (res.rows[0]){  
          returnRoot = humps.camelizeKeys(res.rows[0]);
          responseStatusTag = util.returnResponseStatusTag(200);
        } else { 
          responseStatusTag = util.returnResponseStatusTag(904); 
        } 
        
        returnRoot.responseStatus=responseStatusTag;
        return returnRoot
      });
    },
    getUserBcrypt() {
      const queryString = `select * from user_bcrypt where user_id = $1 and username = $2`; 
      return pgPool.query(queryString, [global.userLoginInfo.id,global.userLoginInfo.username]).then(res => {  
        return res.rows[0]; 
      });
    },

    async getUserHash(password, salt){
     /*  let r =   bcrypt.hash(password, salt, function(err, hash) {
        return hash;
      }); */
      return  bcrypt.hash(password, salt).then(hash => {
        return hash;
      }); 
      
    },
    async changePassword({ oldpassword, newpassword }) { 
      let returnRoot = {}
      let responseStatusTag = {};
      let userBcrypt = await this.getUserBcrypt();

      if (userBcrypt){
        let HashInputOldPassword = await this.getUserHash(oldpassword, userBcrypt.salt);

        if (HashInputOldPassword === userBcrypt.hash){ 
          let HashInputNewPassword = await this.getUserHash(newpassword, userBcrypt.salt);

          let sqlString = ''; 
          let newToken = util.encodeMD5(util.makeid(10));
          let tokenJson = {"username": userBcrypt.username, "token": newToken}
          const playload = jwtToken.setTokenAccess(tokenJson); 
          returnRoot.token = jwtToken.signToken(playload); 
          // update authen token
           this.saveAuthenToken(userBcrypt.user_id,returnRoot.token); 
          // update user token
          sqlString = `update users set token =$1  where id = $2`; 
          pgPool.query(sqlString , [newToken, userBcrypt.user_id]);
          // update hash 
          sqlString = `update user_bcrypt set hash =$1  where user_id = $2 and salt = $3`; 
          pgPool.query(sqlString , [HashInputNewPassword, userBcrypt.user_id, userBcrypt.salt]); 
          responseStatusTag = util.getResponseStatusTag(200); 
        }else{
          responseStatusTag = util.getResponseStatusTag(901);               
        }
          responseStatusTag.message = responseStatusTag.message.replace('#oldPassword#',oldpassword); 
          returnRoot.responseStatus = responseStatusTag; 
          //console.log(returnRoot);
          return returnRoot;  
      } else {
        responseStatusTag = util.getResponseStatusTag(901);
        responseStatusTag.message = responseStatusTag.message.replace('#oldPassword#',oldpassword); 
        returnRoot.responseStatus = responseStatusTag; 
        return returnRoot; 
      }
      
    }, 
    deleteRecord(tokens){
      const sqlString = ` delete from users where token = ANY($1) returning * `; 
      return pgPool.query(sqlString ,[tokens]).then(res => {
        return humps.camelizeKeys(res.rows[0]);
      });
    }
  } 
}