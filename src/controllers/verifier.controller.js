
const fs = require('fs')
const path = require('path')
const {forEach, keys} = require('lodash')
const enjoi = require('enjoi')
const {buildJsonSchema} = require('../utils/jsonSchema')
const moment = require('moment')

const {verify} = require('../service/veriferConfiguration')
// const {loggerWeb} = require('../config/logger')
const {messageConstants, vcConstants} = require('../config/constants')
// const {createCryptograph} = require('../utils/tech5Integration')
const dotenv = require('dotenv')
dotenv.config();





const verifyVCrequest = async (req,res)=>{
    try {
        return await verify(req,res);
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
  
    verifyVCrequest
};