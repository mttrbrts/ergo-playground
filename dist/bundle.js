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
        'source' : 'jura',
        'target' : 'javascript',
        'withdispatch' : false
    };
    // Clean-up naming for Sexps
    config.jura = document.getElementById("source").value;
    // Call compiler
    document.getElementById("result").innerHTML = "[ Jura logic is compiling ]";
    const compiled = Jura.compile(config).result;
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
        'source' : 'jura',
        'target' : 'javascript',
        'withdispatch' : false
    };
    // Clean-up naming for Sexps
    config.jura = document.getElementById("source").value;
    // Call compiler
    document.getElementById("result").innerHTML = "[ Compiling contract ]";
    const compiled = Jura.compile(config).result;
    if (JSON.stringify(compiled).indexOf("Compilation error") !== -1) {
	document.getElementById("result").innerHTML = escapeHtml(JSON.stringify(compiled));
    } else {
	document.getElementById("result").innerHTML = "[ Executing contract ]";
	const contractJson = JSON.parse(document.getElementById("contract").value);
	const requestJson = JSON.parse(document.getElementById("request").value);
	const stateJson = JSON.parse(document.getElementById("state").value);
	const contractName = document.getElementById("contractName").value;
	const clauseName = document.getElementById("clauseName").value;
	const params = { 'contract': contractJson, 'request': requestJson, 'state' : stateJson, 'now': "" };
	const contract = 'const contract = new ' + contractName+ '();'; // Instantiate the contract
	const functionName = 'contract.' + clauseName;
	const clauseCall = functionName+'(params);'; // Create the clause call
	var result;
	try {
	    result = eval(compiled + contract + clauseCall); // Call the logic
	    if (!('response' in result)) {
		document.getElementById("result").innerHTML = escapeHtml(JSON.stringify(result))
		document.getElementById("newstate").innerHTML = escapeHtml("");
	    } else {
		document.getElementById("result").innerHTML = escapeHtml(JSON.stringify(result.response));
		document.getElementById("newstate").innerHTML = escapeHtml(JSON.stringify(result.state));
	    }
	}
	catch(error) {
	    document.getElementById("result").innerHTML = escapeHtml(error);
	};
    }
}
function showVersion() {
    document.getElementById("version").innerHTML += " (v " + Jura.version() + ")";
}
