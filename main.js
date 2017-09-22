define(function (require, exports, module) {
    "use strict";
    
    var EditorManager   = brackets.getModule("editor/EditorManager"),
        Dialogs         = brackets.getModule("widgets/Dialogs"),
        DefaultDialogs  = brackets.getModule("widgets/DefaultDialogs"),
        ExtensionUtils  = brackets.getModule("utils/ExtensionUtils"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        Mustache        = brackets.getModule("thirdparty/mustache/mustache");

    brackets.getModule("utils/AppInit").appReady(function () { 
        var p4 = require("p4");
        var template = require("text!checkout.html");
        var templateFailure = require("text!checkout-failure.html");
        var templatePerforceConnectionFailure = require("text!connection-failure.html");
        require("checkout");
        
        ExtensionUtils.loadStyleSheet(module, "checkout.css");
        
        var clientName, clientRoot;
        //retrieve general info regarding perforce client
        p4.info().done(function(result) {
            /*Dialogs.showModalDialogUsingTemplate(templatePerforceConnectionFailure);
            var data = {error: "Forced error"};
            var tpl = "{{error}}";
            var tplhtml = Mustache.to_html(tpl, data);
            $(".error-detail").html(tplhtml);*/
            clientName = getClientName(result);
            clientRoot = getClientRoot(result);
        });
        
        $(DocumentManager)
            .on("dirtyFlagChange", function (e, doc) {
                var filePath     = doc.file.fullPath,
                    filename     = doc.file.name,
                    activeEditor = EditorManager.getActiveEditor();
                if (filePath.indexOf(clientRoot) > -1 && doc.isDirty) {
                    //check if file already checked out in perforce. If opened fails, that means it's not.
                    p4.opened(filePath).fail(function(result) {
                        if(activeEditor && doc === activeEditor.document) {
                            //retrieve list of pending changelists to populate a dropdown in the dialog.
                            p4.getPendingChangelists(clientName).done(function(result) {
                                var changelists = getChangelistsArray(result);
                                
                                //prompt dialog to check out file
                                Dialogs.showModalDialogUsingTemplate(template).done(function(clickedButton) {
                                    if (clickedButton === "ok") performCheckout(p4, filePath, Dialogs, templateFailure);
                                });
                                initCheckout(); //init some global variables used in the dialog
                                
                                //create and append dropdown based on the list of changelists 
                                var data = {list: changelists} ;
                                var tpl = "<select disabled onchange='selectOption(this.value)'>{{#list}}<option value={{id}}>{{value}}</option>{{/list}}</select>";
                                var tplhtml = Mustache.to_html(tpl, data);
                                $("#changelists").html(tplhtml); 
                            });
                        }
                    });
                }
            })
            .on("pathDeleted", function (e, path) {
                p4.delete(path).fail(p4.revert(path));   
            });  
    }); 
});