/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const Fs = require('fs');
const Path = require('path');

// Set of tests
const workload = JSON.parse(Fs.readFileSync(Path.resolve(__dirname, 'workload.json'), 'utf8'));
const outFile = Path.resolve(__dirname, '..', 'dist', "examples_bundle.js");

let examples = "";

function escapeStr(str) {
    let res;
    res = str.replace(/(?:\r\n|\r|\n)/g, '\\n');
    res = res.replace(/(')/g, '\\\'');
    return res;
}

function mk_example(name, ergo, models, contract, request, state, contractname) {
    let example = "";
    example += "  {" + "\n";
    example += "    \'name': '" + name + "',\n";
    example += "    'ergo': '" + escapeStr(ergo) + "',\n";
    example += "    'models': []," + "\n";
    example += "    'contract': '" + escapeStr(contract) + "',\n";
    example += "    'request': '" + escapeStr(request) + "',\n";
    example += "    'state': '" + escapeStr(state) + "',\n";
    example += "    'contractname': '" + contractname + "'\n";
    example += "  }";
    return example;
}

function mk_examples(workload) {
    examples += "let examples =";
    examples += "[\n";
    for (const i in workload) {
        const test = workload[i];
        const name = test.name;
        const dir = test.dir;
        const ergo = test.ergo;
        const models = test.models;
        const contract = test.contract;
        const request = test.request;
        const state = test.state;
        const contractname = test.contractname;

        const ergoText = Fs.readFileSync(Path.resolve(__dirname, dir, ergo), 'utf8');
        let ctoTexts = [];
        for (let i = 0; i < models.length; i++) {
            ctoTexts.push(Fs.readFileSync(Path.resolve(__dirname, dir, models[i]), 'utf8'));
        }
        const contractJson = Fs.readFileSync(Path.resolve(__dirname, dir, contract), 'utf8');
        const requestJson = Fs.readFileSync(Path.resolve(__dirname, dir, request), 'utf8');
        const stateJson = Fs.readFileSync(Path.resolve(__dirname, dir, state), 'utf8');
        //console.info(mk_example(name,ergo,models,contract,request,state,contractname));
        if (i > 0) {
            examples += ",\n";
        }
        examples += mk_example(name,ergoText,models,contractJson,requestJson,stateJson,contractname);
    }
    examples += "\n];\n";
}

function mk_postamble() {
    examples += "//console.log(JSON.stringify(examples));\n";
}

function mk_top() {
    mk_examples(workload);
    mk_postamble(workload);
}

mk_top();
Fs.writeFileSync(outFile, examples);

