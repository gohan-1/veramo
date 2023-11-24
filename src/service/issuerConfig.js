
const https = require('https')
const url = require('url')
// const { SSL_OP_COOKIE_EXCHANGE } = require('constants');
var msal = require('@azure/msal-node');
const fs = require('fs');
const crypto = require('crypto');
var uuid = require('uuid');

var mainApp = require('../app.js');
const _ = require('lodash')
const path = require('path');

const didStorage = path.join(__dirname,'../persistentData/storage/');






var configFile = process.env.configFile
if ( !configFile ) {
  configFile = process.env.CONFIGFILE || '../config/configuration.json';
}
const config = require( configFile )
if (!config.azTenantId) {
  throw new Error('The config.json file is missing.')
}
console.log(config)
module.exports.config = config;

config.apiKey = uuid.v4();
var msalConfig = {
  auth: {
      clientId: config.azClientId,
      authority: `https://login.microsoftonline.com/${config.azTenantId}`,
      clientSecret: config.azClientSecret,
  },
  system: {
      loggerOptions: {
          loggerCallback(loglevel, message, containsPii) {
              console.log(message);
          },
          piiLoggingEnabled: false,
          logLevel: msal.LogLevel.Verbose,
      }
  }
};

function requestTrace( req ) {
  var dateFormatted = new Date().toISOString().replace("T", " ");
  var h1 = '//****************************************************************************';
  console.log( `${h1}\n${dateFormatted}: ${req.method} ${req.protocol}://${req.headers["host"]}${req.originalUrl}` );
  console.log( `Headers:`)
  console.log(req.headers);
}



const cca = new msal.ConfidentialClientApplication(msalConfig);
const msalClientCredentialRequest = {
  scopes: ["3db474b9-6a0c-4840-96ac-1fceb342124f/.default"],
  skipCache: false, 
};
const msalCca = cca;
config.msIdentityHostName = "https://verifiedid.did.msidentity.com/v1.0/";

var requestConfigFile = process.argv.slice(2)[1];
if ( !requestConfigFile ) {
  requestConfigFile = process.env.ISSUANCEFILE ||'../config/issuance_request_config.json';
}
var issuanceConfig = require( requestConfigFile );
issuanceConfig.registration.clientName = "Node.js Verified ID sample";

issuanceConfig.authority = config["IssuerAuthority"]
issuanceConfig.manifest = config["CredentialManifest"]

if ( issuanceConfig.pin && issuanceConfig.pin.length == 0 ) {
  issuanceConfig.pin = null;
}





  
  function generatePin( digits ) {
    var add = 1, max = 12 - add;
    max        = Math.pow(10, digits+add);
    var min    = max/10; // Math.pow(10, n) basically
    var number = Math.floor( Math.random() * (max - min + 1) ) + min;
    return ("" + number).substring(add); 
  }


exports.createVcRequest = async (req,res) =>{


  requestTrace( req );
  var id = req.session.id;
  fs.writeFileSync(path.join(didStorage,'/session'),JSON.stringify({sessionID:id},null,2));
  // prep a session state of 0
  console.log(id)
  console.log('hello')
  requestTrace( req );
  var id = req.session.id;
  // prep a session state of 0
  mainApp.sessionStore.get( id, (error, session) => {
    console.log('sssssssssssssssssssssssssssssssssssssssss_----------------------------------++++++++++++++++++++++++++++====')
    setTimeout(() => {
      console.log('waiting for session')
      
    },2000);
  
    console.log(session)
      var sessionData = {
        "status" : 0,
        "message": "Waiting for QR code to be scanned"
      };
      if ( session ) {
        session.sessionData = sessionData;
        mainApp.sessionStore.set( id, session);  
      }
    });
  // 

  // get the Access Token
  var accessToken = "";
  try { 
    const result = await msalCca.acquireTokenByClientCredential(msalClientCredentialRequest);
    if ( result ) {
      accessToken = result.accessToken;
    }

  } catch {
    // console.log( "failed to get access token" );
    res.status(401).json({
        'error': 'Could not acquire credentials to access your Azure Key Vault'
        });  
      return; 
  }
  
  console.log( `accessToken: ${accessToken}` );

  issuanceConfig.authority = config["IssuerAuthority"]
  // modify the callback method to make it easier to debug 
  // with tools like ngrok since the URI changes all the time
  // this way you don't need to modify the callback URL in the payload every time
  // ngrok changes the URI
  // issuanceConfig.callback.url = `https://${req.hostname}/api/issuer/issuance-request-callback`;
  // modify payload with new state, the state is used to be able to update the UI when callbacks are received from the VC Service
  // issuanceConfig.callback.state = id;
  // check if pin is required, if found make sure we set a new random pin
  // pincode is only used when the payload contains claim value pairs which results in an IDTokenhint
  if ( issuanceConfig.pin ) {
    // don't use pin if user is on mobile device
    if ( req.headers["user-agent"].includes("Android") || req.headers["user-agent"].includes('iPhone')) {
      delete issuanceConfig.pin;
    } else {
      issuanceConfig.pin.value = generatePin( issuanceConfig.pin.length );
    }
  }
  
  // here you could change the payload manifest and change the firstname and lastname
  if ( issuanceConfig.claims ) {
    if ( issuanceConfig.claims.given_name ) {
      issuanceConfig.claims.given_name = req.body.givenName;
    }
    if ( issuanceConfig.claims.user_name ) {
      issuanceConfig.claims.family_name =req.body.lastName ;
    }
    if ( issuanceConfig.claims.given_name ) {
      issuanceConfig.claims.user_name = req.body.userName;
    }
    if ( issuanceConfig.claims.membership_type) {
      issuanceConfig.claims.membership_type =req.body.membershipType ;
    }
    if ( issuanceConfig.claims.dateOf_birth) {
      issuanceConfig.claims.dateOf_birth =req.body.dateOfBirth ;
    }


  }

  // console.log( 'Request Service API Request' );
  var client_api_request_endpoint = `${config.msIdentityHostName}verifiableCredentials/createIssuanceRequest`;
  // console.log( client_api_request_endpoint );
  // console.log( issuanceConfig );

  // console.log('----------------------++++++++++++++++++++++++++++++++++++-----------------------------------------------')
  var payload = JSON.stringify(issuanceConfig);
  const fetchOptions = {
    method: 'POST',
    body: payload,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length.toString(),
      'Authorization': `Bearer ${accessToken}`
    }
  };
  // console.log('fetchoptions................................................')

  // console.log(fetchOptions)

  const response = await fetch(client_api_request_endpoint, fetchOptions);
  console.log('response -----------------=================================================')
  console.log(response)
  var resp = await response.json()
  console.log(resp)
  // the response from the VC Request API call is returned to the caller (the UI). It contains the URI to the request which Authenticator can download after
  // it has scanned the QR code. If the payload requested the VC Request service to create the QR code that is returned as well
  // the javascript in the UI will use that QR code to display it on the screen to the user.            
  resp.id = id;                              // add session id so browser can pull status
  if ( issuanceConfig.pin ) {
    resp.pin = issuanceConfig.pin.value;   // add pin code so browser can display it
  }
  return resp
}
