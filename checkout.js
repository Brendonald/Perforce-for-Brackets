var GLOBAL_SELECTED_OPTION;
var GLOBAL_SELECTED_CHANGELIST;

function initCheckout() {
    GLOBAL_SELECTED_OPTION = $(".option:checked").val();
    GLOBAL_SELECTED_CHANGELIST = "select"; 
}

function changeAction(action) {
    $(".option").prop('checked', false);
    action.checked = true; 
    GLOBAL_SELECTED_OPTION = action.value;
    
    if (action.value === "changelist-checkout") {
        $(".pick-changelist").addClass("enabled");
        $("#changelists select").prop("disabled", false);
        
        if (GLOBAL_SELECTED_CHANGELIST === "select") {
            $('.primary').attr('disabled', true);
            $('.primary').attr('title', "You either need to select a changelist or select a different checkout option");
        }
        else {
            $('.primary').attr('disabled', false);
            $('.primary').attr('title', "");
        }
    }
    else {
        $(".pick-changelist").removeClass("enabled");
        $("#changelists select").prop("disabled", "disabled");  
        $('.primary').attr('disabled', false);
        $('.primary').attr('title', "");
    }
} 

function getClientName(info) {
    var clientNameSubstring = info.split('Client name: ')[1];
    var clientName = clientNameSubstring.slice(0, clientNameSubstring.indexOf('\n')).trim();
    return clientName;
}

function getClientRoot(info) {
    var clientRootSubstring = info.split('Client root: ')[1];
    var clientRoot = clientRootSubstring.slice(0, clientRootSubstring.indexOf('\n')).replace(/\\/g, "/").trim();
    return clientRoot;
}

function getChangelistsArray(changelists) {
    var changelistsArray = [{id: 'select', value: 'Select changelist...'}];
    var substr = changelists.split('Change ');
    for (var i = 1; i < substr.length; i++) {
        var id = substr[i].slice(0, 6);
        var description = substr[i].slice(substr[i].indexOf("'") + 1, substr[i].indexOf("\n") - 2);
        var option = {id: id, value: id + " - " + description};
        changelistsArray.push(option);
    }
    return changelistsArray;
}

function selectOption(changelist) {
    GLOBAL_SELECTED_CHANGELIST = changelist;
    
    if (GLOBAL_SELECTED_CHANGELIST === "select") {
        $('.primary').attr('disabled', true);
        $('.primary').attr('title', "You either need to select a changelist or select a different checkout option");
    }
    else {
        $('.primary').attr('disabled', false);
        $('.primary').attr('title', "");
    }    
}

function performCheckout(p4, filePath, Dialogs, errorTemplate) {
    if (GLOBAL_SELECTED_OPTION === "default-checkout") {
        p4.checkout(filePath).always(function (result) {
            if (result.indexOf("opened for edit") < 0) {
                p4.add(filePath).always(function (result) {
                    if (result.indexOf("opened for add") < 0) {
                        Dialogs.showModalDialogUsingTemplate(errorTemplate);
                        var data = {error: result};
                        var tpl = "{{error}}";
                        var tplhtml = Mustache.to_html(tpl, data);
                        $(".error-detail").html(tplhtml);
                    }
                });
            }
        });
    }
    
    if (GLOBAL_SELECTED_OPTION === "changelist-checkout") {
        p4.checkoutinchangelist(filePath, GLOBAL_SELECTED_CHANGELIST).always(function (result) {
            if (result.indexOf("opened for edit") < 0) {
                p4.addinchangelist(filePath, GLOBAL_SELECTED_CHANGELIST).always(function (result) {
                    if (result.indexOf("opened for add") < 0) {
                        Dialogs.showModalDialogUsingTemplate(errorTemplate);
                        var data = {error: result};
                        var tpl = "{{error}}";
                        var tplhtml = Mustache.to_html(tpl, data);
                        $(".error-detail").html(tplhtml);
                    }
                });
            }
        });
    }
}