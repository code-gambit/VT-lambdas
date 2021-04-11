const AWS = require('aws-sdk');
exports.handler = async (event) => {
    // TODO implement
    const response = (success, reason, data) => { return { success: success, reason: reason, data: data } }
    return response(true, null, null);
};
