const jwt = require('jsonwebtoken');

function validateAccountCreate(req, res, next) {
    const { full_name, email, password, pin } = req.body;
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    
    if (!full_name || full_name.length < 3) {
        return res.status(400).send({
          msg: 'Please enter a full name with min. 3 chars'
        });
    };
    
    if (!email) {
        return res.status(400).send({
            message: 'email cannot be empty'
        });
    };

    if (email && !(emailRegex.test(email))) {
        return res.status(400).send({
            message: 'Please enter a valid email'
        });
    };

    if (!password || password.length < 6) {
        return res.status(400).send({
          msg: 'Please enter a password with min. 6 chars'
        });
    }

    if (!pin) {
        return res.status(400).send({
            message: 'pin cannot be empty'
        });
    };

    if (pin && pin.length != 4) {
        return res.status(400).send({
            message: 'pin should be 4 digits'
        });
    };
    next();
};

function validateLoginRequest(req, res, next) {
    console.log("entered-validation");
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).send({
            message: 'email cannot be empty'
        });
    };

    if (!password) {
        return res.status(400).send({
            message: 'password cannot be empty'
        });
    };
    next();
}

function validateAccountFundingRequest(req, res, next) {
    const { amount } = req.body;

    if (!amount) {
        return res.status(400).send({
            message: 'amount cannot be empty'
        });
    };

    next();
}

function validateFundTransferRequest(req, res, next) {
    const { amount, account_number, pin} = req.body;

    if (!amount) {
        return res.status(400).send({
            message: 'amount cannot be empty'
        });
    };

    if (!account_number) {
        return res.status(400).send({
            message: 'account_number cannot be empty'
        });
    };

    if (!pin) {
        return res.status(400).send({
            message: 'pin cannot be empty'
        });
    };

    if (pin.length < 4) {
        return res.status(400).send({
            message: 'pin should be 4 digits'
        });
    };

    next();
}

function validateAccountWithdrawalRequest(req, res, next) {
    const { amount, pin } = req.body;

    if (!amount) {
        return res.status(400).send({
            message: 'amount cannot be empty'
        });
    };

    if (!pin) {
        return res.status(400).send({
            message: 'pin cannot be empty'
        });
    };

    if (pin.length < 4) {
        return res.status(400).send({
            message: 'pin should be 4 digits'
        });
    };

    next();
}

module.exports = {
    validateAccountCreate,
    validateAccountFundingRequest,
    validateLoginRequest,
    validateFundTransferRequest,
    validateAccountWithdrawalRequest
}