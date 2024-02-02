# Charlotte LAN
Charlotte LAN was created in the Network Based Application Development course by me ([Caden Lalley](https://github.com/cadenlalley)) at the University of North Carolina at Charlotte. The purpose of this web application is to allow people to organize and host different LAN gaming tournaments in the Charlotte area. It is built using Express (Node.js) and MongoDB.

## Contributors
[Caden Lalley](https://github.com/cadenlalley)

## Demo
https://charlotte-lan.clalley.dev
(There are some image issues I am trying to resolve)

## Prerequisites
* NodeJS (<a href="https://nodejs.org/en/download/package-manager" target="_blank">Installation Guide</a>)
* Express (<a href="https://expressjs.com/en/starter/installing.html" target="_blank">Installation Guide</a>)
* MongoDB (<a href="https://www.mongodb.com/docs/manual/installation/" target="_blank">Installation Guide</a>) (*I would not recommend using Mongo Atlas as there are some known latency issues that cause webpages to load before data can be fetched*)

## Setup
1. Setup your MongoDB instance with a name of your liking (ensure you include the path to the exact database in your DB_URI environment variable)
1. Clone and change directory into the newly created `charlotte-lan` directory
2. Copy the contents of the `.env.sample` into a new file named `.env` and input values relevant to your environment as described in the sample file
3. Install requirements by running the command (you may need su privileges) `npm install` or `npm i` in the project directory 

## Run the Server
#### Node:
Run the command `node app.js`

#### Nodemon (requires additional setup):
Run the command `nodemon app.js`

## Additional Notes
* Image upload of an event is not a working function (this feature was not required as a part of the project specifications)
* There are some known issues that I believe to be due to my testing being run on a Mongo Atlas instance. For example, when deleting an event you have created, sometimes a 500 internal server error is thrown due to the templating engine trying to requery an item as it is being deleted. When you refresh the page, the error does not persist. I am unable to test this functionality with a local MongoDB instance
