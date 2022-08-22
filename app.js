const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const accountRoutes = require('./routes/account-routes');


const app = express();

//app.use(cors);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(bodyParser.json());

const PORT = 3000;

console.log("port"+ PORT);

app.listen(PORT, () => console.log('Server listening on port: '+ PORT));

app.use('/api', accountRoutes.routes);