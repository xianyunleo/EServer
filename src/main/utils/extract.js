import {spawn } from 'child_process';
import path from "path";
import Command from "@/main/utils/Command";
import extract from 'extract-zip'

export async function extractZip(path, dest) {
    return await extract(path, {dir: dest});
}

let path7za = require("7zip-bin").path7za;
path7za = path7za.replace(`app.asar${path.sep}`, `app.asar.unpacked${path.sep}`);

export async function extract7z(path, dest) {
    return new Promise((resolve, reject) => {
        unpack(path, dest, (err) => {
            err ? reject(err) : resolve(true);
        });
    });
}

export async function extractTar(path, dest) {
    let commandStr;
    if (path.endsWith('.tar.xz')) {
        commandStr = `tar -Jxf ${path} -C ${dest}`;
    }
    await Command.exec(commandStr);
}

function unpack(pathToPack, destPathOrCb, cb) {
    if (typeof destPathOrCb === 'function' && cb === undefined) {
        cb = destPathOrCb;
        run(path7za, ['x', pathToPack, '-y'], cb);
    } else {
        run(path7za, ['x', pathToPack, '-y', '-o' + destPathOrCb], cb);
    }
}

function run(bin, args, cb) {
    cb = onceify(cb);
    const runError = new Error(); // get full stack trace
    const proc = spawn(bin, args, {windowsHide: true});
    let output = '';
    proc.on('error', function (err) {
        cb(err);
    });
    proc.on('exit', function (code) {
        let result = null;
        if (args[0] === 'l') {
            result = parseListOutput(output);
        }
        if (code) {
            runError.message = `7-zip exited with code ${code}\n${output}`;
        }
        cb(code ? runError : null, result);
    });
    proc.stdout.on('data', (chunk) => {
        output += chunk.toString();
    });
    proc.stderr.on('data', (chunk) => {
        output += chunk.toString();
    });
}

// http://stackoverflow.com/questions/30234908/javascript-v8-optimisation-and-leaking-arguments
// javascript V8 optimisation and “leaking arguments”
// making callback to be invoked only once
function onceify(fn) {
    let called = false;
    return function () {
        if (called) return;
        called = true;
        fn.apply(this, Array.prototype.slice.call(arguments)); // slice arguments
    };
}

function parseListOutput(str) {
    if (!str.length) return [];
    str = str.replace(/(\r\n|\n|\r)/gm, '\n');
    const items = str.split(/^\s*$/m);
    const res = [];
    const LIST_MAP = {
        'Path': 'name',
        'Size': 'size',
        'Packed Size': 'compressed',
        'Attributes': 'attr',
        'Modified': 'dateTime',
        'CRC': 'crc',
        'Method': 'method',
        'Block': 'block',
        'Encrypted': 'encrypted',
    };

    if (!items.length) return [];

    for (let item of items) {
        if (!item.length) continue;
        const obj = {};
        const lines = item.split('\n');
        if (!lines.length) continue;
        for (let line of lines) {
            // Split by first " = " occurrence. This will also add an empty 3rd elm to the array. Just ignore it
            const data = line.split(/ = (.*)/s);
            if (data.length !== 3) continue;
            const name = data[0].trim();
            const val = data[1].trim();
            if (LIST_MAP[name]) {
                if (LIST_MAP[name] === 'dateTime') {
                    const dtArr = val.split(' ');
                    if (dtArr.length !== 2) continue;
                    obj['date'] = dtArr[0];
                    obj['time'] = dtArr[1];
                } else {
                    obj[LIST_MAP[name]] = val;
                }
            }
        }
        if (Object.keys(obj).length) res.push(obj);
    }
    return res;
}
