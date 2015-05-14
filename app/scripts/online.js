//Only PSN for now
function getPSNStatuses(f){
	function getPSNData(){
		$.getJSON(onlineOffline('https://winterclan.net/php/getPSData.php'), function (data){

			try{
				data = $.parseJSON(data);
			}catch(error){
				console.log('error parsing the PSN data: 1');
			}

			psnDataSet = {_timeStampData:data[0], _memberData:data[1]};

			if(t){
				t = false;
				f();
			}

			for(var k in psnDataSet._memberData){ //put the trophies in the roster dataset to show on the profiles
				dataSet.compiled.roster[k] ? dataSet.compiled.roster[k].trophySummary = psnDataSet._memberData[k].trophySummary : 0;
			}

			createPSN(); //team.js
			statusInterval = setTimeout(function (e){getPSNData();}, 60000);
		}).fail( function (e){
			$loaderOverlay.find('.text').text('unable to load PlayStation®Network data');
			statusInterval = setTimeout(function (e){getPSNData();}, 60000);
			console.log('error getting PSN data: 2');
		});
	}

	var t = true;
	var key = '1hsUVPL6JSTZ6oWIHX8bZanhxu5FKNm2i0nuhsuycC5E';
	var statusInterval;

	getPSNData();
}

function whoIsOnline(){
	var $memberList = $('#memberList').find('.members');
	var a = [], k, s = '', d, now, n;

	try{
		if(psnDataSet._memberData && psnDataSet._memberData.Freeseus && psnDataSet._memberData.Lorquas && psnDataSet._memberData.Epyos){
			for(k in psnDataSet._memberData){
				if(psnDataSet._memberData[k].presence && rosterData[k] && dataSet.compiled.roster[k].ps4){ //PS4
					if(psnDataSet._memberData[k].presence.primaryInfo.onlineStatus === 'online' && psnDataSet._memberData[k].presence.primaryInfo.gameTitleInfo){
						a.push({player:k, online:psnDataSet._memberData[k].presence.primaryInfo.gameTitleInfo.titleName, system:'PS4'});
					}else if(psnDataSet._memberData[k].presence.primaryInfo.onlineStatus === 'online'){
						a.push({player:k, online:true, system:'PS4'});
					}else{
						d = new Date(psnDataSet._memberData[k].presence.primaryInfo.lastOnlineDate);
						now = new Date();
						n = Math.floor((now.getTime() - d.getTime()) / 1000 / 60); //1000 / 60 / 60 gives you hours ago

						if(n <= 70){
							a.push({player:k, online:n, system:'PS4'});
						}else{
							a.push({player:k, online:false, system:'PS4'});
						}
					}
				}else if(psnDataSet._memberData[k].presence){ //PS3
					if(psnDataSet._memberData[k].presence.primaryInfo.onlineStatus === 'online' && psnDataSet._memberData[k].presence.primaryInfo.gameTitleInfo){
						a.push({player:k, online:psnDataSet._memberData[k].presence.primaryInfo.gameTitleInfo.titleName, system:'PS3'});
					}else if(psnDataSet._memberData[k].presence.primaryInfo.onlineStatus === 'online'){
						a.push({player:k, online:true, system:'PS3'});
					}else{
						d = new Date(psnDataSet._memberData[k].presence.primaryInfo.lastOnlineDate);
						now = new Date();
						n = Math.floor((now.getTime() - d.getTime()) / 1000 / 60); //1000 / 60 / 60 gives you hours ago

						if(n <= 70){
							a.push({player:k, online:n, system:'PS3'});
						}else{
							a.push({player:k, online:false, system:'PS3'});
						}
					}

					if(psnDataSet._memberData[k].personalDetail && psnDataSet._memberData[k].personalDetail.profilePictureUrl){ //needed by the website to give you the secure lock logo
						psnDataSet._memberData[k].personalDetail.profilePictureUrl = psnDataSet._memberData[k].personalDetail.profilePictureUrl.split('http://').join('https://');
					}else{
						psnDataSet._memberData[k].avatarUrl = psnDataSet._memberData[k].avatarUrl.split('http://').join('https://');
					}
				}
			}

			a.sort(gameOnlineOffline);
		}else{
			console.log('No PSN member data was retrieved from server!');
		}
	}catch(error){
		console.log('error in whoIsOnline function');
		a = [];
	}

	return a;
}