let Block = require('./Block.js')

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
            if(req.body.address && req.body.star) {
                console.log(req.body.address)
                let result = this.mempool.searchValidRequestByWalletAddress(req.body.address)
                console.log(result)
                if(result){
                    let RA = req.body.star.ra;
                    let DEC = req.body.star.dec;
                    let MAG = req.body.star.mag;
                    let CEN = req.body.star.cen;
                    let starStory = req.body.star.story;
                    if(RA && DEC){
                        let body = {
                            address: req.body.address,
                            star: {
                                ra: RA,
                                dec: DEC,
                                mag: MAG, 
                                cen: CEN,
                                story: Buffer(starStory).toString('hex')
                            }
                        };
                        let block = new Block.Block(body);
                        this.blockchain.addBlock((block)).then((result) => {
                            if(result){
                                this.mempool.removeValidRequest(req.body.address);
                                const block = JSON.parse(result)
                                return res.status(200).json(block);
                            } else {
                                return res.status(500).send("Something went wrong");
                            }
                        }).catch((error => {return res.status(500).send("trouble adding new block"); }))
                    } else {
                        return res.status(500).send("missing RA + DEC");
                    }
                } else {
                    return res.status(401).json("the address could not be found or is not verified");
                }
            } else {
                return res.status(500).send("missing address + star details")
            }
        });
    }

}

module.exports = (app, blockchain, mempool) => { return new BlockController(app, blockchain, mempool);}