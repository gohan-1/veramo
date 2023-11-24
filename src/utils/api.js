const axios = require('axios');
const dotenv = require('dotenv');
const onRequest = require('./requestInterceptors');
const {onResponse, onResponseError} = require('./responseInterceptors');

dotenv.config();



class API {
    constructor(baseURL, headers){
    
  
            this.defaultOptions = {
                baseURL,
                headers
            };
            this.axiosInstance = this.createInstance();
  
    }

    createInstance(){
        
        const axiosInstance = axios.create(this.defaultOptions);
        axiosInstance.interceptors.request.use((config)=> onRequest(config), (error)=> {throw new Error(error.message);});
        axiosInstance.interceptors.response.use((response)=> onResponse(response), (error)=> onResponseError(error));
        return axiosInstance;
    }

    async callApi(urlConfig){
        const response = await this.axiosInstance(urlConfig);
        return response;
    }
}


module.exports = {
  
    API
};