const util = require('../lib/util');
const validation = require('../lib/validation');
const jwtToken = require('../lib/jwt_token');
const humps = require('humps');
const crypto = require('crypto'); 

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
    changePassword({ oldpassword, newpassword }) {
      const sqlString = `update users set password =$3
        where password = $2 and token = $1
        returning username
        `; 
      return pgPool.query(sqlString , [global.token,oldpassword, newpassword]).then(res => {
        let returnRoot = {}
        let responseStatusTag = {};
        if (res.rows[0]){ 
          const user = humps.camelizeKeys(res.rows[0]);
          returnRoot = user;
          responseStatusTag = util.getResponseStatusTag(200); 
        } else { 
          responseStatusTag = util.getResponseStatusTag(901); 
        } 
        responseStatusTag.message = responseStatusTag.message.replace('#oldPassword#',oldpassword); 
        returnRoot.responseStatus = responseStatusTag; 
       // console.log(returnRoot);
        return returnRoot;
      });
    }, 
    async saveRecord(i){ 
      let savedUserinfo = {};
      let returnRoot = {}
      let responseStatusTag = {};

      i.token = crypto.createHash('md5').update(i.username).digest("hex"); 
      let isEmailFormat = validation.emailFormat(i.email);
      if (isEmailFormat){
         savedUserinfo = await this.saveUser(i); 
        //console.log(savedUserinfo); 
        if (savedUserinfo) { 
          returnRoot = savedUserinfo; 
          //console.log(returnRoot);
          responseStatusTag = util.returnResponseStatusTag(200);  
        }else{
          responseStatusTag = util.returnResponseStatusTag(903);  
        } 
      }else{
        responseStatusTag = util.returnResponseStatusTag(913);  
      } 
       // return value 
      returnRoot=responseStatusTag;
      return returnRoot;
    }, 
    saveUser(i){
      let sqlString = `INSERT INTO  users (username, password, email, token) VALUES ($1, $2, $3,$4)
        ON CONFLICT (token) DO NOTHING
        returning *`;  
      return pgPool.query(sqlString, [i.username, i.password, i.email,i.token])
        .then(res => {  
          if (res.rows[0]){
            const user = humps.camelizeKeys(res.rows[0]);
            const playload = jwtToken.setTokenAccess(res.rows[0]); 
            user.token = jwtToken.signToken(playload); 
            return user;
          }
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
    deleteRecord(tokens){
      const sqlString = ` delete from users where token = ANY($1)
        returning *
        `; 
      return pgPool.query(sqlString ,[tokens]).then(res => {
        return humps.camelizeKeys(res.rows[0]);
      });
    }
  } 
}