import  {Router} from 'express'
import createError from 'http-errors'
// import moment from 'moment'
// import {didimportants} from '../config/importants'
// // import {loggerWeb} from '../config/logger');
import {createSchema,getSchemaDetails,getAllSchemaDetails} from '../controllers/issue.controller.ts'
// // import {verifySign} from '../middleware/verify.middleware');
import bodyParser from 'body-parser'
import {} from '../controllers/issue.controller.ts'

import  agent from '../setup-local.ts'
import { json } from 'stream/consumers';
import { sdkLogger } from '../config/logger.js';


export const  getDid =async (provider:string,alias:string) => {
  return new Promise(async(resolve, reject) => {

     try{
      console.log(1)
        const identifier = await agent.didManagerGetByAlias({
           alias: alias,
           provider: provider
         })
         console.log(2)
         if (!identifier) throw Error('Identifier not found')
         resolve(identifier)
     }catch (error) {
      console.log(3)
      resolve(' ');
  }
      
  })
};

export const didCreate =  async (provider,alias:string) => {
  return new Promise(async(resolve, reject) => {

     try{
      const issuer = await agent.didManagerGetOrCreate({ provider: provider, alias: alias })
        
         resolve(issuer)
     }catch (error) {
      reject(error);
  }
      
  })
};

export const didCheck = async (did) =>{
  return new Promise(async(resolve, reject) => {

    try{
     console.log(1)
       const identifier = await agent.didManagerGet({did : did})
        console.log(2)
        if (!identifier) throw Error('Identifier not found')
        resolve(identifier)
    }catch (error) {
     console.log(3)
     resolve(' ');
 }
     
 })

}


export const createCredentials = async (data,vcParams) =>{
  return new Promise(async(resolve, reject) => {

    try{
     console.log(1)
     const credentials= await agent.createVerifiableCredential({
      credential: {
        issuer: { id: vcParams.issuerDid },
        metaData : {didMethod : vcParams.issuerDid.split(':')[1] },
        credentialSubject: data,
      },
      proofFormat: 'jwt',
    })
        if (!credentials) throw Error('Identifier not found')
        resolve(credentials)
    }catch (error) {
  
      reject(error);

 }
     
 })

}

