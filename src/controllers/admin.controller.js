
const fs = require('fs')
const path = require('path')
const _ = require('lodash')


const {getAccesToken,getAuthorities,getcontracts,getOnboard,generateDidDocument} = require('../service/admin.configuration')
// const {loggerWeb} = require('../config/logger')
const {messageConstants, vcConstants} = require('../config/constants')
// const {createCryptograph} = require('../utils/tech5Integration')
const dotenv = require('dotenv')
dotenv.config();





const creaTeAccessToken = async (req,res)=>{
    try {
        return await getAccesToken(req,res);
    } catch (error) {
        throw new Error(error.message);
    }
}

const getauthorities = async(req,res)=>{
    try {
        return await getAuthorities(req,res);
    } catch (error) {
        throw new Error(error.message);
    }

}

const getContracts = async (req,res)=>{
    try {
        return await getcontracts(req,res);
    } catch (error) {
        throw new Error(error.message);
    }

}

const onboard = async (req,res)=>{
    try {
        return await getOnboard(req,res);
    } catch (error) {
        throw new Error(error.message);
    }

}
const getDidDocument = async (req,res)=>{
    try {
        return await generateDidDocument(req,res);
    } catch (error) {
        throw new Error(error.message);
    }

}

module.exports = {
    getauthorities,
    creaTeAccessToken,
    getContracts,
    onboard,
    getDidDocument
    
};