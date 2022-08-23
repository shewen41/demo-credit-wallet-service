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

console.log("port"+ process.env.PORT);

app.listen(process.env.PORT || 3000, () => console.log('Server listening on port: '+ process.env.PORT));

app.use('/api', accountRoutes.routes);