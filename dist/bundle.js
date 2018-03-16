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
    document.getElementById("result").innerHTML = "[ Query is compiling ]";
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
    
    const clauseJson = {
	"$class": "org.accordproject.helloworld.TemplateModel",
	"name": "Fred Blogs"
    };
    const requestJson = {
	"$class": "org.accordproject.helloworld.Request",
	"input": "Accord Project"
    };
    const contractName = "HelloWorld";
    const clauseName = "helloworld";
    const params = { 'this': clauseJson, 'request': requestJson, 'now': "" };
    const contract = 'const c = new ' + contractName+ '();'; // Instantiate the contract
    const functionName = 'c.' + clauseName;
    const clauseCall = functionName+'(params);'; // Create the clause call
    const result = eval(compiled + contract + clauseCall); // Call the logic
    document.getElementById("result").innerHTML = escapeHtml(JSON.stringify(result));
}
