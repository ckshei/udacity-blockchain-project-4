const TimeoutRequestsWindowTime = 5*60*1000;

class RequestObj {
    constructor(address) {
        this.address = address;
        this.requestTimeStamp = new Date().getTime().toString().slice(0,-3);
        this.message = `${this.address}:${this.requestTimeStamp}:starRegistry`;
        this.validationWindow = TimeoutRequestsWindowTime / 1000;
    }
}

module.exports.RequestObj = RequestObj;