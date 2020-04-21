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

/*     getUsersById(userId) {
      const queryString = `select * from users where id =$1`; 
      return  pgPool.query(queryString, [userId]).then(res => { 
        return  humps.camelizeKeys(res.rows[0]);
      });

    }, */

    geUserInfoByToken(token) {
      const queryString = `select * from users where token = $1`;
      return pgPool.query(queryString, [token]).then(res => { 
        return humps.camelizeKeys(res.rows[0]);
      }).catch();  
    },
/*     getSigninUserByToken() {
      const queryString = `select username,password,email,facebook,website,instagram from users where token = $1`;
      return pgPool.query(queryString, global.token).then(res => {
        //console.log(res.rows[0]);
        global.userInfo = humps.camelizeKeys(res.rows[0]);
        //return humps.camelizeKeys(res.rows[0]);
      });
    },  */
    getAuthenticationInfo({ username, password }) {
      let returnRoot = {}
      let responseArr = [];
      let responseStatusTag = {};

      const queryString = `select * from users where username = $1 and password = $2`; 
      return pgPool.query(queryString, [username,password]).then(res => { 
        if (res.rows[0]){ 
          console.log(res.rows[0]);
          
          const authenInfo = humps.camelizeKeys(res.rows[0]);
          const playload = jwtToken.setTokenAccess(res.rows[0]); 
          
          authenInfo.token = jwtToken.signToken(playload);  
          returnRoot = authenInfo;
          responseStatusTag = util.getResponseStatusTag(200); 
          responseArr.push(responseStatusTag); 
          returnRoot.responseStatus=responseArr; 
        }else{   
          responseStatusTag = util.getResponseStatusTag(900); 
          responseArr.push(responseStatusTag); 
          returnRoot.responseStatus=responseArr; 
        }
        console.log(returnRoot);
        
        return returnRoot; 
      }); 
    },
    changePassword({ oldpassword, newpassword }) {
      const sqlString = `
            update users set 
            password =$3
            where password = $2 and token = $1
            returning *
            `; 
      return pgPool.query(sqlString , [global.token,oldpassword, newpassword]).then(res => {
        if (res.rows[0]){ 
          const playload = jwtToken.setTokenAccess(res.rows[0]);  
          let responseStatusTag={}
          responseStatusTag.token = jwtToken.signToken(playload),
          responseStatusTag = util.getResponseStatusTag(200); 
          return responseStatusTag
        }else{ 
          let responseStatusTag = util.getResponseStatusTag(901);
          responseStatusTag.message = responseStatusTag.message.replace('#oldPassword#',oldpassword);  
          return  responseStatusTag;
        }  
      });
    }, 
    async saveRecord(i){ 
      let savedUserinfo = {};
      let returnRoot = {}
      let responseArr = [];
      let responseStatusTag = {};

      i.token = crypto.createHash('md5').update(i.username).digest("hex"); 

      let isEmailFormat = validation.emailFormat(i.email);
      
      if (isEmailFormat){
         savedUserinfo = await this.saveUser(i); 
        //console.log(savedUserinfo); 
        if (savedUserinfo) { 
          console.log('savedUserinfo');
        
          returnRoot = savedUserinfo;
          console.log(returnRoot);
          responseStatusTag = util.getResponseStatusTag(200);  
        }else{
          responseStatusTag = util.getResponseStatusTag(903);  
        } 
      }else{
        responseStatusTag = util.getResponseStatusTag(913);  
      } 
       // return value 
      responseArr.push(responseStatusTag); 
      returnRoot.responseStatus=responseArr;
      return returnRoot;
    }, 
    saveUser(i){
      let sqlString = `
      INSERT INTO  users (username, password, email, token) VALUES ($1, $2, $3,$4)
                ON CONFLICT (token) DO NOTHING
                returning *
    `;  
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
      const sqlString = `
            update users set 
            first_name =$2, last_name =$3, image  =$4, facebook =$5, website =$6, instagram =$7
            where token = $1
            returning *
            `;
          
      return pgPool.query(sqlString , [global.token,firstName,lastName,image,facebook,website,instagram]).then(res => { 
        let returnRoot = {};
        let responseArr = [];
        let responseStatusTag = {}; 
        if (res.rows[0]){  
          returnRoot = humps.camelizeKeys(res.rows[0]);
          responseStatusTag = util.getResponseStatusTag(200);
        }else{ 
          responseStatusTag = util.getResponseStatusTag(904); 
        } 
        responseArr.push(responseStatusTag); 
        returnRoot.responseStatus=responseArr;
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