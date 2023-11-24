exports.onResponse = (response) => {
    const messageResponse = {...response};
    return messageResponse.data;
};

exports.onResponseError = (error) => {
    const responseError = {...error};
    if (error.response === undefined) {
        responseError.error = {
            message: 'Network Error, Please check your internet connection',
        };
    }
    else if (error.response.status === 500) {
        responseError.error = {
            message: 'Service unavailable. Please try after some time.',
        };
    } else if (error.response.status === 400) {
        responseError.error = {
            message: 'Bad Request. Please try after some time.',
        };
    } else if (error.response.status === 404) {
        responseError.error = {
            message: 'Invalid Message - Message is not found',
        };
    }
    return responseError;
};
