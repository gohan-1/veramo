// import sdk from '../sdk';
// import moment from 'moment';
// import util from '../utils/crypto';
// // import { PublicKey } from '@hashgraph/sdk';
// // import nacl from 'tweetnacl';
// import {verifyTemplates} from '../utils/tech5Integration';

// const verifyVC = async (verifiableCredential, fid) => {
//     try {
//         // const issuerDidResult = await sdk.verifyDid(verifiableCredential.issuer, fid);
//         const hash = await sdk.createVCHash(verifiableCredential);
//         const verifiableCredentialResult = await sdk.verifyVerifiableCredential(hash, fid);
//         if(verifiableCredentialResult === 'Success'){
//             if(verifiableCredential.expirationDate !== null && moment().isAfter(moment(verifiableCredential.expirationDate))){
//                 return {isVCValid: 'Expired'};
//             }
//             return {isVCValid: verifiableCredentialResult};
//         }
//         return {isVCValid: 'Failed'};
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };

// // const checkSignEn = async (vc,publicKey,signedMessage) =>{
// //     const message = await nacl.sign.open(signedMessage, publicKey);
// //     if(util.encryptData(message) === vc.credentialSubject[0].id){
// //         return true;
// //     }
// //     return false;
// // };

// // function decode(text) {
// //     const str = text.startsWith('0x') ? text.substring(2) : text;
// //     return Buffer.from(str, 'hex');
// // }

// // const checkSign= async (vc,publicKey,signedMessage) =>{
// //     const message = nacl.sign.detached.verify(Uint8Array.from(Buffer.from(JSON.stringify(vc.credentialSubject[0].id),'utf-8')), Uint8Array.from(decode(signedMessage)), Uint8Array.from(decode(publicKey)).slice());
// //     return message;
// // };

// const checkCred = async (arraySubjects, vc) => {
//     let subject;
//     for(let i=0;i<arraySubjects.length;i++){
//         subject=arraySubjects[i].split('=');
//         let key= subject[0];
//         if(vc.credentialSubject[0][key] === util.encryptData(subject[1])){
//             //console.log(subject[0]+'checking done');
//         }
//         else{
//             return [false,subject[0]];
//         }
//     }
//     return [true,null];

// };



// const verify = async (verifiableCredential,biometrics) => {
//     try {
//         const fid = verifiableCredential.issuer.split('fid=')[1];
//         const verifyDID = await sdk.verifyDid(verifiableCredential.issuer, fid);
//         const {face,iris,finger} = verifiableCredential.biometrics;
//         const verifyBiometric = biometrics ? await verifyTemplates(face, biometrics.face, iris, biometrics.iris, finger, biometrics.finger) : 'No Check Performed';
//         if(verifyDID === 'Failed') {
//             return {isVCValid: null, isIssuerDIDValid: 'issuerDid is deleted'};
//         }
//         else{
//             const verifyVCResult = await verifyVC(verifiableCredential, fid);
//             return {...verifyVCResult, isIssuerDIDValid: verifyDID, biometricMatchScore: verifyBiometric};
//         }
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };

// module.exports = {
//     verify,
//     checkCred,
//     // checkSignEn,
//     // checkSign
// };