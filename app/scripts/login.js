function createLogin(f, f2){
	function createProfile(){
		$profile.append(constructProfile(f2())); //utility.js

		getAppendUnstyledSVGImage('images/icons/trophy_bronze_v2.svg', {width:20, height:20}, $profile.find('.trophy .icon'));
		fitTextByLetterSpacing($profile.find('.psn .member .name'), f2().name, window.innerWidth - 20, 0); //20 = 10px margin

		$login.find('.headingD').addClass('nodisplay');
		$login.prepend('<div class="heading online"><div class="title">Signed in as</div><input class="submit signout" type="submit" value="Sign out"></div>').find('input.signout').on('click', function (e){
			var $this = $(this);

			$.post('php/forums/logout.php', {member:f2().name, ip:f2().userIP}, function (data){
				if(data && data === true || data && data === 'true'){
					$this.addClass('disabled');
					window.forumLogin = false;
					refreshBrowser();
				}else{
					$loaderOverlay.find('.text').text('No internet connection');
				}
			});
		});
	}

	function cleanForumData(){
		for(var k in f2()){
			if(f2()[k] === 'null'){
				f2()[k] = null;
			}else if(Number(f2()[k]) || f2()[k] === '0'){
				f2()[k] = Number(f2()[k]);
			}
		}
	}

	function updateForumProfile(){
		f2().postcount = Number(f2().postcount);
		$profile.find('.forum').replaceWith(createForumProfile(f2()));
	}

	function addModToolsByMemberLevel(tf){
		if(tf === true){
			$('#forum').append('<div class="modTools"><div class="heading" style="margin-top: 10px"><span class="text">Moderator tools</span>' + /*<div class="subtext">(Visible only to founders)</div> */ '</div><div class="inputs create"><input type="text" class="login create name" spellcheck="false" autocomplete="off" maxlength="30" placeholder="forum name"><input type="text" class="login create about" spellcheck="false" autocomplete="off" maxlength="100" placeholder="forum description">' + '<div class="rank"><div class="arrow"></div><ul><li class="first">rank to view</li><li>All members</li><li>Soldiers</li><li>Officers</li><li>Founders</li></ul></div><div class="type"><div class="arrow"></div><ul><li class="first">board type</li><li>Gaming</li><li>Priority</li></ul></div>' + '<input class="createForum submit" type="submit" value="Create forum"></div><div class="inputs delete"><input type="text" class="login name" spellcheck="false" autocomplete="off" maxlength="40" placeholder="forum name"><input class="deleteForum submit" type="submit" value="Delete forum"></div></div>').find('.rank ul li, .type ul li').on('click', function (e){			
				var $this = $(this);

				$this.siblings('.first').remove();
				
				if(this !== $this.parent().children().eq(0)[0]){
					$this.parent().addClass('disabled');
					moveToBottom(this); //this actually moves it to the top because the function is for SVG elements

					requestAnimationFrame(function(){
						$this.parent().removeClass('disabled');
					});
				}
			});
		}
	}

	function testLogin(a, p){
		function findMemberByCredentials(){
			$.post('php/forums/getSingleMemberByEmailorIP.php', {type: 'email', val: a}, function (data){
				data !== false && data !== 'false' ? data = $.parseJSON(data) : data = false;

				if(data !== false && data.member && dataSet.compiled.roster[data.member]){
					//console.log('this email was found in the database and it belongs to: ' + data.member);
					//console.log('now check the credentials...');
					//console.log('user logged in by form submission');
					dataSet.compiled.roster[data.member].forumHistory = data; //you need to save this somewhere accessible so it can be retrieved by the forums
					quickLogin(data.member);
				}else{
					//console.log('email does not exist in the database');
					$psnLoginOverlay.find('.text').text('New member? Checking credentials...');
					firstTimeLogin();
				}
			});
		}

		function firstTimeLogin(){
			$.getJSON('https://psnlogin.herokuapp.com/?e===' + btoa(a) + '&p===' + btoa(p), function (data){
				if(data.success === true && dataSet.compiled.roster[data.name] && dataSet.compiled.roster[data.name].status !== 'Removed' && dataSet.compiled.roster[data.name].status !== 'Quit'){
					loginSuccess(data);
				}else if(data.success === true){
					loginNotClan();
				}else{
					loginFail();
				}
			});
		}

		function quickLogin(m){
			$.getJSON('https://psnquicklogin.herokuapp.com/?e===' + btoa(a) + '&p===' + btoa(p), function (data){
				if(data.success && data.success === true && dataSet.compiled.roster[m].status !== 'Removed' && dataSet.compiled.roster[m].status !== 'Quit'){
					data.name = m;
					data.region = 'us';
					data.ps4 = dataSet.compiled.roster[m].ps4;

					loginSuccess(data);
				}else{
					loginFail();
				}
			});
		}

		function loginNotClan(){
			$psnLoginOverlay.find('.text').text('You are not a clan member');
			$forumMenu.addClass('disabled');
			f2(null);
			setTimeout(hideOverlay, 1000);
		}

		function loginFail(){
			$psnLoginOverlay.find('.text').text('Credentials are incorrect');
			$forumMenu.addClass('disabled');
			f2(null);
			setTimeout(hideOverlay, 1000);
		}

		function loginSuccess(data){
			f2(data); //set the psn data for the forum
			updateMemberAfterLogin(true); //user logged in manually, not by ip address
		}

		function updateMemberAfterLogin(manualLogin){
			var d = new Date();
				d = d.getTime();

			$.post('php/forums/insertUpdateMember.php', {name:f2().name, email:a, ms:d, ip:f2().userIP}, function (data){
				if(data){
					$.post('php/forums/getSingleMember.php', {name:f2().name}, function (data2){ //this php script is also called in forums.js
						var newForumMemberData = cleanForumData($.parseJSON(data2));
						updateKeyValues(f2(), newForumMemberData); //update member forum data object with new data

						if(manualLogin){
							isAlreadyLoggedIn(f2().userIP, true);
						}else{
							updateForumProfile();
							addModToolsByMemberLevel(dataSet.compiled.roster[f2().name].rank === 'Founder');
							createForums(null, f2, true, loginjsfunctions);
							$psnLoginOverlay.find('.text').text('Login was successful');
							setTimeout(hideOverlay, 500);
						}
					}).fail(function (e){
						console.log('error', e);
						$psnLoginOverlay.find('.text').text('Could not retrieve your forum data');
						setTimeout(hideOverlay, 1000);
					});
				}else{
					$psnLoginOverlay.find('.text').text('You do not exist in the database');
					setTimeout(hideOverlay, 1000);
				}
			}).fail(function (e){
				console.log('error', e);
				$psnLoginOverlay.find('.text').text('Could not retrieve/update your forum data');
				setTimeout(hideOverlay, 1000);
			});

			d = null;
		}

		findMemberByCredentials();
	}

	function loginSuccessAlready(data){
		$loginForm.removeClass('active');
		$profile.addClass('active');
		$forumMenu.removeClass('disabled');
		$('#menu').find('.login').children('.justName').text('profile');
		$('#menu').find('.team').removeClass('inactive');
		
		f2(data); //set the psn data for the forum
		//f2().forum = f2(); //kind of a hack to make it work
		f2().forumRank = dataSet.compiled.roster[f2().member].rank === 'Founder' ? 4 : dataSet.compiled.roster[f2().member].rank === 'Officer' ? 3 : dataSet.compiled.roster[f2().member].rank === 'Soldier' ? 2 : 1;

		initDragDrop();
		updateActivityTime();
		createProfile();
		cleanForumData();
		updateForumProfile();
		addModToolsByMemberLevel(dataSet.compiled.roster[f2().name].rank === 'Founder');
		createForums(null, f2, true, loginjsfunctions);

		f();
	}

	function updateActivityTime(){
		var d = getTimestamp();

		$.post('php/forums/updateActivityTime.php', {name:f2().name, ms:d}, function (data){
			//console.log('your activity time should be updated');
		});

		d = null;
	}

	function isAlreadyLoggedIn(ip, overlayFadeOut){
		//console.log('checking to see if: ' + ip + ' is already logged in...');

		$.post('php/forums/getSingleMemberByEmailorIP.php', {type: 'ipaddress', val:ip}, function (data){
			data = $.parseJSON(data);

			if(data && data.member && data.ipaddress && data.lastactive){ //ip address was found
				var time = new Date();
					time = time.getTime();

				var diff = (time - Number(data.lastactive)) / 1000 / 60; //get difference in minutes

				//if(diff < 60){ //60 minutes - allow them to log in
				//if(diff < 1440){ //24 hours - allow them to log in
				if(diff < 2880){ //48 hours - allow them to log in
				//if(diff < 10080){ //1 week - allow them to log in
				//if(diff < 43200){ //30 days - allow them to log in
					data.name = data.member;
					data.region = 'us';
					data.ps4 = dataSet.compiled.roster[data.member].ps4;
					window.forumLogin = true;

					//console.log('user logged in by ip address');
					dataSet.compiled.roster[data.member].forumHistory = data;
					loginSuccessAlready(data);
					overlayFadeOut ? hideOverlay() : 0;
				}else{ //idle for >60 minutes
					forumSectionUntab();
					f();
				}
			}else{ //ip address was not found, force normal login
				forumSectionUntab();
				f();
			}
		});
	}

	function forumSectionUntab(){ //this is in the even someone tries to go to the forums tab (using the hash) without being logged in
		var hash = window.location.hash.toLowerCase();

		if(hash.split('#/').length === 2 && hash.split('#/').join('').indexOf('forum') > -1){
			window.location.hash = '/news';
		}
	}

	function hideOverlay(){
		fadeOut($psnLoginOverlay, resetOverlay);
	}

	function showOverlay(){
		fadeIn($psnLoginOverlay);
	}

	function resetOverlay(){
		$psnLoginOverlay.removeClass('active').find('.text').text('Authenticating over a secure connection...');
	}

	function enterHandler(e){
		e.which === 13 ? formHandler($loginForm.find('.submit')) : 0; //13 is enter
	}

	function formHandler(e){
		var $this = this.className && this.className.indexOf('submit') > -1 ? $(this) : $(e); //use this if it's the button, use event if it's the enter button

		if($this.siblings('.login').val().indexOf('@') > 1 && $this.siblings('.login').val().length > 3 && $this.siblings('.pw').val().length > 3){
			//$loginForm.children('input').addClass('disabled');
			resetOverlay();
			showOverlay();
			$psnLoginOverlay.addClass('active');
			testLogin($this.siblings('.login').val(), $this.siblings('.pw').val());
		}
	}

	var $login = $('#login');
	var $loginForm = $('#login').find('#loginForm');
	var $profile = $login.find('.profile');
	var $psnLoginOverlay = $('#psnLoginOverlay');
	var $forumMenu = $('#main #menu').find('.forum');
	var loginjsfunctions = {'updateForumProfile': updateForumProfile, 'updateActivityTime': updateActivityTime, 'cleanForumData': cleanForumData}; //this is to allow forum.js to use specific login.js functions while remaining protected from user

	$loginForm.find('input').attr('spellcheck', 'false'); //this has to be done manually because the grunt build process rips this out
	$loginForm.on('keypress', enterHandler).find('.submit').on('click', formHandler);

	isAlreadyLoggedIn(f2());
	//createAccolades({}, 'samzgr8', true); //for testing, not actually creating
}