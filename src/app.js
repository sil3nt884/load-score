const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

express.static('public');

const port = process.env.PORT || 3000;

// Load the SSL certificate and private key
const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Create an HTTPS service with the Express app
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
    console.log('HTTPS Server is up on port ' + port);
});

app.get('/', (req, res) => {
    return res.sendFile(`${__dirname}/block.js`);
});

app.post('/save', require('./save/save'));
app.get('/score/:id', require('./getScore/getScore'));