import  {Router} from 'express'
import createError from 'http-errors'
// import moment from 'moment'
// import {didimportants} from '../config/importants'
// // import {loggerWeb} from '../config/logger');
import {createSchema,getSchemaDetails,getAllSchemaDetails,getDidDetails,createDid,checkDid,createCredential} from '../controllers/issue.controller.ts'
// // import {verifySign} from '../middleware/verify.middleware');
import bodyParser from 'body-parser'


import  agent from '../setup-local.ts'
import { json } from 'stream/consumers';
import { webLogger } from '../config/logger.js';

// import {uuid} from 'uuid'
// import mainApp from '../app.js'

// import fs from 'fs'

// import path from 'path'




 
// import config from '../config/configuration.json')
const verifierRouter = Router();

verifierRouter.post('/verify', async (req,res,next)=>{
  try {
      // loggerWeb.info(`Schema Name: ${req.params.schemaName}`);

      const credential = req.body.credential
      const verified = await agent.verifyCredential({ credential })
      console.log(`Credential verified: ${verified.verified}`)
    console.log('asdas')
      if(verified.verified == true){
        console.log('hello')
        console.log(verified.verified,true)
        res.status(200).json({success:true, data: verified, message: 'verification', status:200});
      }else{
        res.status(400).json({success:false, data: verified, message: 'verification failed', status:400});
      }
     
  } catch (error) {
      next(error);
  }
});


export default verifierRouter 
