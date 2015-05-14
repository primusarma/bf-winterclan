$(function(){
	function getIP(d){
		if(isOnline()){
			$.getJSON('php/ip.php', function (ip){
				ip ? userIP = ip : 0;
				legal();
				create();
			});
		}else{ //for test purposes
			legal();
			create();
			revealSite();
		}
	}

	function create(){
		for(var i = 0; i < tasks.functions.length; i++){
			if(tasks.functions[i] === createLogin || tasks.functions[i] === createForums){
				tasks.functions[i](created, getSetUserPSN);
			}else{
				tasks.functions[i](created);
			}
		}
	}

	function created(){
		tasks.completed++;
		tasks.completed === tasks.functions.length ? setTimeout(revealSite, 25) : 0; //delay helps with rendering
	}

	function revealSite(){
		window.onhashchange();
		window.loadComplete = true;
		fadeOut($loaderOverlay, hideOverlay);
	}

	function hideOverlay(){
		$loaderOverlay.removeClass('active');
	}

	function getSetUserPSN(c){
		if(c){
			userPSN = c;
			userPSN.userIP = userIP;
			user.name = userPSN.member; //this variable is not secure, but is only used for cosmetic stuff, not forum posting
		}else{
			if(userPSN){
				return userPSN;
			}else{
				return userIP;
			}
		}
	}

	var tasks = {functions:[createMemberPopup, createNav, createNews, createGames, createTeam, createLogin, createForums], completed:0};
	var userPSN; //this is only for createLogin and createForum - they need to share this information and it needs to not be editable by the user
	var userIP; //this is only for createLogin and createForum

	isHttps() ? getData(getIP) : goToURL('https://winterclan.net');
});

var dataSet = {};
var psnDataSet = {sheets:[], sheetsloaded:0};
var mobile = isMobileDevice();
var user = {scroll:{}, forumLocation:{}, mouse:{}}; //user.scroll gets initialized in menu.js
var $doc = $(document);
var $win = $(window);
var $main = $('#main');
var $sections = $main.find('.sections');
var $legal = $('#legal');
var $loaderOverlay = $('#loaderOverlay');
var $cache = $('#cache');
var $psn = $('#psn');
var $activityNotify = $('#activityNotify');

function trackMouse(e){
	user.mouse.x = e.pageX;
	user.mouse.y = e.pageY;

	/*
	//console.log('from center', user.mouse.x - ($('#main').width() / 2));

	var stageWidth = $('#main').width() - $('#header .dots').width();
	var d = user.mouse.x - (stageWidth / 2);
		d = user.mouse.x;
		//d = (d / stageWidth) * 15;
		//d *= -1;


	//$('#header .dots').css('transform', 'perspective(' + stageWidth + 'px) rotateY(' + d + 'deg)');

	$('#header .dots').css({
		transform: 'translateX(' + d + 'px)',
		height: Math.ceil(((d / stageWidth) * -50) + 50),
		width: Math.ceil(((d / stageWidth) * -10) + 10)
	});
	*/
}

//window.addEventListener('mousemove', trackMouse, false);