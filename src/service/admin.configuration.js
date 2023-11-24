
const constants = require('../config/configuration.json')
// const {API} = require('../utils/api')
const axios = require('axios');
const qs = require('qs');
const { API } = require('../utils/api');
const { Token } = require('aws-sdk');



exports.getAccesToken = async (req,res) =>{

    return new Promise(async(resolve, reject) => {
        
    
    //    const axiosInstance = new API(url,headers);
    data = qs.stringify({
    'client_id': constants.azClientId,
    'scope': constants.scope,
    'client_secret': constants.azClientSecret,
    'grant_type': constants.grant_type 
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${constants.loginUrl}/${constants.azTenantId}/oauth2/v2.0/token`,
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded'    },
    data : data
  };
  
  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
    result=response.data

    resolve(result) 
  })
  .catch((error) => {
    reject(error)
    console.log(error);
  });   
        
    })
}

exports.getAuthorities= async(req,res)=>{
    return new Promise(async(resolve, reject) => {

      console.log(req)
  
        const accessToken = req.headers.authorization
        console.log(accessToken)

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `${constants.vcUrl}/verifiableCredentials/authorities`,
  headers: { 
    'Authorization': accessToken, 
    'Content-Type': 'application/json'
  }
};

console.log(config)

    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      resolve(response.data)
    })
    .catch((error) => {
      console.log(error);
      reject(error)
    });

    })    
}


exports.getcontracts = async(req,res)=>{
    return new Promise(async(resolve, reject) => {


  
        const accessToken = req.headers.authorization
        console.log(accessToken)
        console.log('----------------------------=============================================--------------------------------')
        const authorizationId = req.query.authorizationId
        const contractId = req.query.contractId?req.query.contractId: null;
        let urlConfig
        if(contractId){
            urlConfig = `${constants.vcUrl}/verifiableCredentials/authorities/${authorizationId}/contracts/${contractId}`
        }else{
            urlConfig = `${constants.vcUrl}/verifiableCredentials/authorities/${authorizationId}/contracts`
        }

        console.log(urlConfig)    

        let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: urlConfig,
        headers: { 
            'Authorization': accessToken, 
            'Content-Type': 'application/json'
        }
        };



    axios.request(config)
    .then((response) => {
    //   console.log(JSON.stringify(response.data));
      resolve(response.data)
    })
    .catch((error) => {
      console.log(error);
      reject(error)
    });

    })    
}

exports.getOnboard = async(req,res)=>{
  return new Promise(async(resolve, reject) => {



      const accessToken = req.headers.authorization
      console.log(accessToken)
      console.log('----------------------------=============================================--------------------------------')
      const authorizationId = req.query.authorizationId
  
   
     
     
        let  urlConfig = `${constants.vcUrl}/verifiableCredentials/onboard`
 
      console.log(urlConfig)    

      let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: urlConfig,
      headers: { 
          'Authorization': accessToken, 
          'Content-Type': 'application/json'
      }
      };



  axios.request(config)
  .then((response) => {
  //   console.log(JSON.stringify(response.data));
    resolve(response.data)
  })
  .catch((error) => {
    console.log(error);
    reject(error)
  });

  })    
}

exports. generateDidDocument = async(req,res)=>{
  return new Promise(async(resolve, reject) => {



      const accessToken = req.headers.authorization
      console.log(accessToken)
      console.log('----------------------------=============================================--------------------------------')
      const authorizationId = req.query.authorizationId
  
   
     
     
         let urlConfig = `${constants.vcUrl}/verifiableCredentials/authorities/${authorizationId}/generateDidDocument`
 
      console.log(urlConfig)    

      let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: urlConfig,
      headers: { 
          'Authorization': accessToken, 
          'Content-Type': 'application/json'
      }
      };



  axios.request(config)
  .then((response) => {
  //   console.log(JSON.stringify(response.data));
    resolve(response.data)
  })
  .catch((error) => {
    console.log(error);
    reject(error)
  });

  })    
}
