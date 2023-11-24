import {dbConstants} from '../config/constants.ts'
import {insertIntoTable,getDataFromTable,getAllDataFromTable}  from '../utils/dbHelper.ts';

export  const createSchemaInTable = async (schema, expiration, dependantSchemas) =>{
    try {
        const params = {
            TableName: dbConstants.schemaTableName,
            Item:{
                schemaName: schema.title,
                description: schema.description,
                jsonSchema: schema,
                expiration: expiration,
                status: 'active'
            }
        };
        return await insertIntoTable(params);
    } catch (error) {
        throw new Error(error.message);
    }
};

export const  getSchemaByKey = async (schemaName) =>{
    try {
        const params = {
            TableName: dbConstants.schemaTableName,
            schemaName : schemaName,
        };
        return await getDataFromTable(params);
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getAllSchema = async () =>{
    try {
        const params = {
            TableName: dbConstants.schemaTableName,
            Select: 'ALL_ATTRIBUTES'
        };
        return await getAllDataFromTable(params);
    } catch (error) {
        throw new Error(error.message);
    }
};

export const createConditionsInTable = async (conditionDetails) =>{
    try {
        const params = {
            TableName: dbConstants.conditionTableName,
            Item: {...conditionDetails}
        };
        return await insertIntoTable(params);
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getAllConditions = async () =>{
    try {
        const params = {
            TableName: dbConstants.conditionTableName,
            Select: 'ALL_ATTRIBUTES'
        };
        return await getAllDataFromTable(params);
    } catch (error) {
        throw new Error(error.message);
    }
};
