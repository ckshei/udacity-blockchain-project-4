const SHA256 = require('crypto-js/sha256');
const BlockChain = require('./BlockChain.js');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;
        this.blockchain = new BlockChain.Blockchain();
        this.getBlockByHeight();
        this.postNewBlock();
        this.helloWorld();
    }

    helloWorld() {
        this.app.get("/", (req, res) => {
            res.send("Hello World");
        });
    }

    getBlockByHeight() { 
        this.app.get("/block/:height", (req, res) => {
            if(req.params.height) {
                let height = req.params.height;
                this.blockchain.getBlock(height).then((block) => {
                    if(block) {
                        return res.status(200).json(block);
                    } else {
                        return res.status(400).json(null);
                    }
                }).catch((error) => { return res.status(500).send("Uh Oh...")})
            } else {
                return res.status(500).send("The index is required");
            }
        }); 
    }

    postNewBlock() {
        this.app.post("/block", (req, res) => {
            let body = req.body
            if (body.body && body.body.length > 0) {
                this.blockchain.addBlock(body).then(block => res.send(block), (err) => res.send({status: 'error', message: err}));
            } else {
                res.send({status: 'error', message: 'Block String cannot be empty'})
            }            
        });
    }

}

module.exports = (app) => { return new BlockController(app);}