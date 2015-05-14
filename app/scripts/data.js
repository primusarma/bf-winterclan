function getData(f){
	function createDelay(){
		$loaderOverlay.find('.text').text('processing clan data...');
		setTimeout(function (e){f();}, 50); //need this delay otherwise loader's text won't change
	}

	function getSpreadsheetData(){
		$.getJSON(onlineOffline('https://winterclan.net/php/getSSData.php'), function (data){
			dataSet = $.parseJSON(data);
			rosterData = dataSet.compiled.roster;
			getPSNStatuses(createDelay); //online.js - it will execute j();
		}).fail(function (e){ //error
			//console.log('error', e);
			$loaderOverlay.find('.text').text('no PlayStation®Network data...');
		});
	}

	getSpreadsheetData();
}