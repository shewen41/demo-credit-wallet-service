const knex = require('../config/db');
const bcrypt = require('bcryptjs');

const timestamp = new Date();

const fundAccount = async (req, res, next) => {
    try {
        const { amount } = req.body;
        const transactionRef = 'DC-' + Date.now();

        // check if user has wallet accounr exist and user status is active
        const userAccountDetails = await knex('user_wallet_accounts').where('email', req.email)
            .andWhere('status', 'ACTIVE').first();

        if (!userAccountDetails) {
            return res.status(400).json({
                message: 'No wallet account or account is not active.'
            });
        }

        const account_number = userAccountDetails.account_number;

        const transactionRequest = await knex('wallet_transactions').insert({
            created_on: timestamp,
            last_modified_on: timestamp,
            source_account_number: null,
            destination_account_number: account_number,
            amount: amount,
            type: 'TRANSFER',
            reference: transactionRef,
            status: 'PENDING'
        });

        const currentBalance = parseFloat(userAccountDetails.wallet_balance);
        const newBalance = +(currentBalance + parseFloat(amount)).toFixed(12)

        const updateAccountBalance = await knex('user_wallet_accounts').where('account_number', account_number).update({
            wallet_balance: newBalance,
            last_modified_on: timestamp
        });

        const updateTransactionStatus = await knex('wallet_transactions').where('reference', transactionRef).update({
            status: 'COMPLETED',
            last_modified_on: timestamp
        });

        return res.status(200).json({
            message: 'Account funded successfully, your new account balance is: NGN ' + newBalance.toFixed(2)
        });

    } catch (error) {
        console.log("Error: "+ error.message);
        return;
    }
}

const transferFund = async (req, res, next) => {
    try {
        const { amount, account_number, pin } = req.body;
        const destination_account_number = account_number;
        const transactionRef = 'DC-' + Date.now();

        //const trx = await knex.transaction();

        const validateDestinationAccount = await knex('user_wallet_accounts').where('account_number', destination_account_number)
            .andWhere('status', 'ACTIVE').first();

        if (!validateDestinationAccount) {
            return res.status(400).json({
                message: 'Wrong destination account number or account is not active.'
            });
        }
        // check if user has wallet account and user status is active
        const userAccountDetails = await knex('user_wallet_accounts').where('email', req.email)
            .andWhere('status', 'ACTIVE').first();

        if (!userAccountDetails) {
            return res.status(400).json({
                message: 'No wallet account or account is not active.'
            });
        }

        const source_account_number = userAccountDetails.account_number;

        if (parseFloat(userAccountDetails.wallet_balance) < parseFloat(amount)) {
            return res.status(400).json({
                message: 'Insufficient account balance'
            });
        }

        if (destination_account_number == source_account_number) {
            return res.status(400).json({
                message: 'You cannot transfer to your account'
            });
        }

        bcrypt.compare(pin, userAccountDetails.pin, (err, response) => {
            if (err) {
                return res.status(400).json({
                    message: 'Error'
                });
            }
            if (response) {
                console.log("transaction pin matched");
            } else {
                return res.status(400).json({
                    message: 'transaction pin not correct'
                });
            }
        });

        const transactionRequest = await knex('wallet_transactions').insert({
            created_on: timestamp,
            last_modified_on: timestamp,
            source_account_number: source_account_number,
            destination_account_number: destination_account_number,
            amount: amount,
            type: 'TRANSFER',
            reference: transactionRef,
            status: 'PENDING'
        });

        var newSourceAccountBalance = null;
        const result = debitSourceAccount(source_account_number, userAccountDetails.wallet_balance, amount).then(function(result) {
            newSourceAccountBalance = result;
        });

        const newDestinationAccountBalance = creditDestinationAccount(destination_account_number, validateDestinationAccount.wallet_balance, amount);

        const updateTransactionStatus = await knex('wallet_transactions').where('reference', transactionRef).update({
            status: 'COMPLETED',
            last_modified_on: timestamp
        });

        return res.status(200).json({
            message: 'Transfer successful, your new account balance is: NGN ' + newSourceAccountBalance.toFixed(2)
        });

    } catch (error) {
        console.log("Error: "+ error.message);
        return;
    }
}

const withdrawFund = async (req, res, next) => {
    try {
        const { amount, pin } = req.body;
        const transactionRef = 'DC-' + Date.now();

        // check if user has wallet accounr exist and user status is active
        const userAccountDetails = await knex('user_wallet_accounts').where('email', req.email)
            .andWhere('status', 'ACTIVE').first();

        if (!userAccountDetails) {
            return res.status(400).json({
                message: 'No wallet account or account is not active.'
            });
        }

        if (parseFloat(userAccountDetails.wallet_balance) < parseFloat(amount)) {
            return res.status(400).json({
                message: 'Insufficient account balance'
            });
        }

        bcrypt.compare(pin, userAccountDetails.pin, (err, response) => {
            if (err) {
                return res.status(400).json({
                    message: 'Error'
                });
            }
            if (response) {
                console.log("transaction pin matched");
            } else {
                return res.status(400).json({
                    message: 'transaction pin not correct'
                });
            }
        });

        const account_number = userAccountDetails.account_number;

        const transactionRequest = await knex('wallet_transactions').insert({
            created_on: timestamp,
            last_modified_on: timestamp,
            source_account_number: account_number,
            destination_account_number: null,
            amount: amount,
            type: 'WITHDRAWAL',
            reference: transactionRef,
            status: 'PENDING'
        });

        const currentBalance = parseFloat(userAccountDetails.wallet_balance);
        const newBalance = +(currentBalance - parseFloat(amount)).toFixed(12)

        const updateAccountBalance = await knex('user_wallet_accounts').where('account_number', account_number).update({
            wallet_balance: newBalance,
            last_modified_on: timestamp
        });

        const updateTransactionStatus = await knex('wallet_transactions').where('reference', transactionRef).update({
            status: 'COMPLETED',
            last_modified_on: timestamp
        });

        return res.status(200).json({
            message: 'Withdrawal successful, your new account balance is: NGN ' + newBalance.toFixed(2)
        });

    } catch (error) {
        console.log("Error: "+ error.message);
        return;
    }
}

async function debitSourceAccount(source_account_number, wallet_balance, amount_to_debit) {
    const currentBalance = parseFloat(wallet_balance);
    const newBalance = +(currentBalance - parseFloat(amount_to_debit)).toFixed(12);

    await knex('user_wallet_accounts').where('account_number', source_account_number).update({
        wallet_balance: newBalance,
        last_modified_on: timestamp
    });

    return newBalance;
}


async function creditDestinationAccount(destination_account_number, wallet_balance, amount_to_credit) {
    const currentBalance = parseFloat(wallet_balance);
    const newBalance = +(currentBalance + parseFloat(amount_to_credit)).toFixed(12);

    await knex('user_wallet_accounts').where('account_number', destination_account_number).update({
        wallet_balance: newBalance,
        last_modified_on: timestamp
    });

    return newBalance;
}

module.exports = {
    fundAccount,
    transferFund,
    withdrawFund
}