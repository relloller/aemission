# aemission
	Asynchronous function chaining in series and parallel/concurrent execution.
	Implementation driven by event emission of a unique identifier for each function chain

To setup an asynchronous routine:
	*```javascript
		aemission.next(
			initArgs, // Object {email:'user@example.com, pw:'password'}
			fncs, 	  // Array  [verifyEmail, findEmailAccount, verifyPW, ...etc]
			errCB	  // Function - general error handler 
			);
	```

Aemission chain functions accept a callback function(cbID) and data object.
```javascript

function aemissionFunction(cbID, data) {
    someAsyncFunc(data, (err, results) => {
        if (err) return cbID(err, { statusCode: 500, logMsg: "message for logs" });
	else if(results === null ) return cbID(new Error("results null", { statusCode: 400, msg: "client message" });
        else return cbID(null, result);
    });
 }
```
 
The code below shows a series of asynchronous functions used to register a user account. 
```javascript

	function register(req, res) {
    	    const { email, password: pw } = req.body;
	    
	    aemission.next(
	    	{ email, pw },
		[
		  verifyParams,
		  emailAvailable,
		  hashPW,
		  createUser,
		  encodeJWT,
		  function(cbID, { token }) => {
		  	res.status(200).json({ token });
			return cbID(null, {});
		  }
		],
		function errCB(eData) { 
		    const { logMsg, msg, statusCode } = eData;
		    if (msg && statusCode) return res.status(statusCode).json({ statusCode, msg });
		    else return res.status(500).end();
		}
	    );
	}

```
## Installation

Clone Repo 

     git clone https://github.com/relloller/aemission
     
     cd aemission
     
Install Dependencies     
     
     npm install
     
Start mongoDB

     mongod
     
Start API Server

     npm start

Run Mocha Tests

     npm test
     
     


