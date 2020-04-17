const util = require('../lib/util');
const jwtToken = require('../lib/jwt_token');
const humps = require('humps');
const crypto = require('crypto'); 

module.exports = pgPool => {
  return {
    geUserInfoByToken(token) {
      const queryString = `select * from users where token = $1`;
      return pgPool.query(queryString, [token]).then(res => { 
        return humps.camelizeKeys(res.rows[0]);
      }).catch();  
    },
    getAuthenticationInfo({ username, password }) {
      const queryString = `select * from users where username = $1 and password = $2`; 
      return pgPool.query(queryString, [username,password]).then(res => { 
        if (res.rows[0]){ 
          const playload = jwtToken.setTokenAccess(res.rows[0]);  
          const authenInfo =  {
            token: jwtToken.signToken(playload),
            status: 200,
            message: 'success' 
          } 
          return authenInfo
        }else{ 
          const authenInfo =  { 
            status: 900,
            message: 'Authentication fail!' 
          } 
          return  authenInfo;
        } 
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
          const authenInfo =  {
            token: jwtToken.signToken(playload),
            status: 200,
            message: 'success' 
          } 
          return authenInfo
        }else{ 
          const authenInfo =  { 
            status: 901,
            message: 'Your current password "'+oldpassword+'" is not currect '
          } 
          return  authenInfo;
        }  
      });
    },

    getUsersByIds(userIds) {
      const queryString = `select * from users where id = ANY($1)`;
      return pgPool.query(queryString, [userIds]).then(res => {
        return util.orderedFor(res.row, userIds, 'id', true); 
      });
    }, 

    getSigninUserByToken() {
      const queryString = `select username,password,email,facebook,website,instagram from users where token = $1`;
      return pgPool.query(queryString, global.token).then(res => {
        //console.log(res.rows[0]);
        global.userInfo = humps.camelizeKeys(res.rows[0]);
        //return humps.camelizeKeys(res.rows[0]);
      });
    },

    addNewRecord({ username, password, email }) {
      const token = crypto.createHash('md5').update(username).digest("hex"); 
      const unqueValueColumn = token; 
      const sqlString = `
                insert into users
                (username, password, email, token)
                select $1, $2, $3, $4 
                where not exists (select 1 from users where token = $5 )
                returning *
                `;
                
      return pgPool.query(sqlString, [username, password, email,token,unqueValueColumn]).then(res => { 
        if (res.rows[0]){
          const user = humps.camelizeKeys(res.rows[0]);
          const playload = jwtToken.setTokenAccess(res.rows[0]); 
                            user.token = jwtToken.signToken(playload); 
          return user;
        }else{
          return 'not found';
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
        const response = humps.camelizeKeys(res.rows[0]);
        return response;
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