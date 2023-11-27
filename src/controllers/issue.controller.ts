
import fs  from 'fs'
import path  from 'path'
import {forEach, keys}  from 'lodash'
import enjoi  from 'enjoi'
import {buildJsonSchema}  from '../utils/jsonSchema.ts'
import moment  from 'moment'
import {createSchemaInTable,getSchemaByKey,getAllSchema,}  from '../helpers/schema.helper.ts'
// import {createVcRequest}  from '../service/issuerConfig'
// import {loggerWeb} = from '../config/logger'
import {getDid,didCreate,didCheck,createCredentials} from '../service/issuer.config.ts'
import {messageConstants, vcConstants}  from '../config/constants.ts'
// const {createCryptograph} = from '../utils/tech5Integration'
import dotenv  from 'dotenv'
dotenv.config();


export const getSchemaDetails = async (schemaName) =>{
    try {
        console.log(12)
        return await getSchemaByKey(schemaName);
    } catch (error) {
        throw new Error(error.message);
    }
};

export const createSchema = async (schemaDetails) => {
    try {
        console.log(1)
        const jsonSchema = await buildJsonSchema(schemaDetails);

        console.log(jsonSchema)

        const expiration = schemaDetails.expiration ? schemaDetails.expiration : null;
        console.log(schemaDetails)
        console.log(2)
        await createSchemaInTable(jsonSchema, expiration, schemaDetails.dependantSchemas);
        return jsonSchema;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getAllSchemaDetails = async () =>{
    try {
        return await getAllSchema();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getDidDetails =async (alias,provider)=>{

    try {
        return await getDid(alias,provider);
    } catch (error) {
        throw new Error(error.message);
    }
}

export  const createDid = async (alias,provider)=>{

    try {
        return await didCreate(alias,provider);
    } catch (error) {
        throw new Error(error.message);
    }
}

export const checkDid = async (did)=>{
    try {
        return await didCheck(did);
    } catch (error) {
        throw new Error(error.message);
    }
}

export const createCredential = async (data,vcParams)=>{
    try {
        const validationSchema = enjoi.schema(vcParams.schema.jsonSchema);
        const validate = validationSchema.validate(data);
        console.log('-----------------------------------------------------------------------')
        console.log(validate)
        console.log('-----------------------------------------------------------------------')
        if(validate.error){
            throw new Error(validate.error.details[0].message);
        }

        return await createCredentials(data,vcParams);
    } catch (error) {
        throw new Error(error.message);
    }
}



// const createVCrequest = async (req,res)=>{
//     try {
//         return await createVcRequest(req,res);
//     } catch (error) {
//         throw new Error(error.message);
//     }
// }

// module.exports = {
  
//     createSchema,
//     getSchemaDetails,
//     getAllSchemaDetails,
//     // createVCrequest

// };