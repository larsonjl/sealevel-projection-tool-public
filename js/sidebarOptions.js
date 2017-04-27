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
	}
	var elements = document.getElementsByClassName("sidebar-question-button");
	for(var ii=0; ii <elements.length; ii++) {
		console.log(elements[ii])
	    elements[ii].style.display = 'none'
	}
	document.getElementById("rcpRadioSelect").style.display = 'none'
	document.getElementById("co2-header").style.display = 'none'
	document.getElementById("rcpHeader").style.display = 'none'
	document.getElementById("rcpBasicRadioSelect").style.display = 'none'
	document.getElementById("runBasicProject").style.display = 'none'
	document.getElementById('basic-sl-text').textContent = 'No basic projection options in vertical crustal motion mode'
	document.getElementById('deselect-all-models').style.display = 'none'

}

function restoreOptionMenu(){
	optionsToRestore = ['giaMenu', 'gdynMenu', "gsmbMenu", "adynMenu", "asmbMenu", "thermoMenu", "glacierMenu"]
	for (options in optionsToRestore){
		document.getElementById(optionsToRestore[options]).style.display = 'inline'
		document.getElementById(optionsToRestore[options] + '-p').style.display = 'inline'
	}
	var elements = document.getElementsByClassName("sidebar-question-button");
	for(var ii=0; ii <elements.length; ii++) {
		console.log(elements[ii])
	    elements[ii].style.display = 'inline'
	}
	document.getElementById("rcpRadioSelect").style.display = 'inline-block'
	document.getElementById("co2-header").style.display = 'inline'
	document.getElementById("rcpHeader").style.display = 'inline'
	document.getElementById("rcpBasicRadioSelect").style.display = 'inline'
	document.getElementById("runBasicProject").style.display = 'inline'
	document.getElementById('deselect-all-models').style.display = 'inline' 
	document.getElementById('basic-sl-text').textContent = 'Future sea level change depends on current and future carbon emissions.  Choose a 21st century carbon emission scenario.'
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
