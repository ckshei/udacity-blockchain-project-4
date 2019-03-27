/* ===== Executable Test ==================================
|  Use this file to test your project.
|  =========================================================*/

const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');

const express = require('express')
const app = express()

const myBlockchain = new BlockChain.Blockchain()

app.get('/', (req,res) => res.send("hello world!"))

app.get('/block/:blockheight', (req,res) => myBlockchain.getBlock(req.params.blockheight).then(block => res.send(block)));

app.post('/block', (req, res) => myBlockchain.addBlock(req.params.body).then(block => res.send(block)));

app.listen(8000, () => console.log('Example app listening on port 8000!'))
