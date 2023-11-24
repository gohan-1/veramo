const  {Router} = require('express');
const createError = require('http-errors');
// const moment = require('moment');
const {didConstants} = require('../config/constants')
// const {loggerWeb} = require('../config/logger');
const adminController = require('../controllers/admin.controller');
// const {verifySign} = require('../middleware/verify.middleware');
// const bodyParser = require('body-parser');

// var uuid = require('uuid');

const router = Router();

router.get('/getToken', async (req,res,next)=>{
    try {
        const token = await adminController.creaTeAccessToken(req,res)
        
        res.status(200).json({success:true, data:token, status:200});
    } catch (error) {
        next(error);
    }
});


router.get('/getAuyhorities', async (req,res,next)=>{
    try {
        const authorities = await adminController.getauthorities(req,res);
       
      
        res.status(201).json({success:true, data: authorities, message: 'Schema created and submited successfully', status:201});
    } catch (error) {
        next(error);
    }
});

router.get('/getContracts',async (req,res,next)=>{
    try {
        const authorities = await adminController.getContracts(req,res);
       
      
        res.status(201).json({success:true, data: authorities, message: 'Schema created and submited successfully', status:201});
    } catch (error) {
        next(error);
    }
});


router.get('/onboard',async (req,res,next)=>{
    try {
        const authorities = await adminController.onboard(req,res);
       
      
        res.status(201).json({success:true, data: authorities, message: 'onboard details', status:201});
    } catch (error) {
        next(error);
    }
})

router.get('/getDidDocument',async (req,res,next)=>{
    try {
        const authorities = await adminController.getDidDocument(req,res);
       
      
        res.status(201).json({success:true, data: authorities, message: 'onboard details', status:201});
    } catch (error) {
        next(error);
    }
})
module.exports =  router;
// var mainApp = require('../app.js');
