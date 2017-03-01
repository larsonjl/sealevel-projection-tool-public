$(document).ready(function() {
    $("#gsmbMenu").attr("disabled", "disabled");
    $("#gdynMenu").attr("disabled", "disabled");
    $("#adynMenu").attr("disabled", "disabled");
    $("#asmbMenu").attr("disabled", "disabled");
    $("#thermoMenu").attr("disabled", "disabled");
    $("#glacierMenu").attr("disabled", "disabled");

    $('input[type=radio][name=rcpMenuSelect]').change(function() {
        var val = $(this).val();
        if (val == "default"){
            $("#gsmbMenu").attr("disabled", "disabled").html("<option value='none'>None</option>");
            $("#gdynMenu").attr("disabled", "disabled").html("<option value='none'>None</option>");
            $("#asmbMenu").attr("disabled", "disabled").html("<option value='none'>None</option>");
            $("#adynMenu").attr("disabled", "disabled").html("<option value='none'>None</option>");
            $("#thermoMenu").attr("disabled", "disabled").html("<option value='none'>None</option>");
            $("#glacierMenu").attr("disabled", "disabled").html("<option value='none'>None</option>");
        }

        else if (val == "rcp26") {
            $("#gsmbMenu").removeAttr('disabled').html("<option value='none'>None</option>");
            $("#gdynMenu").removeAttr('disabled').html("<option value='none'>None</option><option value='gripcc'>IPCC AR5 RCP2.6</option>");
            $("#adynMenu").removeAttr('disabled').html("<option value='none'>None</option><option value='gripcc'>IPCC AR5 RCP2.6</option>");
            $("#asmbMenu").removeAttr('disabled').html("<option value='none'>None</option><option value='gripcc'>IPCC AR5 RCP2.6</option>");
            $("#thermoMenu").removeAttr('disabled').html("<option value='none'>None</option><option value='gripcc'>IPCC AR5 RCP2.6</option>");
            $("#glacierMenu").removeAttr('disabled').html("<option value='none'>None</option><option value='gripcc'>IPCC AR5 RCP2.6</option>");
			rcpMenu = 'rcp26'
        } else if (val == "rcp45") {
            $("#gsmbMenu").removeAttr('disabled').html("<option value='none'>None</option>");
            $("#gdynMenu").removeAttr('disabled').html("<option value='none'>None</option><option value='gripcc'>IPCC AR5 RCP2.6</option>");
            $("#adynMenu").removeAttr('disabled').html("<option value='none'>None</option><option value='gripcc'>IPCC AR5 RCP2.6</option>");
            $("#asmbMenu").removeAttr('disabled').html("<option value='none'>None</option><option value='gripcc'>IPCC AR5 RCP2.6</option>");
            $("#thermoMenu").removeAttr('disabled').html("<option value='none'>None</option><option value='gripcc'>IPCC AR5 RCP2.6</option>");
            $("#glacierMenu").removeAttr('disabled').html("<option value='none'>None</option><option value='gripcc'>IPCC AR5 RCP2.6</option>");
			rcpMenu = 'rcp45'
        } else if (val == "rcp85") {
            $("#gsmbMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'greenSmb'));
            $("#gdynMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'greenDyn'));
            $("#adynMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'antDyn'));
            $("#asmbMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'antSmb'));
            $("#thermoMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'thermo'));
            $("#glacierMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'glacier'));
			rcpMenu = 'rcp85'

        }
    });
});

// Sets menu options based on reference file!
function getHtmlOptions(rcp, component){
    outString = "<option value='none'>None</option>"
    compOptions = sidebar.RCP[rcp][component]
    for (options in compOptions){
        for (scenarios in sidebar.RCP[rcp][component][options]){
            metaData = sidebar.RCP[rcp][component][options][scenarios]
            outString += '<option value=' + metaData.ref + '>' + options + ': ' + scenarios + '</option>'}
    }
    return outString
}
