/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
        this.bd = new LevelSandbox.LevelSandbox();
        this.generateGenesisBlock();
    }

    // Helper method to create a Genesis Block (always with height= 0)
    // You have to options, because the method will always execute when you create your blockchain
    // you will need to set this up statically or instead you can verify if the height !== 0 then you
    // will not create the genesis block
    generateGenesisBlock(){
        // Add your code here
        this.getBlockHeight().then((height) => {
            if(height === -1) {
                let genesisBlock = new Block.Block('Genesis Block');
                this.addBlock(genesisBlock).then((block) => {
                    console.log(block);
                });
            }
        }).catch((err) => {console.log(err)});
    }

    // Get block height, it is a helper method that return the height of the blockchain
    getBlockHeight() {
        // Add your code here
        let self = this;
        return new Promise((resolve, reject) => {
            self.bd.getBlocksCount().then((height) => {
                resolve(height);
            }).catch((err) => {resolve(-1)});
        })
    }

    // Add new block
    async addBlock(block) {
        let self = this;
        // Add your code here
        return new Promise ( (resolve, reject) => {
            self.getBlockHeight().then((height) => {
                block.height = height + 1;
                return self.bd.getLevelDBData(height);
            }).then((previousBlockBD) => {
                if(previousBlockBD) {
                    let previousBlock = previousBlockBD;
                    block.previousBlockHash = previousBlock.hash;
                    block.timeStamp = new Date().getTime().toString().slice(0,-3);
                    block.hash = SHA256(JSON.stringify(block)).toString();
                } else {
                    block.timeStamp = new Date().getTime().toString().slice(0,-3);
                    block.hash = SHA256(JSON.stringify(block)).toString();
                }
                return self.bd.addLevelDBData(block.height, JSON.stringify(block).toString());
            }).then((result) => {
                if(!result) {
                    reject(new TypeError("Error Adding new block to the chain"));
                }
                resolve(result);
            }).catch((err) => { reject(err)});
        });
    }

    // Get Block By Height
    getBlock(height) {
        let self = this;
        return new Promise((resolve,reject) => {
            self.bd.getLevelDBData(height)
                .then((block) => resolve(block))
                .catch((err) => {reject(err)})
        });
    }
    
    // Get Block By Hash
    getBlockByHash(hash) {
        let self = this;
        return new Promise((resolve,reject) => {
            self.bd.getBlockByHash(hash)
                .then((block) => resolve(block))
                .catch((err) => {reject(err)})
        });
    }

    getBlockChain() {
        let self = this;
        return new Promise((resolve, reject) => {
            self.getBlockHeight().then(height => {
                let i = 0;
                let promises = []
                while (i <= height) {
                    promises.push(self.getBlock(i))
                    i++;
                }
            Promise.all(promises).then((blockchain) => resolve(blockchain))
            })
        });
    }

    // Validate if Block is being tampered by Block Height
    validateBlock(height) {
        // Add your code here
        let self = this;
        
        return new Promise ( (resolve, reject) => {
            self.getBlock(height).then(block => {
                let blockHash = block.hash;
                block.hash = '';
                let validBlockHash = SHA256(JSON.stringify(block)).toString();
                if (blockHash === validBlockHash) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        })
        }

    // Validate Blockchain
    validateChain() {
        // Add your code here
        let self = this;
        let errorLog = [];

        return new Promise( (resolve, reject) => {
            self.getBlockChain().then((chain) => {
                let promises = [];
                let chainIndex = 0;

                chain.forEach(block => {
                    promises.push(self.validateBlock(block.height));
                    if(block.height > 0) {
                        let previousBlockHash = block.previousBlockHash;
                        let blockHash = chain[chainIndex-1].hash;
                        if(blockHash != previousBlockHash){
                            errorLog.push(`Error - Block Height: ${block.height} - Previous Hash does not match`);
                        }
                    }
                    chainIndex++;
                })

                Promise.all(promises).then((results) => {
                    chainIndex = 0;
                    results.forEach(valid => {
                        if(!valid){
                            errorLog.push(`Error - Block Height: ${chain[chainIndex].height} - Has been Tampered.`);
                        }
                        chainIndex++;
                    });
                    resolve(errorLog);
                }).catch((err) => {reject(err)});
            }).catch((err) => {reject(err)});
        })
    }

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise( (resolve, reject) => {
            self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => {reject(err)});
        });
    }
}

module.exports.Blockchain = Blockchain;
