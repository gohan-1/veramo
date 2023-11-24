const  {Router} = require('express');
const createError = require('http-errors');
const moment = require('moment');
const {didConstants} = require('../config/constants')
// const {loggerWeb} = require('../config/logger');
const VerifierController = require('../controllers/verifier.controller');
// const {verifySign} = require('../middleware/verify.middleware');
const bodyParser = require('body-parser');

var uuid = require('uuid');

const router = Router();

var mainApp = require('../app.js');




var parser = bodyParser.urlencoded({ extended: false });

const apiKey = uuid.v4();

var msal = require('@azure/msal-node');
var mainApp = require('../app.js');

var uuid = require('uuid');
var parser = bodyParser.urlencoded({ extended: false });

///////////////////////////////////////////////////////////////////////////////////////
// Setup the presentation request payload template

var configFile = process.env.configFile
if ( !configFile ) {
  configFile = process.env.CONFIGFILE || '../config/configuration.json';
}
const config = require( configFile )
if (!config.azTenantId) {
  throw new Error('The config.json file is missing.')
}
//console.log(config)
module.exports.config = config;

// config.apiKey = uuid.v4();
var msalConfig = {
  auth: {
      clientId: config.azClientId,
      authority: `https://login.microsoftonline.com/${config.azTenantId}`,
      clientSecret: config.azClientSecret,
  },
  system: {
      loggerOptions: {
          loggerCallback(loglevel, message, containsPii) {
              //console.log(message);
          },
          piiLoggingEnabled: false,
          logLevel: msal.LogLevel.Verbose,
      }
  }
};


const cca = new msal.ConfidentialClientApplication(msalConfig);
const msalClientCredentialRequest = {
  scopes: ["3db474b9-6a0c-4840-96ac-1fceb342124f/.default"],
  skipCache: false, 
};
const msalCca = cca;
config.msIdentityHostName = "https://verifiedid.did.msidentity.com/v1.0/";

var requestConfigFile = process.argv.slice(2)[1];
if ( !requestConfigFile ) {
  requestConfigFile = process.env.ISSUANCEFILE ||'../config/presentation_request_trueidentity.json';
}
var presentationConfig = require( requestConfigFile );
presentationConfig.registration.clientName = "Node.js Verified ID sample";


    


presentationConfig.authority = config["IssuerAuthority"]
presentationConfig.manifest = config["CredentialManifest"]

if ( presentationConfig.pin && presentationConfig.pin.length == 0 ) {
  presentationConfig.pin = null;
}
function requestTrace( req ) {
    var dateFormatted = new Date().toISOString().replace("T", " ");
    var h1 = '//****************************************************************************';
    console.log( `${h1}\n${dateFormatted}: ${req.method} ${req.protocol}://${req.headers["host"]}${req.originalUrl}` );
    console.log( `Headers:`)
    console.log(req.headers);
  }
  

  router.get('/presentation-request', async (req, res,next) => {
    try {
        const data = await VerifierController.verifyVCrequest(req,res);
        res.status(200).json({success:true, data: data, message: 'vc', status:200});
    } catch (error) {
        next(error);
    }
});


router.get('/presentation-response', async (req, res) => {
    var id = req.query.id;
    requestTrace( req );

    const fs = require('fs');

    const path = require('path');

        const didStorage = path.join(__dirname,'../persistentData/storage/');
        console.log('-----------------++++++++++++++++++++++++++++++++++---------------------------------------------')


    let data =fs.readFileSync(path.join(didStorage,'/session'))
    data = JSON.parse(data)

     id = data.sessionID

    mainApp.sessionStore.get( id, (error, session) => {
      if (session && session.sessionData) {
        console.log(`status: ${session.sessionData.status}, message: ${session.sessionData.message}`);
        if ( session.sessionData.status == "presentation_verified" ) {
          delete session.sessionData.presentationResponse; // browser don't need this
        }
        res.status(200).json(session.sessionData);   
      } else {
        console.log( `400 - Unknown state: ${id}` );
        res.status(400).json({'error': `Unknown state: ${id}`});      
      }
    })
  })
  
  /**
   * B2C REST API Endpoint for retrieving the VC presentation response
   * body: The InputClaims from the B2C policy. It will only be one claim named 'id'
   * return: a JSON structure with claims from the VC presented
   */
  var parserJson = bodyParser.json();
 router.post('/presentation-response-b2c', parserJson, async (req, res) => {
    var id = req.body.id;
    requestTrace( req );
    mainApp.sessionStore.get( id, (error, store) => {
      if (store && store.sessionData && store.sessionData.status == "presentation_verified" ) {
        console.log("Has VC. Will return it to B2C");      
        var claims = store.sessionData.presentationResponse.verifiedCredentialsData[0].claims;
        var claimsExtra = {
          'vcType': presentationConfig.presentation.requestedCredentials[0].type,
          'vcIss': store.sessionData.presentationResponse.verifiedCredentialsData[0].authority,
          'vcSub': store.sessionData.presentationResponse.subject,
          'vcKey': store.sessionData.presentationResponse.subject.replace("did:ion:", "did.ion.").split(":")[0]
          };        
          var responseBody = { ...claimsExtra, ...claims }; // merge the two structures
          req.session.sessionData = null; 
          console.log( responseBody );
          res.status(200).json( responseBody );   
      } else {
        console.log('Will return 409 to B2C');
        res.status(409).json({
          'version': '1.0.0', 
          'status': 400,
          'userMessage': 'Verifiable Credentials not presented'
          });   
      }
    })
  })
  
 router.get('/get-presentation-details', async (req, res) => {
    var id = req.query.id;
    requestTrace( req );
    res.status(200).json({
      'clientName': presentationConfig.registration.clientName,
      'purpose': presentationConfig.registration.purpose,
      'VerifierAuthority': config["VerifierAuthority"],
      'type': presentationConfig.requestedCredentials[0].type,
      'acceptedIssuers': presentationConfig.requestedCredentials[0].acceptedIssuers    
      });   
  })
  
module.exports =  router;