import { dbConstants }  from '../config/constants.js';

export const verifiableCredentialSchemas = {
    TableName : dbConstants.conditionTableName,
    KeySchema: [
        {
            AttributeName: 'conditionName',
            KeyType: 'HASH'
        }
    ],
    AttributeDefinitions: [
        {
            AttributeName: 'conditionName',
            AttributeType: 'S'
        },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

// module.exports ={ verifiableCredentialSchema};
