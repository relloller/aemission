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
}

function asyncAll(asyncArgs, optData) {
    var len = asyncArgs.length;
    var num_done = 0;
    var randomID = 'asyncAll ' + uuid.v1();
    // console.log('asyncAll.uID', asyncAll.uID,asyncAll.fnc);
    //listens for emitted events to unique randomID
    emitter.on(randomID, function(data) {
        if (++num_done === len) {
            console.log('asyncAll done')
            emitter.removeAllListeners(randomID);
            if(typeof asyncAll.fnc['1'] === 'function'){
                asyncEmit(asyncAll.uID['1'],true, '123');
            }
        }
    });

    //calls all async functions
        // asyncArgs[i](randomID, optData);
    for (var i = 0; i < len; i++) {
        setImmediate(function(x) {
            return function() {
                asyncArgs[x](randomID, optData);
            }
        }(i))
    }
}


asyncAll.wtvz = function () {
    var that=this;
    return that;
}

asyncAll.funktion = function (uID,fncs,optD2) {
    this.fnc = asyncEmit;
    this.uID = {1:uID};
    this(fncs, optD2)
}

console.log('asyncEmission Module');

module.exports={
    that: asyncAll.wtvz(),
	next: asyncNext,
	all: asyncAll,
	emit: asyncEmit,
	emitter: emitter,
    all_funktion: asyncAll.funktion
}