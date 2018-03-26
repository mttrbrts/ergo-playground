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
	const contractName = document.getElementById("contractName").value;
	const clauseName = document.getElementById("clauseName").value;
	const params = { 'contract': contractJson, 'request': requestJson, 'now': "" };
	const contract = 'const contract = new ' + contractName+ '();'; // Instantiate the contract
	const functionName = 'contract.' + clauseName;
	const clauseCall = functionName+'(params);'; // Create the clause call
	var result;
	try {
	    result = eval(compiled + contract + clauseCall); // Call the logic
	    document.getElementById("result").innerHTML = escapeHtml(JSON.stringify(result));
	}
	catch(error) {
	    document.getElementById("result").innerHTML = escapeHtml(error);
	};
    }
}
function showVersion() {
    document.getElementById("version").innerHTML += " (v " + Jura.version() + ")";
}
