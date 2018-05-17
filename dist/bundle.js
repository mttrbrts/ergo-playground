var entityMap = {
	"&" : "&amp;",
	"<" : "&lt;",
	">" : "&gt;",
	'"' : '&quot;',
	"'" : '&#39;',
	"/" : '&#x2F;'
};
function escapeHtml(string) {
	return String(string).replace(/[&<>"'\/]/g, function(s) {
		return entityMap[s];
	});
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
function setState() {
    document.getElementById("state").innerHTML = document.getElementById("newstate").value;
    document.getElementById("newstate").innerHTML = "";
}
function clearState() {
    document.getElementById("newstate").innerHTML = "";
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
	const contractName = document.getElementById("contractName").value;
	const params = { 'contract': contractJson, 'request': requestJson, 'state' : stateJson, 'now': "" };
	const contract = 'const contract = new ' + contractName+ '();'; // Instantiate the contract
	const functionName = 'contract.main';
	const clauseCall = functionName+'(params);'; // Create the clause call
	var result;
	try {
	    result = eval(compiled + contract + clauseCall); // Call the logic
	    if (!('left' in result)) {
		document.getElementById("result").innerHTML = escapeHtml(JSON.stringify(result.right))
		document.getElementById("newstate").innerHTML = escapeHtml("");
	    } else {
		document.getElementById("result").innerHTML = escapeHtml(JSON.stringify(result.left.response));
		document.getElementById("newstate").innerHTML = escapeHtml(JSON.stringify(result.left.state));
	    }
	}
	catch(error) {
	    document.getElementById("result").innerHTML = escapeHtml(error);
	};
    }
}
function showVersion() {
    document.getElementById("version").innerHTML += " (v " + Ergo.version() + ")";
}
