
"use strict";

const uuid = require("uuid");
const emitter = new (require("events")).EventEmitter();
const deepClone = require("./deepClone.js");
emitter.on("error", function(err) {
    console.log("err in mod emitter");
    console.error(err);
});

function asyncEmit(emitid, err, data) {
    return function() {
        emitter.emit(emitid, err, data);
    };
}

function cbEmit(emitid) {
    return function(err, data) {
        return emitter.emit(emitid, err, data);
    };
}

function asyncNext(initArgs, arrFn, errCB) {
    const aeID = "aeID.next " + uuid.v1();
    const l = arrFn.length;
    let cbID = cbEmit(aeID);
    let dataStore = deepClone(initArgs);
    let k = 0;
    emitter.on(aeID, function(err, data) {
        if (err) {
            console.log('aemis.next err', err);
            emitter.removeAllListeners(aeID);
            errCB(data);
            console.log('aemis.next err stopped', aeID);
        } else if (++k < l) {
            Object.assign(dataStore, data);
            setImmediate(function() { arrFn[k](cbID, dataStore)});
        } else {
            emitter.removeAllListeners(aeID);
            console.log('aemis.next Done: ', aeID);
        }
    });

    process.nextTick(function() {
        arrFn[k](cbID, dataStore);
    });
}

function asyncAll(arrFn, errCB, optD) {
    let k = 0;
    const aeID = "aeID.all " + uuid.v1();
    let cbID = cbEmit(aeID);
    const l = arrFn.length;

    emitter.on(aeID, function(err, data) {
        if (err) {
            emitter.removeAllListeners(aeID);
            errCB(data);
        } else if (++k === l) {
            emitter.removeAllListeners(aeID);
            console.log('aemis.all Done: ', aeID);

        } 
    });

    process.nextTick(function() {
        for (let i = 0; i < l; i++) arrFn[i](cbID, optD);
    })
}

console.log("aemission Module");

module.exports = {
    next: asyncNext,
    emit: asyncEmit,
    emitter: emitter
};
