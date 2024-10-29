class FunctoryFunctions {
    constructor(res) {
        this.res = res;
    }

    responseSend(statusCode, message, data, error = null) {
        return this.res.status(statusCode).json({
            statusCode: statusCode,
            message: message,
            data: data,
            error: error
        });
    }
}

module.exports = FunctoryFunctions;
