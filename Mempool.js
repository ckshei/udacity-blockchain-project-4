const TimeoutRequestWindowTime = 5*60*1000;
const TimeoutMempoolValidWindowTime = 30*60*1000;
const bitcoinMessage = require('bitcoinjs-message');
const RequestObjValid = require('./RequestObjValid.js');

class Mempool {
    constructor() {
        this.mempool = {}
        this.timeoutRequests = {}
        this.mempoolValid = {};
        this.timeoutMempoolValid = {}
    }

    addRequestValidation(requestObj) {
        let self = this;
 
        return new Promise((resolve, reject) => {
            let result = self.searchRequestByWalletAddress(requestObj.address)
            if(result) {
                resolve(result);
            } else {
                self.mempool[requestObj.address] = requestObj;
                self.timeoutRequests[requestObj.address] = setTimeout(function() {
                    self.removeValidationRequest(requestObj.address)
                }, TimeoutRequestWindowTime) 
                resolve(requestObj);
            }
        })
    }

    searchRequestByWalletAddress(address) {
        let self = this;

        if(self.mempool[address]) {
            let request = self.mempool[address]
            let timeElapse = (new Date().getTime().toString().slice(0,-3)) - request.requestTimeStamp;
            let timeLeft = (TimeoutRequestWindowTime/1000) - timeElapse;
            request.validationWindow = timeLeft;
            return request;
        } else {
            return undefined;
        }
    }

    removeValidationRequest(address) {
        delete this.mempool[address]
        delete this.timeoutRequests[address]
    }

    removeValidRequest(address) {
        delete this.mempoolValid[address]
        delete this.timeoutMempoolValid[address]
    }

    validateRequestByWallet(address, signature) {
        let self = this;


        return new Promise((resolve, reject) => {
            let result = self.searchRequestByWalletAddress(address)
            if (result) {
                let isValid = bitcoinMessage.verify(result.message, address, signature);
                let reqObjValidate = new RequestObjValid.RequestObjValid(result, isValid);
                if (isValid) {
                    let timeElapse = (new Date().getTime().toString().slice(0,-3)) - reqObjValidate.status.requestTimeStamp;
                    console.log(timeElapse, 'timeElapse')
                    let timeLeft = (TimeoutMempoolValidWindowTime/1000) - timeElapse;
                    console.log(timeLeft, 'timeleft', TimeoutMempoolValidWindowTime, 'tp')
                    reqObjValidate.status.validationWindow = timeLeft;
                    self.mempoolValid[reqObjValidate.status.address] = reqObjValidate;
                    self.timeoutMempoolValid[reqObjValidate.status.address] = setTimeout(function() {
                        self.removeValidRequest(reqObjValidate.status.address)
                    }, TimeoutMempoolValidWindowTime) 
                }
                resolve(reqObjValidate);
            } else {
                resolve(undefined);
            }
        });
 
    }
}
module.exports.Mempool = Mempool