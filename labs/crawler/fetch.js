import { spawn } from "child_process";
import { existsSync } from "fs";
import fs from 'fast-glob'
import { basename } from "path";

const fetch = type => {
    spawn('node', [`./labs/crawler/${type}/run.js`]).stdout.on('data', data => {
        process.stdout.write(`${data}`);
    })
}

(async () => {
    let [type] = process.argv.slice(2)
    if (type) {
        if (!existsSync(`./labs/crawler/${type}/run.js`)) {
            return console.log('type doesn\'t exists');
        }
        fetch(type)
    }
    else {
        const type_dirs = fs
            .sync('./labs/crawler/*', { onlyDirectories: true })
            .filter(v => !v.match('_'))
            .map(v => basename(v))
        
        for (const dirname of type_dirs) {
            fetch(dirname)
        }
    }
})()