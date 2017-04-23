# async-emission
	async function chaining in series and parallel/concurrent execution.
	Implementation is driven by event emissions.
    Example of chained async functions to register a user account. 
    This registration function can be seen in /api/users.
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
#Installation
     
     git clone https://github.com/relloller/async-emission
     cd async-emission
     npm install
     start mongoDB
     npm start
     npm test
     
     


