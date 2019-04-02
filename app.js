const express = require('express')
const bodyParser = require('body-parser')

class ApplicationServer {

    /**
     * Constructor that allows initialize the class 
     */
    constructor() {
		this.app = express();
		this.initExpress();
		this.initExpressMiddleWare();
		this.initControllers();
		this.start();
	}

    /**
     * Initilization of the Express framework
     */
	initExpress() {
		this.app.set("port", 8000);
	}

    /**
     * Initialization of the middleware modules
     */
	initExpressMiddleWare() {
		this.app.use(bodyParser.urlencoded({extended:true}));
		this.app.use(bodyParser.json());
	}

    /**
     * Initilization of all the controllers
     */
	initControllers() {
		require("./BlockController.js")(this.app);
	}

    /**
     * Starting the REST Api application
     */
	start() {
		let self = this;
		this.app.listen(this.app.get("port"), () => {
			console.log(`Server Listening for port: ${self.app.get("port")}`);
		});
	}

}

new ApplicationServer();

// class ApplicationServer{

//     constructor() {
//         this.app = express()
//     }
// }


// const BlockChain = require('./BlockChain.js');
// const Block = require('./Block.js');


// // support parsing of application/json type post data
// app.use(bodyParser.json());

// //support parsing of application/x-www-form-urlencoded post data
// app.use(bodyParser.urlencoded({ extended: true }));

// const myBlockchain = new BlockChain.Blockchain()

// app.get('/', (req,res) => res.send("hello world!"))

// app.post('/requestValidation ', (req, res) => {

// })

// app.get('/block/:blockheight', (req,res) => myBlockchain.getBlock(req.params.blockheight).then(block => res.send(block), err => res.send({status: 'error', message: err})));

// app.post('/block', (req, res) => {
//     let body = req.body
//     if (body.body && body.body.length > 0) {
//         myBlockchain.addBlock(body).then(block => res.send(block), (err) => res.send({status: 'error', message: err}));
//     } else {
//         res.send({status: 'error', message: 'Block String cannot be empty'})
//     }
// });

// app.listen(8000, () => console.log('Example app listening on port 8000!'))