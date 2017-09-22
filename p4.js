define(function (require, exports, module) {
    "use strict";
    
    var nodeConnection = new (brackets.getModule("utils/NodeConnection"))(),
        extUtils       = brackets.getModule("utils/ExtensionUtils"),
        p4Path         = extUtils.getModulePath(module, "node-p4.js"), 
        init           = nodeConnection.connect(true)
            .pipe(function () {
                return nodeConnection.loadDomains([p4Path], true);
            });
    
    module.exports = {
        
        checkout: function (filepath) {
            return init.pipe(function () {   
                return nodeConnection.domains.perforce.checkout(filepath);   
            });
        },
        checkoutinchangelist: function (filepath, changelist) {
            return init.pipe(function () {   
                return nodeConnection.domains.perforce.checkoutinchangelist(filepath, changelist);   
            });
        },
        add: function (filepath) {
            return init.pipe(function () { 
                return nodeConnection.domains.perforce.add(filepath);
            });
        },
        addinchangelist: function (filepath, changelist) {
            return init.pipe(function () { 
                return nodeConnection.domains.perforce.addinchangelist(filepath, changelist);
            });
        },
        "delete": function (filepath) {
            return init.pipe(function () { 
                return nodeConnection.domains.perforce.delete(filepath); 
            });
        }, 
        revert: function (filepath) {
            return init.pipe(function () { 
                return nodeConnection.domains.perforce.revert(filepath);   
            });
        },
        opened: function (filepath) {
            return init.pipe(function () { 
                return nodeConnection.domains.perforce.opened(filepath);   
            });
        },
        info: function() {
            return init.pipe(function () { 
                return nodeConnection.domains.perforce.info();   
            });
        },
        getPendingChangelists: function(clientName) {
            return init.pipe(function () { 
                return nodeConnection.domains.perforce.getPendingChangelists(clientName);   
            });
        },
    };
   
});