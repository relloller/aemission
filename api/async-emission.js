'use strict';

var uuid = require('node-uuid');
var emitter = new(require('events')).EventEmitter();

emitter.on('error', function (err) {
	console.log('in mod emitter');
	console.error(err);
});


function asyncEmit(emitid, tf, data) {
    if (tf === false) {
    	console.log('asyncNext stopped', 'emitid:',emitid);
    	emitter.removeAllListeners(emitid);
    }
    else emitter.emit(emitid, data);
}


function asyncNext(arrFn, optD) {
    var k = 0;
    var randomID = 'asyncNext '+uuid.v1();
    emitter.on(randomID, function(data) {
        data = data || optD || '';
        if (++k < arrFn.length) arrFn[k](randomID, data);
        else {
            emitter.removeAllListeners(randomID);
            console.log('asyncNext done');
        }
    });
    process.nextTick(function() { arrFn[k](randomID, optD) });
}


function asyncAll(asyncArgs, optData) {
    var len = asyncArgs.length;
    var num_done = 0;
    var randomID = 'asyncAll ' + uuid.v1();

    //listens for emitted events to unique randomID
    emitter.on(randomID, function(data) {
        if (++num_done === len) {
            console.log('asyncAll done')
            emitter.removeAllListeners(randomID);
        }
    });

    //calls all async functions in asyncArgs
    for (var i = 0; i < len; i++) {
        setImmediate(function(x) {
            return function() {
                asyncArgs[x](randomID, optData);
            }
        }(i));
    }
}


console.log('asyncEmission Module');

module.exports={
	next: asyncNext,
	all: asyncAll,
	emit: asyncEmit,
	emitter: emitter
};