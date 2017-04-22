/* https://github.com/relloller/asyncEvents
*/
var uuid = require('node-uuid');
var events = require('events');
var emitter = new events.EventEmitter();
var fs = require('fs');

//emits an event on completion of an async function call
function emitAsync(randomID, data) {
    emitter.emit(randomID, data);
}

//calls next async function after previous async function has completed
    //optData is optional argument
function async_next(asyncArgs, optData) {
    var ii = 0;
    var len = asyncArgs.length;
    var emitID = 'async_next ' + uuid.v1();
    //listens for emitted events to unique emitID
    emitter.on(emitID, function(data) {
        data = data || optData;
        if (++ii < len) asyncArgs[ii](emitID, data);
        else {
            console.log('async_next done', emitID);
            emitter.removeAllListeners(emitID);
        }
    });

    asyncArgs[ii](emitID, optData);
}

//calls all async functions so functions process simultaneously 
    //optData is optional argument
function async_all(asyncArgs, optData) {
    var len = asyncArgs.length;
    var num_done = 0;
    var randomID = 'async_all ' + uuid.v1();

    //listens for emitted events to unique randomID
    emitter.on(randomID, function(data) {
        if (++num_done === len) {
            console.log('async_all done')
            emitter.removeAllListeners(randomID);
        }
    });

    //calls all async functions
    for (var i = 0; i < len; i++) asyncArgs[i](randomID, optData);
}

//wrapper for emit_id eventemitter
function fsRead(emit_id, filePath, enc) {
    fs.readFile(filePath, enc, function(err, data) {
        if (err) return err;
        console.log('fsRead done', filePath);
        emitAsync(emit_id, JSON.parse(data));
    });
}

//partial application
var fsReadF = function(filePath, enc) {
    return function(emit_id) {
        return fsRead(emit_id, filePath, enc);
    }
};

//wrapper for emit_id eventemitter
function fsWrite(emit_id, filePath, data) {
    fs.writeFile(filePath, JSON.stringify(data), function(err) {
        if (err) return err;
        console.log('fsWrite done', filePath);
        emitAsync(emit_id);
    });
}

//partial application
var fsWriteF = function(filePath) {
    return function(emit_id, data) {
        return fsWrite(emit_id, filePath, data);
    }
};

//wrapper for emit_id eventemitter
function asyncConsoleLog(emit_id, dictJSON) {
    setImmediate(function() {
        console.log('dictJSON', typeof dictJSON, dictJSON.length);
        emitAsync(emit_id, dictJSON);
    });
}

//wrapper for emit_id eventemitter
function filterDict(emit_id, dictJSON, ltr) {
    var ltrDict = [];
    console.log('ltr', ltr);
    for (var i = 0; i < dictJSON.length; i++) {
        setImmediate(function(x) {
            return function() {
                if (dictJSON[x].charAt(0) === ltr) ltrDict.push(dictJSON[x]);
                if (x === dictJSON.length - 1) emitAsync(emit_id, ltrDict);
            }
        }(i))
    }
}

//partial application
var filterDictF = function(ltr) {
    return function(emit_id, dictJSON) {
        return filterDict(emit_id, dictJSON, ltr);
    }
};


//reads dictAZ3.json, logs dictAZ3.json, filters dictAZ3.json for words starting w/ "a" into array, writes array to json file, reads json file, logs json file to console
async_next([fsReadF('dictAZ3.json', 'UTF8'), asyncConsoleLog, filterDictF('a'), fsWriteF('dictA3.json'), fsReadF('dictA3.json', 'UTF8'), asyncConsoleLog])



//partial application of async_next
    //fnc1 is called and completed before fnc2 is called 
function async_next2(fnc1) {
    return function(fnc2) {
        return function(emit_id, d) {
            return async_next([fnc1, fnc2], d)
        }
    }
}

//each element of asyncFncs_next2 will be a filter async function chained/followed by an async file write function
var asyncFncs_next2 = [];

//contain async functions that may be independent and not necessarily chained
var asyncFncs = [];

var abc_m = 'abcdefghijklm';
var nop_z = 'nopqrstuvwxyz';

//creates both chained(a-m) and unchained(n-z) async functions 
    //to split a-z JSON word list into files for words starting with each letter
for (var i = 0; i < abc_m.length; i++) {
    var ltr = abc_m.charAt(i);
    var ltr2 = nop_z.charAt(i);

    //fnc_next2 is a filter async func, chained/followed by an async file write func
    var fnc_next2 = async_next2(filterDictF(ltr))(fsWriteF("words" + ltr.toUpperCase() + "3.json"));

    //fncs contain functions that can be independent and not necessarily chained
    var fncs = [filterDictF(ltr2), fsWriteF("words" + ltr2.toUpperCase() + "3.json")];
    asyncFncs_next2.push(fnc_next2);
    asyncFncs.push(fncs[0], fncs[1]);
}

//a-z JSON word list
var azJSON = JSON.parse(fs.readFileSync('dictAZ3.json', 'UTF8'));

//each element of asyncFncs_next2 is a filter async function chained/followed by an async file write function
//async_all will call all elements of asyncFncs_next2 
async_all(asyncFncs_next2, azJSON);

//each element of asyncFnc is an async func that may be independent and not necessarily
//async_next calls each element after the previous call has completed
async_next(asyncFncs, azJSON);
