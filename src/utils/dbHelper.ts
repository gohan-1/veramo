import { DynamoDBClient, ListTablesCommand,CreateTableCommand ,ScanCommand,CreateTableCommandInput} from "@aws-sdk/client-dynamodb"
// import dbConfig from '../config/dbConfig.js'
import {dataBaseModels} from '../models/index.js';
import { PutCommand, DynamoDBDocumentClient ,GetCommand}  from "@aws-sdk/lib-dynamodb";

import { Credentials } from "@aws-sdk/types";
import  dotenv from 'dotenv';
import { schema } from "enjoi"
dotenv.config();
import _ from 'lodash'
 

// import {loggerWeb} from '../config/logger';






const marshallOptions = {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.
    convertEmptyValues: false, // false, by default.
    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: true, // false, by default.
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: false, // false, by default.
  };
  
  const unmarshallOptions = {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
    wrapNumbers: false, // false, by default.
  };
  
  const translateConfig = { marshallOptions, unmarshallOptions };

const client = new DynamoDBClient({  region: "ap-south-1",
credentials: {
    accessKeyId: process.env.awsAccessKeyId,
    secretAccessKey: process.env.awsSecretAccessKey
},
//     // marshallOptions: {
//         removeUndefinedValues: true
//     }
});
const docClient = DynamoDBDocumentClient.from(client,translateConfig);

const listTables = async() => {
    const input = { // ListTablesInput
        ExclusiveStartTableName: `${process.env.SSI_USER}_schema_master`,
        Limit: Number("int"),
      };

    const command = new ListTablesCommand(input);
    
const response = await client.send(command);
// //console.log(response)
return response;
};

export const createTables = async () => {
    try {

        const tableList = await listTables();
        // //console.log(tableList.TableNames)
        dataBaseModels.forEach(async schema => {
            // //console.log(schema)

            if(!tableList.TableNames.includes(schema.TableName)){

                const command = new CreateTableCommand(schema as CreateTableCommandInput);
                const response = await client.send(command);
                // //console.log(response)
            }
        });

    } catch (error) {
        throw new Error(error.message);
    }
};

export const insertIntoTable = async (params) => {
    // //console.log(2.2)
    // //console.log(params)
    const response =await docClient.send(
        new PutCommand({
            TableName :  params.TableName,
            Item :{
                schemaName: params.Item.schemaName,
                description: params.Item.description,
                jsonSchema : params.Item.jsonSchema,
                expiration : params.Item.expiration,
                status : params.Item.status
            }
        }))

    //   //console.log(response)
      return response
};

export const getDataFromTable = async (params) => {
    // //console.log(params)
    const command = new GetCommand({
        TableName: params.TableName,
        Key: {
          schemaName: params.schemaName
        },
      });

    //   console.log(command)
    
    const dbResult = await client.send(command);

    console.log(dbResult)
  
    
    if (!_.isUndefined(dbResult.Item)) {
        //console.log(dbResult.Item)
            return dbResult.Item
    } else {
        return (null);
    }
    
};

export const getAllDataFromTable = async (params) => {
    const command = new ScanCommand(params);
    
      const response = await client.send(command);
      return response;
};
