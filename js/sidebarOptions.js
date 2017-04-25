function setSidebarOptions() {
	$("#gsmbMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'greenSmb'));
	$("#gdynMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'greenDyn'));
	$("#adynMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'antDyn'));
	$("#asmbMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'antSmb'));
	$("#thermoMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'thermo'));
	$("#glacierMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'glacier'));
	$("#giaMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'gia'));

    $('input[type=radio][name=rcpMenuSelect]').change(function() {
        var val = $(this).val();
        if (val == "default"){
            $("#gsmbMenu").attr("disabled", "disabled").html("<option value='none'>None</option>");
            $("#gdynMenu").attr("disabled", "disabled").html("<option value='none'>None</option>");
            $("#asmbMenu").attr("disabled", "disabled").html("<option value='none'>None</option>");
            $("#adynMenu").attr("disabled", "disabled").html("<option value='none'>None</option>");
            $("#thermoMenu").attr("disabled", "disabled").html("<option value='none'>None</option>");
            $("#glacierMenu").attr("disabled", "disabled").html("<option value='none'>None</option>");
			$("#giaMenu").attr("disabled", "disabled").html("<option value='none'>None</option>");

        }

        else if (val == "rcp26") {
			$("#gsmbMenu").removeAttr('disabled').html(getHtmlOptions('rcp26', 'greenSmb'));
            $("#gdynMenu").removeAttr('disabled').html(getHtmlOptions('rcp26', 'greenDyn'));
            $("#adynMenu").removeAttr('disabled').html(getHtmlOptions('rcp26', 'antDyn'));
            $("#asmbMenu").removeAttr('disabled').html(getHtmlOptions('rcp26', 'antSmb'));
            $("#thermoMenu").removeAttr('disabled').html(getHtmlOptions('rcp26', 'thermo'));
            $("#glacierMenu").removeAttr('disabled').html(getHtmlOptions('rcp26', 'glacier'));
			$("#giaMenu").removeAttr('disabled').html(getHtmlOptions('rcp26', 'gia'));


        } else if (val == "rcp45") {
			$("#gsmbMenu").removeAttr('disabled').html(getHtmlOptions('rcp45', 'greenSmb'));
            $("#gdynMenu").removeAttr('disabled').html(getHtmlOptions('rcp45', 'greenDyn'));
            $("#adynMenu").removeAttr('disabled').html(getHtmlOptions('rcp45', 'antDyn'));
            $("#asmbMenu").removeAttr('disabled').html(getHtmlOptions('rcp45', 'antSmb'));
            $("#thermoMenu").removeAttr('disabled').html(getHtmlOptions('rcp45', 'thermo'));
            $("#glacierMenu").removeAttr('disabled').html(getHtmlOptions('rcp45', 'glacier'));
			$("#giaMenu").removeAttr('disabled').html(getHtmlOptions('rcp45', 'gia'));

        } else if (val == "rcp85") {
            $("#gsmbMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'greenSmb'));
            $("#gdynMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'greenDyn'));
            $("#adynMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'antDyn'));
            $("#asmbMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'antSmb'));
            $("#thermoMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'thermo'));
            $("#glacierMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'glacier'));
			$("#giaMenu").removeAttr('disabled').html(getHtmlOptions('rcp85', 'gia'));

        }
    });
};

// Sets menu options based on reference file!
// TO input references again do the following...
// outString += '<option value=' + metaData.ref + '>' + options + ': ' + scenarios + '</option>'

function getHtmlOptions(rcp, component){
    outString = "<option value='none'>None</option>"
    compOptions = sidebar.RCP[rcp][component]
    for (options in compOptions){
        for (scenarios in sidebar.RCP[rcp][component][options]){
            metaData = sidebar.RCP[rcp][component][options][scenarios]
			if (deselectOptions === false){
				if (metaData.default === 'True'){
					outString += '<option selected="selected" value=' + metaData.ref + '>' + scenarios + '</option>'
				}
				else{
	            	outString += '<option value=' + metaData.ref + '>' + scenarios + '</option>'
				}

			}
			else if (deselectOptions === true & freezeOptions === false ){
				outString += '<option value=' + metaData.ref + '>' + scenarios + '</option>'
			}
			else{
				outString += '<option value=' + metaData.ref + ' disabled>' + scenarios + '</option>'
			}
		}
    }
    return outString
}

function freezeAllOptions(){
	if (freezeOptions === false){
		freezeOptions = true;
	}
	turnOptionsToNone();
	setSidebarOptions();
}

function unfreezeAllOptions(){
	if (freezeOptions === true){
		freezeOptions = false;
	}
	turnOptionsOn();
	setSidebarOptions();
}

// Turn all sidebar options to none setting
function turnOptionsToNone(){
	if (deselectOptions === false){
		deselectOptions = true;
	}
	setSidebarOptions();
}

// Turn all sidebar options to default setting
function turnOptionsOn(){
	if (deselectOptions === true){
		deselectOptions = false;
	}
	setSidebarOptions();
}

function removeOptionMenu(){
	optionsToRemove = ['giaMenu', 'gdynMenu', "gsmbMenu", "adynMenu", "asmbMenu", "thermoMenu", "glacierMenu"]
	for (options in optionsToRemove){
		document.getElementById(optionsToRemove[options]).style.display = 'none'
		document.getElementById(optionsToRemove[options] + '-p').style.display = 'none'
		document.getElementById(optionsToRemove[options] + '-q').style.display = 'none'
	}
	document.getElementById("rcpRadioSelect").style.display = 'none'
	document.getElementById("co2-header").style.display = 'none'
	document.getElementById("rcp-q").style.display = 'none'
	document.getElementById("rcpHeader").style.display = 'none'

}

function restoreOptionMenu(){
	optionsToRemove = ['giaMenu', 'gdynMenu', "gsmbMenu", "adynMenu", "asmbMenu", "thermoMenu", "glacierMenu"]
	for (options in optionsToRemove){
		document.getElementById(optionsToRemove[options]).style.display = 'inline'
		document.getElementById(optionsToRemove[options] + '-p').style.display = 'inline'
		document.getElementById(optionsToRemove[options] + '-q').style.display = 'inline'
	}
	document.getElementById("rcpRadioSelect").style.display = 'inline-block'
	document.getElementById("co2-header").style.display = 'inline'
	document.getElementById("rcp-q").style.display = 'inline'
	document.getElementById("rcpHeader").style.display = 'inline-block'
}

// When basic setting clicked, changes advanced too.  Also resets options
// to default values.
 $(document).ready(function() {
    $(':radio[value=rcp85]').change(function(){
        $(':radio[value=rcp85]').prop('checked',true);
		turnOptionsOn();
    });
 });

 $(document).ready(function() {
    $(':radio[value=rcp45]').change(function(){
        $(':radio[value=rcp45]').prop('checked',true);
		turnOptionsOn();
    });
 });

 $(document).ready(function() {
   $(':radio[value=rcp26]').change(function(){
        $(':radio[value=rcp26]').prop('checked',true);
		turnOptionsOn();
    });
 });
