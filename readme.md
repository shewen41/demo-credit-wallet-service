demo-credit-wallet-service-api
A node js api for a wallet service which incleder routs for user to create accounts, transfer funds and withdraw fund.

Steps

Note:
The api service allows user to /create-account, /login with the created account details, which will return a token which that will be use to access the other protected endpoint for the user to make a transfer to another account (/transfer), withdraw from his/her wallet (/withdraw) and fund from his/her acount /fund-account.

-postman collection link (https://documenter.getpostman.com/view/8615053/VUqptHwE);

Download & Build on local

1) Clone the repository, install node packages and verify routes locally
git clone https://github.com/shewen41/demo-credit-wallet-service.git

cd demo-credit-wallet-service

npm install

(create a .env file with the following enviroment variable keys needed to run the app)

#express server config

PORT=
HOST=
HOST_URL=

#mysql database config

MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=demo_creditdb
MYSQL_HOST=localhost
MYSQL_DB_PORT=

#jwt secret key
TOKEN_KEY =

run migration from the table below

run npm start

Open your local browser and verify the sample-node-api is working by accessing:
http://localhost:{port specified in .env}/api/create-accounts
http://localhost:{port specified in .env}/api/fund-account
http://localhost:{port specified in .env}/api/login
http://localhost:{port specified in .env}/api/transfer
http://localhost:{port specified in .env}/api/withdraw

![alt text](E-R-dbdesigner.jpg)