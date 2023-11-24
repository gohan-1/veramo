import  { dbConstants } from '../config/constants.ts';

export const verifiableCredentialSchema = {
    "AttributeDefinitions":{
            AttributeName: 'schemaName',
            AttributeType: 'S'}
     ,

    "TableName" : dbConstants.schemaTableName,
    "KeySchema": [
        {
            AttributeName: 'schemaName',
            KeyType: 'HASH'
        }
    ],
    "ProvisionedThroughput": {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }

};

// module.exports = { verifiableCredentialSchema};

