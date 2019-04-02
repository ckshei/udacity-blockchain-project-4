class BlockController {

    constructor(app, blockchainObj, mempoolObj) {
        this.app = app;
        this.blockchain = blockchainObj;
        this.mempool = mempoolObj;
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

module.exports = (app, blockchain, mempool) => { return new BlockController(app, blockchain, mempool);}