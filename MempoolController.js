const RequestObj = require('./RequestObj.js')

class MempoolController {

    constructor(app, blockchainObj, mempoolObj) {
        this.app = app;
        this.blockchain = blockchainObj
        this.mempool = mempoolObj
        this.requestValidation();
        this.validateSignature();
    }

    requestValidation() {
        this.app.post("/requestValidation", (req, res) => {
            if (req.body.address) {
                let requestObj = new RequestObj.RequestObj(req.body.address);
                this.mempool.addRequestValidation(requestObj).then((obj) => {
                    if(obj) {
                        return res.status(200).send(obj);
                    } else {
                        return res.status(500).send("Something went wrong");
                    }
                }).catch(error => { return res.status(500).send("promise failed"); })
            } else {
                return res.status(500).send('please include an address');
            }
        });
    }

    validateSignature() {
        this.app.post("/message-signature/validate", (req, res) => {
            if(req.body.address && req.body.signature) {
                console.log("line 33")
                this.mempool.validateRequestByWallet(req.body.address, req.body.signature).then((result) => {
                    if (result) {
                        return res.status(200).send(result);
                    } else {
                        return res.status(200).send("There was no matching address");
                    }
                }).catch((error) => {
                    return res.status(500).send('error with validate request promise')
                })
            } else {
                console.log(req.body.address, req.body.signature)
                return res.status(500).send('missing address or signature');
            }
        });
    }

}
  
module.exports = (app, blockchainObj, mempoolObj) => { return new MempoolController(app, blockchainObj, mempoolObj);}