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
        const identifier = await agent.didManagerGetByAlias({
           alias: alias,
           provider: provider
         })
         if (!identifier) throw Error('Identifier not found')
         resolve(identifier)
     }catch (error) {
      reject(' ');
  }
      
  })
};

export const didCreate =  async (provider:string,alias:string) => {
  return new Promise(async(resolve, reject) => {

     try{
      const issuer = await agent.didManagerGetOrCreate({ provider: provider, alias: alias })
         if (!identifier) throw Error('Identifier not found')
         resolve(identifier)
     }catch (error) {
      reject(error);
  }
      
  })
};
