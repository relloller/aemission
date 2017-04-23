# async-emission
	async function chaining in series and parallel/concurrent execution.
	Implementation is driven by event emissions.
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


```javascript
	var uuid = require('node-uuid');
	var emitter = new(require('events')).EventEmitter();


	function asyncEmit(emitid, tf, data) {
	    if (tf === false) {
	    	console.log('asyncNext stopped', 'emitid:',emitid);
	    	emitter.removeAllListeners(emitid);
	    }
	    else emitter.emit(emitid, false, data);
	}


	function asyncNext(arrFn, optD) {
	    var k = 0;
	    var randomID = 'asyncNext '+uuid.v1();
	    emitter.on(randomID, function(err,data) {
	        if(err) return err;
	        data = data || optD || '';
	        if (++k < arrFn.length) arrFn[k](randomID, data);
	        else {
	            emitter.removeAllListeners(randomID);
	            console.log('asyncNext done');
	        }
	    });
    	process.nextTick(function() { arrFn[k](randomID, optD) });
	}```



