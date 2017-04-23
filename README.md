# async-emission
	async function chaining in series and parallel/concurrent execution.
	Implementation is driven by event emission.
	
    The code below shows a series of async functions used to register a user account. 
    This async routine can be found in /api/users.
```javascript

	function registerUser(req, res) {
	    async.next([
	        checkParams(req, res),
	        userAvailable(username, res),
	        emailAvailable(req.body.email, res),
	        hashPW(password, 11, res),
	        saveUser(req, res),
	        encodeJWT(secretoflife,res),
	        respLogin(res)
	    ]);
	}
```
## Installation

Clone Repo 

     git clone https://github.com/relloller/async-emission
     
     cd async-emission
     
Install Dependencies     
     
     npm install
     
Start mongoDB

     mongod
     
Start API Server

     npm start

Run Mocha Tests

     npm test
     
     


