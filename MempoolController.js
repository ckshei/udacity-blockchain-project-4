const RequestObj = require('./RequestObj.js')

class MempoolController {

    constructor(app, blockchainObj, mempoolObj) {
        this.app = app;
        this.blockchain = blockchainObj
        this.mempool = mempoolObj
        this.requestValidation();
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
        }) 
    }

}
  
module.exports = (app, blockchainObj, mempoolObj) => { return new MempoolController(app, blockchainObj, mempoolObj);}