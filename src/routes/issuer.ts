import  {Router} from 'express'
import createError from 'http-errors'
// import moment from 'moment'
// import {didimportants} from '../config/importants'
// // import {loggerWeb} from '../config/logger');
import {createSchema,getSchemaDetails,getAllSchemaDetails,getDidDetails,createDid,checkDid,createCredential} from '../controllers/issue.controller.js'
// // import {verifySign} from '../middleware/verify.middleware');
import bodyParser from 'body-parser'


import  agent from '../setup-local.js'
import { json } from 'stream/consumers';
import { webLogger } from '../config/logger.js';

// import {uuid} from 'uuid'
// import mainApp from '../app.js'

// import fs from 'fs'

// import path from 'path'




 
// import config from '../config/configuration.json')
const issueRouter = Router();





// const apiKey = uuid.v4();
// function requestTrace( req ) {
//     var dateFormatted = new Date().toISOString().replace("T", " ");
//     var h1 = '//****************************************************************************';
//     console.log( `${h1}\n${dateFormatted}: ${req.method} ${req.protocol}://${req.headers["host"]}${req.originalUrl}` );
//     console.log( `Headers:`)
//     console.log(req.headers);
//   }

var agents;


issueRouter.get('/getDid', async (req,res,next)=>{
    try {
        const provider: any = req.query.provider
        const alias: any = req.query.alias
        const identifier = await getDidDetails(provider,alias)
         if(identifier != ' '){
            res.status(200).json({success:true, data:identifier, status:200});
         }else{
            res.status(200).json({success:true, data:'identifier not found', status:200});
         }

    } catch (error) {
        // res.status(200).json({success:true, data:'identifer not found', status:200});
        next(error)
    }
});
  

issueRouter.get('/CreateDid', async (req,res,next)=>{
    try {
        const provider: any = req.query.provider
        const alias: any = req.query.alias
        const identifier = await getDidDetails(provider,alias)

        if(!identifier){
            res.status(400).json({success:true, data:identifier, status:200});
         }else{
            const did = await createDid(provider,alias)
            res.status(200).json({success:true, data:did, status:200});
         }     
    } catch (error) {
        next(error);
    }
});

issueRouter.get('/userDid', async (req,res,next)=>{
    try {
        const provider: any = req.query.provider
        const alias: any = req.query.alias
        const identifier = await getDidDetails(provider,alias)

        if(!identifier){
            res.status(400).json({success:true, data:identifier, status:200});
         }else{
            const did = await createDid(provider,alias)
            res.status(200).json({success:true, data:did, status:200});
         }     
    } catch (error) {
        next(error);
    }
});


issueRouter.post('/createCredential', async (req,res,next)=>{
    try {
        const issuerDid =  req.body.issuerDid   
        const isDidValid = await checkDid(issuerDid)

        if (isDidValid == ' '){
            res.status(500).json({success:false, data: 'did is not valid', message: 'error in issuer did', status:201});
            
        }
        const jsonSchema = await getSchemaDetails(req.body.schemaName);
            if(!jsonSchema){
                throw createError(400, 'Invalid Schema');
            }


     

        const credential = await createCredential(req.body.credentialSubject, {documentType: req.body.schemaName,schemaUrl: `${req.protocol}://${req.headers.host}/schema/${jsonSchema.schemaName}`,
            schema: jsonSchema,
            userDid: req.body.id,
            issuerDid:issuerDid
        })

       
        const data = credential

        res.status(201).json({success:true, data:data, message: 'credential created and submited successfully', status:201});
    } catch (error) {
        next(error);
    }
});

issueRouter.post('/verify', async (req,res,next)=>{
    try {
        // loggerWeb.info(`Schema Name: ${req.params.schemaName}`);

        const credential = req.body.credential
        const verified = await agent.verifyCredential({ credential })
        console.log(`Credential verified: ${verified.verified}`)
        res.status(200).json({success:true, data: verified, message: 'verification', status:200});
    } catch (error) {
        next(error);
    }
});
issueRouter.post('/createSchema', async (req,res,next)=>{
    try {
        // webLogger.info(`Schema Details: ${JSON.stringify(req.body)}`);
        const existSchema = await getSchemaDetails(req.body.schemaName);
        if(existSchema){
            throw createError(400,'Schema Creation Failed - Schema Already Exist');
        }
        const jsonSchema = await createSchema(req.body);
        res.status(201).json({success:true, data: jsonSchema, message: 'Schema created and submited successfully', status:201});
    } catch (error) {
        next(error);
    }
});


issueRouter.get('/schemas', async (req,res,next)=>{
    try {
        const jsonSchema = await getAllSchemaDetails();
        res.status(200).json({success:true, data: jsonSchema, message: 'Schema collection retrieved', status:200});
    } catch (error) {
        next(error);
    }
});

issueRouter.get('/schema/:schemaName', async (req,res,next)=>{
    try {
        webLogger.info(`Schema Name: ${req.params.schemaName}`);
        const jsonSchema = await getSchemaDetails(req.params.schemaName);
        res.status(200).json({success:true, data: jsonSchema, message: `${jsonSchema ? 'Schema retrieved' : 'Schema does not exist' }`, status:200});
    } catch (error) {
        next(error);
    }
});

// issueRouter.post('/issuance-request', async (req, res,next) => {
//     try {
//         const jsonSchema = await issuerController.createVCrequest(req,res);
//         res.status(200).json({success:true, data: jsonSchema, message: 'vc', status:200});
//     } catch (error) {
//         next(error);
//     }
// });


// issueRouter.get('/issuance-change-response', async (req, res,next) => {
//     try {

//         const didStorage = path.join(__dirname,'../persistentData/storage/');
//         console.log('-----------------++++++++++++++++++++++++++++++++++---------------------------------------------')


//     let data =fs.readFileSync(path.join(didStorage,'/session'))
//     data = JSON.parse(data)

//      const id = data.sessionID
//        const issuanceResponse = "issuance_successful"
//             var cacheData = {
//               "status" : issuanceResponse,
//               "message": "Credential successfully issued"
//             };



//             mainApp.sessionStore.get( id, (error, session) => {
//                 if ( session ) {
//                   session.sessionData = cacheData;
//                   mainApp.sessionStore.set( id, session, (error) => {
//                     // console.log( "200 - OK");
//                     res.send();
//                   })
//                 }
//                 })
//     } catch (error) {
//         next(error);
//     }
// });

// issueRouter.post('/issuance-request-callback', parser, async (req, res) => {
//     console.log(req.body.data)
//     var body =req.body.data
//     // req.on('data', function (data) {
//     //     console.log(data)
//     //   body += data;
//     // });

//     var issuanceResponse = body
//       var cacheData;
    
   
//       requestTrace( req );
//       console.log( body );
//       // the api-key is set at startup in app.js. If not present in callback, the call should be rejected
//     //   if ( req.headers['api-key'] != apiKey ) {
//     //     res.status(401).json({'error': 'api-key wrong or missing'});  
//     //     return; 
//     //   }
//       var issuanceResponse =body

//       var cacheData;
//       switch ( issuanceResponse.requestStatus ) {
//         // this callback signals that the request has been retrieved (QR code scanned, etc)
//         case "request_retrieved":
//           cacheData = {
//             "status": issuanceResponse.requestStatus,
//             "message": "QR Code is scanned. Waiting for validation..."
//           };
//         break;
//         // this callback signals that issuance of the VC was successful and the VC is now in the wallet
//         case "issuance_successful":
//           var cacheData = {
//             "status" : issuanceResponse.requestStatus,
//             "message": "Credential successfully issued"
//           };
//         break;
//         // this callback signals that issuance did not complete. It could be for technical reasons or that the user didn't accept it
//         case "issuance_error":
//           var cacheData = {
//             "status" : issuanceResponse.requestStatus,
//             "message": issuanceResponse.error.message,
//             "payload": issuanceResponse.error.code
//           };
//         break;
//         default:
//           console.log( `400 - Unsupported requestStatus: ${issuanceResponse.requestStatus}` );
//           res.status(400).json({'error': `Unsupported requestStatus: ${issuanceResponse.requestStatus}`});      
//           return;
//       }
//       console.log(cacheData)
//       res.status(200).json({success:true, data: ssuanceResponse.state , message: 'vc', status:200});

      
//   ;  
// })


// issueRouter.get('/issuance-response', async (req, res) => {
//     var id = req.query.id;
//     requestTrace( req );
//     mainApp.sessionStore.get( id, (error, session) => {
//         console.log(session)
//       if (session && session.sessionData) {
//         console.log(`200 - status: ${session.sessionData.status}, message: ${session.sessionData.message}`);
//         res.status(200).json(session.sessionData);   
//       } else {
//         console.log( `400 - Unknown state: ${id}` );
//         res.status(400).json({'error': `Unknown state: ${id}`});      
//       }
//     })
// })
  
 
// issueRouter.get('/get-manifest', async (req, res) => {
//     var id = req.query.id;
//     requestTrace( req );
//     res.status(200).json(config["manifest"]);   
//   })






export default issueRouter 