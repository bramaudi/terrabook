import { exec } from "child_process";
import { existsSync } from "fs";
import fs from 'fast-glob'
import { basename } from "path";

const fetch = type => {
    exec(`node ./labs/crawler/${type}/run.js`)
    .stdout
    .on('data', data => {
        console.log(data.replace(/\n/, ''));
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