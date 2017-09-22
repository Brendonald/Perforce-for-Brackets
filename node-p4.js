var exec = require("child_process").exec;

var p4checkout = function (filepath, callback) { 
    exec("p4 edit \""+filepath+"\"", function(err, stdout, stderr) { 
        callback(stderr, stdout);
    });
};
var p4checkoutinchangelist = function (filepath, changelist, callback) { 
    exec("p4 edit -c "+changelist+" \""+filepath+"\"", function(err, stdout, stderr) {
        callback(stderr, stdout);
    });
};

var p4add = function (filepath, changelist, callback) {
    exec("p4 add \""+filepath+"\"", function(err, stdout, stderr) { 
        callback(stderr, stdout);
    });
};

var p4addinchangelist = function (filepath, changelist, callback) {
    exec("p4 add -c "+changelist+" \""+filepath+"\"", function(err, stdout, stderr) {
        callback(stderr, stdout);
    });
};

var p4delete = function (filepath, callback) {
    exec("p4 delete \""+filepath+"\"", function(err, stdout, stderr) {
        callback(stderr, stdout);
    });
};

var p4revert = function (filepath, callback) {
    exec("p4 revert \""+filepath+"\"", function(err, stdout, stderr) {
        callback(stderr, stdout);
    });   
};

var p4opened = function (filepath, callback) {
    exec("p4 opened \""+filepath+"\"", function(err, stdout, stderr) {
        callback(stderr, stdout);
    });   
};

var p4info = function (callback) {
    exec("p4 info", function(err, stdout, stderr) {
        callback(stderr, stdout);
    });
};

var p4getPendingChangelists = function (clientName, callback) {
    exec("p4 changes -c "+clientName+" -s pending", function(err, stdout, stderr) {
         callback(stderr, stdout);
    });
};

exports.init = function (DomainManager) {
    if(!DomainManager.hasDomain("perforce")) {
      DomainManager.registerDomain("perforce", {major: 0, minor: 1});   
    } 
    
    DomainManager.registerCommand(
        "perforce",
        "checkout",
        p4checkout,
        true,
        "Attempts to checkout a file to the default changelist",
        [{path: "filepath", type: "string"}],
        []
    );
    
    DomainManager.registerCommand(
        "perforce",
        "checkoutinchangelist",
        p4checkoutinchangelist,
        true,
        "Attempts to checkout a file to the selected changelist",
        [{path: "filepath", type: "string"}, {name: "changelist", type: "string"}],
        []
    );
    
    DomainManager.registerCommand(
        "perforce",
        "delete",
        p4delete,
        true,
        "Attempts to delete a file to the user's default changelist",
        [{path: "filepath", type: "string"}],
        []
    );
    
    DomainManager.registerCommand(
        "perforce",
        "add",
        p4add,
        true,
        "Attempts to add a file to the default changelist",
        [{path: "filepath", type: "string"}],
        []
    );
    
    DomainManager.registerCommand(
        "perforce",
        "addinchangelist",
        p4addinchangelist,
        true,
        "Attempts to add a file to the selected changelist",
        [{path: "filepath", type: "string"}, {name: "changelist", type: "string"}],
        []
    );
    
    
    DomainManager.registerCommand(
        "perforce",
        "revert",
        p4revert,
        true,
        "Attempts to revert a file to the user's default changelist",
        [{path: "filepath", type: "string"}],
        []
    );
    
    DomainManager.registerCommand(
        "perforce",
        "opened",
        p4opened,
        true,
        "Checks if a file is checked out to the user's workspace",
        [{path: "filepath", type: "string"}],
        []
    );
    
    DomainManager.registerCommand(
        "perforce",
        "info",
        p4info,
        true,
        "Gets info client",
        [],
        []
    );
    
    DomainManager.registerCommand(
        "perforce",
        "getPendingChangelists",
        p4getPendingChangelists,
        true,
        "Gets pending changelists for client",
        [{name: "clientName", type: "string"}],
        []
    );
};