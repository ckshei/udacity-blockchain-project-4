const TimeoutRequestWindowTime = 5*60*1000;
const TimeoutMempoolValidWindowTime = 30*60*1000;

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
}
module.exports.Mempool = Mempool