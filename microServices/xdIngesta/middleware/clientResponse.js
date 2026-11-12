const clientResponse = (
    res,
    code = 200,
    message = "Succesful operation",
    data,
) => {
    res.status(code).json({
        success: true, code, message, data,
    });
};

module.exports = clientResponse;
