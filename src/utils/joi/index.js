import  joiSchema  from './joi.schema';

export const schema = {
    GET:{
        '/api/issuer/did': joiSchema.retrieveDid,
        '/api/user/did':joiSchema.retrieveDid,
        '/api/user/sign':joiSchema.retrieveDid,
        '/api/issuer/zkpCheck':joiSchema.retrieveDid
    },
    POST:{
        '/api/issuer/verifiableCredential': joiSchema.createVerifiableCredentialSchema,
        '/api/issuer/createSchema': joiSchema.createSchema,
        '/api/verifier/verify': joiSchema.verifyVerifiableCredentialSchema,
    },
    DELETE:{
    },
    PUT:{

    }
};

// module.exports ={ schema};
