var http = require('http');
var fs = require('fs');
var path = require('path');
var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')
var base64url = require('base64url')
// mod.cjs
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
var secureRandom = require('secure-random');
const https = require('https')
const url = require('url')
const { Console } = require('console');
var msal = require('@azure/msal-node');
var mainApp = require('../app.js');

var uuid = require('uuid');
var parser = bodyParser.urlencoded({ extended: false });


const apiKey = uuid.v4();
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




  
  function generatePin( digits ) {
    var add = 1, max = 12 - add;
    max        = Math.pow(10, digits+add);
    var min    = max/10; // Math.pow(10, n) basically
    var number = Math.floor( Math.random() * (max - min + 1) ) + min;
    return ("" + number).substring(add); 
  }


exports.verify = async (req,res)=>{
  requestTrace( req );
  var id = req.session.id;
  // prep a session state of 0
  mainApp.sessionStore.get( id, (error, session) => {
    var sessionData = {
      "status" : "request_created",
      "message": "Waiting for QR code to be scanned"
    };
    if ( session ) {
      session.sessionData = sessionData;
      mainApp.sessionStore.set( id, session);
    }
  });
    
    var accessToken = "";
    try {
      const result = await msalCca.acquireTokenByClientCredential(msalClientCredentialRequest);
      if ( result ) {
        accessToken = result.accessToken;
      }
    } catch {
        //console.log( "failed to get access token" );
        res.status(401).json({
          'error': 'Could not acquire credentials to access your Azure Key Vault'
          });  
        return; 
    }
    //console.log( `accessToken: ${accessToken}` );
    // modify the callback method to make it easier to debug 
    // with tools like ngrok since the URI changes all the time
    // this way you don't need to modify the callback URL in the payload every time
    // ngrok changes the URI
    presentationConfig.authority =config["VerifierAuthority"]
    // presentationConfig.callback.url = `http://localhost:8080/api/verifier/presentation-request-callback`;
    // presentationConfig.callback.state = "1";
    // presentationConfig.callback.headers['api-key'] = apiKey;
  
    //console.log( 'Request Service API Request' );
    var client_api_request_endpoint = `${config.msIdentityHostName}verifiableCredentials/createPresentationRequest`;
    //console.log( client_api_request_endpoint );
    var payload = JSON.stringify(presentationConfig);
    //console.log( payload );
    const fetchOptions = {
      method: 'POST',
      body: payload,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length.toString(),
        'Authorization': `Bearer ${accessToken}`
      }
    };
  
    const response = await fetch(client_api_request_endpoint, fetchOptions);
    var resp = await response.json()
  
    // the response from the VC Request API call is returned to the caller (the UI). It contains the URI to the request which Authenticator can download after
    // it has scanned the QR code. If the payload requested the VC Request service to create the QR code that is returned as well
    // the javascript in the UI will use that QR code to display it on the screen to the user.            
    resp.id = "1";                              // add id so browser can pull status
    //console.log( 'VC Client API Response' );
    //console.log( resp );  
    res.status(200).json(resp);       

  
}