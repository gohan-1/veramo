#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../server.ts';
// const {// loggerWeb} from '../config/// logger');

import http from 'http';
import fs from 'fs'
import path from 'path'
import {createTables} from '../utils/dbHelper.ts'
// cluster mode
import cluster from 'cluster'


import {messageConstants} from '../config/constants.ts'
/**
 * Get port from environment and store in Express.
 */

let port = normalizePort(process.env.PORT || '8080');
app.set('port', port);

/**
 * Create HTTP server.
 */

let server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

// without cluster mode
// server.listen(port,'0.0.0.0');
// server.on('error', onError);
// server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    let normalizedPort = parseInt(val, 10);

    if (isNaN(normalizedPort)) {
    // named pipe
        return val;
    }

    if (normalizedPort >= 0) {
    // port number
        return normalizedPort;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
    case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
    case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
    default:
        throw error;
    }
}
async function initialSetup(){
    try {
        // console.log('sad');
        const didStorage = path.join(__dirname,'../persistentData/storage/');
        // // loggerWeb.info('Initializing Databases');
        // await createTables();
        // // loggerWeb.info('Initializing Identity Network');
        // await sdk.initHederaIdentityNetwork();
        // // // loggerWeb.info(`Creating DID for ${process.env.SSI_USER} if not Existing`);
        // if(!fs.existsSync(path.join(didStorage, '/did'))){
        //     const didDetails = await sdk.generateDID();
        //     const didEnvelope = await sdk.generateDIDEnvelope(didDetails.didDocument, messageConstants.operation.did.create);
        //     const signedDid = await sdk.signDIDEnvelope(JSON.stringify(didEnvelope),didDetails.encodedPrivateKey);
        //     const messageId = await sdk.submitDid(signedDid);
        //     const zkpInstance = await ZKP();
        //     const zkpKeys = {
        //         privateKey: zkpInstance.encodedPrivateKey,
        //         publicKey: zkpInstance.encodedPublicKey
        //     };logger
        //     fs.mkdirSync(didStorage);
        //     fs.writeFileSync(path.join(didStorage,'/did'),JSON.stringify({didDocument: didDetails.didDocument, messageId},null,2));
        //     fs.writeFileSync(path.join(didStorage,`/${didDetails.publicKey}_sk`), didDetails.encodedPrivateKey);
        //     fs.writeFileSync(path.join(didStorage,'/zkpKeys'), JSON.stringify(zkpKeys,null,2));
        // }
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

async function onListening() {
    try {
        // await initialSetup();
        // loggerWeb.info('Waiting 3 seconds');
        // setTimeout(()=>{
        let addr = server.address();
        let bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        // loggerWeb.info('Appnet Ready');
        // loggerWeb.info(`Listening on ${bind}`);
        // },3000);
    } catch (error) {
        console.error(`Identity Network Initialize Failed: ${error.message}`);
        // loggerWeb.info(`Identity Network Initialize Failed: ${error.message}`);
        process.exit(1);
    }
}

async function main() {
    // if(cluster.isMaster){
        try {
            await initialSetup();
        } catch (error) {
          
            // loggerWeb.info(`Identity Network Initialize Failed: ${error.message}`);
            process.exit(1);
        }
    //     loggerWeb.info('Waiting 3 seconds');
    //     setTimeout(() => {
    //         for(let i=0;i< cCPUs;i++){
    //             cluster.fork();
    //         }
    //         cluster.on( 'online', function( worker ) {
    //             console.log( 'Worker ' + worker.process.pid + ' is online.' );
    //         });
    //         cluster.on( 'exit', function( worker, code, signal ) {
    //             console.log( 'worker ' + worker.process.pid + ' died.' );
    //         });
    //     },3000);
    // }
    // else{
        server.listen(port,'0.0.0.0');
        server.on('error', onError);
        server.on('listening', onListening);
    // }
}

main();