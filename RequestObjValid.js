class RequestObjValid {
    constructor(requestObj, valid) {
        this.registerStar = true;
        this.status = {
            ...requestObj,
            messageSignature: valid
        };
    }
}

module.exports.RequestObjValid = RequestObjValid;