const express = require('express');
const { createUserAccounts, login } = require('../controllers/userWalletAccount');
const { fundAccount, transferFund, withdrawFund } = require('../controllers/userWalletTransactions');
const { validateAccountCreate, validateLoginRequest, validateAccountFundingRequest, validateFundTransferRequest, validateAccountWithdrawalRequest } = require('../middleware/validate_request');
const { authorize } = require('../middleware/authorize')

const router = express.Router();

router.post('/create-accounts', validateAccountCreate, createUserAccounts);

router.post('/login', validateLoginRequest, login);

router.post('/fund-account', validateAccountFundingRequest, authorize, fundAccount);

router.post('/transfer', validateFundTransferRequest, authorize, transferFund);

router.post('/withdraw', validateAccountWithdrawalRequest, authorize, withdrawFund);

module.exports = {
    routes: router
}