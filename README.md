# Project #3. Private Blockchain

This is Project 4, Private Blockchain, in this project I create a notarization system for you to tokenize stars and add it to the blockchain

## Setup project for Review.

To setup the project for review do the following:
1. Download the project.
2. Run command __npm install__ to install the project dependencies.
3. Run command __node app.js__ in the root directory.

## Testing the project

You should be able to make a get request to localhost:8000/block/height/:blockheight
You should be able to make a get request to localhost:8000/block/hash/:hash

You should be able to make a post request to localhost:8000/requestValidation with an address
You should be able to make a post request to localhost:8000/message-signature/validate with your address and the validated 'message'
You should be able to make a post request to localhost:8000/block with your address and star details, which will then add a block to the blockchain given you have a validated request
