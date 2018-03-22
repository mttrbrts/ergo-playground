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
    document.getElementById("result").innerHTML = "[ Query is executing ]";
    const compiled = Jura.compile(config).result;
    
    const contractJson = JSON.parse(document.getElementById("contract").value);
    const requestJson = JSON.parse(document.getElementById("request").value);
    const contractName = document.getElementById("contractName").value;
    const clauseName = document.getElementById("clauseName").value;
    const params = { 'contract': contractJson, 'request': requestJson, 'now': "" };
    const contract = 'const contract = new ' + contractName+ '();'; // Instantiate the contract
    const functionName = 'contract.' + clauseName;
    const clauseCall = functionName+'(params);'; // Create the clause call
    const result = eval(compiled + contract + clauseCall); // Call the logic
    document.getElementById("result").innerHTML = escapeHtml(JSON.stringify(result));
}
function showVersion() {
    document.getElementById("version").innerHTML += " (v " + Jura.version() + ")";
}
