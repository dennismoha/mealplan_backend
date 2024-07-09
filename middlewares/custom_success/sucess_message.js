function getSuccessMessage(statusCode, data, statusMessage) {
    return {
        statusCode: statusCode || 200, // Default to 200 if statusCode is not provided
        data: data || null, // Default to null if data is not provided
        status: statusMessage || 'Success' // Default to 'Success' if statusMessage is not provided
    };
}

module.exports = {
    getSuccessMessage
};