const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');

const express = require('express')
const app = express()

const myBlockchain = new BlockChain.Blockchain()

app.get('/', (req,res) => res.send("hello world!"))

app.get('/block/:blockheight', (req,res) => myBlockchain.getBlock(req.params.blockheight).then(block => res.send(block), err => res.send(err)));

app.post('/block', (req, res) => {
    let data = req.params.body
    if (data.body.length > 0) {
        myBlockchain.addBlock(req.params.body).then(block => res.send(block), err => res.send(err))
    } else {
        res.send({
            status: 'error',
            message: 'block data is missing'
        })
    }
});
