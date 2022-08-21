const knex = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const timestamp = new Date();

const createUserAccounts = async (req, res, next) => {
    try {
        const { full_name, email, password, pin } = req.body;
        const generatedAccountNumber = '80'+getRandom(8);

        // check if user already exists
        const userExist = await knex('users').where('email', email).first();

        //const userExist = await knex('user_wallet_accounts').where('email', email).first();

        if (userExist) {
            return res.status(400).json({
                message: 'User email already exist.'
            });
        }

        // encrypt user password
        let encryptedPassword = await bcrypt.hash(password, 10);

        // encrypt user pin
        let encryptedPin = await bcrypt.hash(pin, 10);

        const user = await knex('users').insert({
            created_on: timestamp,
            last_modified_on: timestamp,
            full_name: full_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
            status: 'ACTIVE'
        });
        
        const userAccount = await knex('user_wallet_accounts').insert({
            created_on: timestamp,
            last_modified_on: timestamp,
            account_name: full_name,
            email: email.toLowerCase(),
            pin: encryptedPin,
            account_number: generatedAccountNumber,
            wallet_balance: 0.00,
            status: 'ACTIVE'
        });
        return res.status(200).json({
            message: 'Account created successfully, your acct no. is ' + generatedAccountNumber + '. login to perform transactions'
        });
    }catch (error) {
        return res.status(500).send(error.message);
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // check if user exist
        const user = await knex('users').where('email', email).first();

        if (!user) {
            return res.status(400).json({
                message: 'User does not exist.'
            });
        }

        // cheack for password match
        bcrypt.compare(password, user.password, (err, response) => {
            if (err){
              return res.status(500).send(error.message);
            }
            if (response) {
              // Send JWT
                const token = jwt.sign({
                    user_id: user.id,
                    email: user.email
                    }, config.key, {
                    expiresIn: '2h',
                    }
                );
                return res.status(200).json({
                message: 'LoggedIn',
                token: token
                });
            }else { 
              return res.status(200).json({
                message: 'password doesnot match'
                });
            } 
        });
    }   
    catch (error) {
        return res.status(500).send(error.message);
    }
}

function getRandom(length) {
    return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));  
}

module.exports = {
    createUserAccounts,
    login
}