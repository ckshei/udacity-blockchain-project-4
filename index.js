/* ===== Executable Test ==================================
|  Use this file to test your project.
|  =========================================================*/

const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');

const express = require('express')
const app = express()
const bodyParser = require('body-parser');

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

const myBlockchain = new BlockChain.Blockchain()

app.get('/', (req,res) => res.send("hello world!"))

app.get('/block/:blockheight', (req,res) => myBlockchain.getBlock(req.params.blockheight).then(block => res.send(block), err => res.send({status: 'error', message: err})));

app.post('/block', (req, res) => {
    let body = req.body
    if (body.body.length > 0) {
        myBlockchain.addBlock(body).then(block => res.send(block), (err) => res.send({status: 'error', message: err}));
    } else {
        res.send({status: 'error', message: 'Block String cannot be empty'})
    }
});

app.listen(8000, () => console.log('Example app listening on port 8000!'))