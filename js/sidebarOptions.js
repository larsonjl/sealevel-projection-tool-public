$(document).ready(function() {
	$("#gsmbMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'greenSmb'));
	$("#gdynMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'greenDyn'));
	$("#adynMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'antDyn'));
	$("#asmbMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'antSmb'));
	$("#thermoMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'thermo'));
	$("#glacierMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'glacier'));

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
			$("#gsmbMenu").removeAttr('disabled').html(getHtmlOptions('rcp26', 'greenSmb'));
            $("#gdynMenu").removeAttr('disabled').html(getHtmlOptions('rcp26', 'greenDyn'));
            $("#adynMenu").removeAttr('disabled').html(getHtmlOptions('rcp26', 'antDyn'));
            $("#asmbMenu").removeAttr('disabled').html(getHtmlOptions('rcp26', 'antSmb'));
            $("#thermoMenu").removeAttr('disabled').html(getHtmlOptions('rcp26', 'thermo'));
            $("#glacierMenu").removeAttr('disabled').html(getHtmlOptions('rcp26', 'glacier'));
        } else if (val == "rcp45") {
			$("#gsmbMenu").removeAttr('disabled').html(getHtmlOptions('rcp45', 'greenSmb'));
            $("#gdynMenu").removeAttr('disabled').html(getHtmlOptions('rcp45', 'greenDyn'));
            $("#adynMenu").removeAttr('disabled').html(getHtmlOptions('rcp45', 'antDyn'));
            $("#asmbMenu").removeAttr('disabled').html(getHtmlOptions('rcp45', 'antSmb'));
            $("#thermoMenu").removeAttr('disabled').html(getHtmlOptions('rcp45', 'thermo'));
            $("#glacierMenu").removeAttr('disabled').html(getHtmlOptions('rcp45', 'glacier'));
        } else if (val == "rcp85") {
            $("#gsmbMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'greenSmb'));
            $("#gdynMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'greenDyn'));
            $("#adynMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'antDyn'));
            $("#asmbMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'antSmb'));
            $("#thermoMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'thermo'));
            $("#glacierMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'glacier'));
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

// When basic setting clicked, changes advanced too
 $(document).ready(function() {
    $(':radio[value=rcp85]').change(function(){
        $(':radio[value=rcp85]').prop('checked',true);
    });
 });

 $(document).ready(function() {
    $(':radio[value=rcp45]').change(function(){
        $(':radio[value=rcp45]').prop('checked',true);
    });
 });

 $(document).ready(function() {
   $(':radio[value=rcp26]').change(function(){
        $(':radio[value=rcp26]').prop('checked',true);
    });
 });
