
/* 
https://github.com/relloller/async-emission
*/
'use strict';
var uuid = require('node-uuid');
var events = require('events');
var emitter = new events.EventEmitter();
var fs = require('fs');
var async = require('../api/async-emission.js');


//wrapper for emit_id eventemitter

function fsRead(emit_id, filePath, enc) {
    fs.readFile(filePath, enc, function(err, data) {
        if (err) return err;
        async.emit(emit_id, JSON.parse(data));
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
        async.emit(emit_id);
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
        async.emit(emit_id, dictJSON);
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
                if (x === dictJSON.length - 1) async.emit(emit_id, ltrDict);
            }
        }(i));
    }
}

//partial application
var filterDictF = function(ltr) {
    return function(emit_id, dictJSON) {
        return filterDict(emit_id, dictJSON, ltr);
    }
};


//reads dictAZ3.json, logs dictAZ3.json, filters dictAZ3.json for words starting w/ "a" into array, writes array to json file, reads json file, logs json file to console
async.next([fsReadF('dictAZ3.json', 'UTF8'), asyncConsoleLog, filterDictF('a'), fsWriteF('dictA3.json'), fsReadF('dictA3.json', 'UTF8'), asyncConsoleLog])



//partial application of async_next
    //fnc1 is called and completed before fnc2 is called 
function async_next2(fnc1) {
    return function(fnc2) {
        return function(emit_id, d) {
            return async.next([fnc1, fnc2], d)
        }
    }
}


//a-z JSON word list. reading sync on purpose
var azJSON = JSON.parse(fs.readFileSync('dictAZ3.json', 'UTF8'));



/*
split a-z JSON word list into files for words starting with each letter
*/


//each element of asyncFncs_next2 will be a filter async function chained/followed by an async file write function
var asyncFncs_next2 = [];

//contain async functions that are independent and not necessarily chained
var asyncFncs = [];

var abc_m = 'abcdefghijklm';
var nop_z = 'nopqrstuvwxyz';


//creates chained(a-m) and unchained(n-z) async functions to filter JSON and write file
for (var i = 0; i < abc_m.length; i++) {
    var ltr = abc_m.charAt(i);
    var ltr2 = nop_z.charAt(i);

    //fnc_next2 elements is a filter async func chained/followed to an async file write func
    var fnc_next2 = async_next2(filterDictF(ltr))(fsWriteF("words" + ltr.toUpperCase() + "3.json"));
    asyncFncs_next2.push(fnc_next2);

    //fncs contain functions that can be independent and not necessarily chained
    var fncs = [filterDictF(ltr2), fsWriteF("words" + ltr2.toUpperCase() + "3.json")];
    asyncFncs.push(fncs[0], fncs[1]);
}


//partial app for async.all. 
// async.all_funktion is a method on async.all function obj...check asyncEmission.js module code..
var asyncAll=function (fncs,optD2) {
    return function(emitid){
        async.all_funktion.call(async.that, emitid,fncs, optD2)
    }
}

//asyncFncs starting els are unchained async functions corresponding to letters n-z, 
    //followed by chained functions a-m
asyncFncs.push(asyncAll(asyncFncs_next2, azJSON));


//async.next calls each element after the previous call has completed
//letters n-z will execute in series-filter, write, filter, write
    //then the chained functions (a-m) will execute all at once since the last element
    // of asyncFncs is an async.all partially applied to asyncFncs_next2 (array of functions)
    //filter&write('b') filter&write('c') etc
async.next(asyncFncs, azJSON);


