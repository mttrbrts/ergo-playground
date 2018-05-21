var entityMap = {
	"&" : "&amp;",
	"<" : "&lt;",
	">" : "&gt;",
	'"' : '&quot;',
	"'" : '&#39;',
	"/" : '&#x2F;'
};
function showVersion() {
    document.getElementById("version").innerHTML += " (v " + Ergo.version() + ")";
}
const defaultTemplate = {
    'name': 'HelloWorld',
    'ergo': '/*\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n * http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\nnamespace org.accordproject.helloworld\n\ncontract HelloWorld over TemplateModel {\n  // Simple Clause\n  clause helloworld(request : Request) : Response {\n    return new Response{ output: "Hello " ++ contract.name ++ " " ++ request.input }\n  }\n}\n',
    'models': [],
    'contract': '{"$class":"org.accordproject.helloworld.TemplateModel","name":"Fred Blogs"}',
    'request': '{\n    "$class": "org.accordproject.helloworld.Request",\n    "input": "Accord Project"\n}\n',
    'state': '{\n    "$class": "org.accordproject.common.ContractState",\n    "stateId": "org.accordproject.common.ContractState#1"\n}\n',
    'contractname': 'HelloWorld'
};
function escapeHtml(string) {
	return String(string).replace(/[&<>"'\/]/g, function(s) {
		return entityMap[s];
	});
}
function initForm() {
    var index = 0;
    for (var i = 0; i < examples.length; i++) {
        var newSelect = document.createElement('option');
        if (examples[i].name === defaultTemplate.name) {
            index = i;
        }
        selectHTML = "<option value='" + examples[i].name + "'>" + examples[i].name + "</option>";
        newSelect.innerHTML = selectHTML;
        document.getElementById('template').add(newSelect);
    }
    document.getElementById('template').selectedIndex = index;
    setTemplate(defaultTemplate.name);
}
function compileButton() {
    // Built-in config
    const config= {
        'source' : 'ergo',
        'target' : 'javascript'
    };
    // Clean-up naming for Sexps
    config.ergo = document.getElementById("source").value;
    // Call compiler
    document.getElementById("result").innerHTML = "[ Ergo logic is compiling ]";
    const compiled = Ergo.compile(config).result;
    document.getElementById("result").innerHTML = escapeHtml(compiled);
}
function contractNameOfName(name) {
    return findTemplate(name).contractname;
}
function runButton() {
    // Built-in config
    const config= {
        'source' : 'ergo',
        'target' : 'javascript',
        'withdispatch' : false
    };
    // Clean-up naming for Sexps
    config.ergo = document.getElementById("source").value;
    // Call compiler
    document.getElementById("result").innerHTML = "[ Compiling contract ]";
    const compiled = Ergo.compile(config).result;
    if (JSON.stringify(compiled).indexOf("Compilation error") !== -1) {
	document.getElementById("result").innerHTML = escapeHtml(JSON.stringify(compiled));
    } else {
	document.getElementById("result").innerHTML = "[ Executing contract ]";
	const contractJson = JSON.parse(document.getElementById("contract").value);
	const requestJson = JSON.parse(document.getElementById("request").value);
	const stateJson = JSON.parse(document.getElementById("state").value);
	const contractName = contractNameOfName(document.getElementById("template").value);
	const params = { 'contract': contractJson, 'request': requestJson, 'state' : stateJson, 'emit': [], 'now': moment('2018-05-21') };
	const contract = 'const contract = new ' + contractName+ '();'; // Instantiate the contract
	const functionName = 'contract.main';
	const clauseCall = functionName+'(params);'; // Create the clause call
	var result;
	try {
	    result = eval(compiled + contract + clauseCall); // Call the logic
	    if (!('left' in result)) {
		document.getElementById("result").innerHTML = escapeHtml(JSON.stringify(result.right))
	    } else {
		document.getElementById("result").innerHTML = escapeHtml(JSON.stringify(result.left.response));
		document.getElementById("state").innerHTML = escapeHtml(JSON.stringify(result.left.state));
	    }
	}
	catch(error) {
	    document.getElementById("result").innerHTML = escapeHtml(error);
	};
    }
}
function findTemplate(name) {
    for (var i = 0; i < examples.length; i++) {
        if (examples[i].name === name) {
            return examples[i];
        }
    }
    return defaultTemplate;
}
function setTemplate(contractName) {
    const template = findTemplate(contractName);
	  document.getElementById("source").innerHTML = template.ergo;
	  if (template.models.length > 0) {
        document.getElementById("model").innerHTML = template.models[0];
    }
	  document.getElementById("contract").innerHTML = template.contract;
	  document.getElementById("grammar").innerHTML = template.grammar;
	  document.getElementById("request").innerHTML = template.request;
	  document.getElementById("state").innerHTML = template.state;
	  document.getElementById("result").innerHTML = "";
}
function fillTemplate() {
    const contractName = document.getElementById("template").value;
    setTemplate(contractName);
}
