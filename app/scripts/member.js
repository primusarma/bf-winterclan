function createMemberPopup(f){
	f();
}

function memberHandler(m){
	function closeMemberPopup(e){
		//console.log('closed popup');
		$memberPopup.removeClass('active');
		$sections.addClass('active');
		$profile.empty();
		scrollPageTo(user.scroll.lastY);
		$win.trigger('resize'); //this is needed for the graph resizing
	}

	user.scroll.lastY = $(document).scrollTop();
	scrollPageTo(0);

	$memberPopup.addClass('active');
	$sections.removeClass('active');

	$profile.append(constructProfile({name: m}, true)).find('.close').on('click', closeMemberPopup); //utility.js
	getAppendUnstyledSVGImage('images/icons/trophy_bronze_v2.svg', {width:20, height:20}, $profile.find('.trophy .icon'));
	fitTextByLetterSpacing($profile.find('.psn .member .name'), m, window.innerWidth - 60, 0); //20 = 10px margin + 40px for the X button
}

//typically don't put variables outside like but this time it's done to save memory
var $memberPopup = $('#memberPopup');
var $profile = $memberPopup.find('.profile');