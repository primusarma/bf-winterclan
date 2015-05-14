function createNav(f){
	function navHandler(e){
		//if you click the same menu button, go to the top of page
		if(window.location.hash.split('#/').join('') === this.childNodes[0].innerHTML.split('login').join('profile')){
			user.scroll[currentTab] = 0;
			scrollPageTo(user.scroll[currentTab]);
		}

		window.location.hash = '/' + (this.childNodes[0].innerHTML === 'login' ? 'profile' : this.childNodes[0].innerHTML);
	}

	function insertMenuHeaderText(t, u){
		$h.attr('class', t).find('.text').html(divSplitString(u, '<div class="char">', '</div>', false));
		animateHeaderLetters();
	}

	function animateHeaderLetters(){
		var letters = $h.children('.text').find('.char');

		//console.log(letters);

		for(var i = 0; i < letters.length; i++){
			TweenMax.from(letters[i], 2, {
				opacity: 0,
				top: i % 2 ? '50px' : '-50px',
				ease:Linear.easeOut
			});
		}
	}

	function loadNav(){
		var s = '', i = 0;
		for(i; i < tabs.length; i++){
			if(i === 0){
				s += '<li class="' + tabs[i] + ' active">';
			}else if(tabs[i] === 'join'){
				s += '<li class="' + tabs[i] + ' disabled" style="float:right">';
			}else if(tabs[i] === 'forum'){
				s += '<li class="' + tabs[i] + ' disabled">';
			}else if(tabs[i] === 'login'){
				s += '<li class="' + tabs[i] + '" style="float:right">';
			}else{
				s += '<li class="' + tabs[i] + '">';
			}

			s += '<div class="justName">' + tabs[i] + '</div><div class="indicator"></div></li>';

			user.scroll[tabs[i]] = 0;
		}
		$m.append(s).find('li').on('click', navHandler);
	}

	function initNav(){
		window.onscroll = function (e){
			user.scroll[currentTab] = this.pageYOffset;
		};

		window.onhashchange = function(e){
			window.location.hash = window.location.hash.toLowerCase();

			if(window.loadComplete && !window.forumLogin && window.location.hash.split('#/').length === 2 && window.location.hash.split('#/').indexOf('forum') > -1){
				window.location.hash = ''; //this will be set to /news further in this function
			}

			if(window.location.hash.split('#/').length === 2 && window.location.hash !== hash){
				hash = window.location.hash;

				var $t;
				var m;
				var dest = hash.split('#/').join('');

				if(dest === 'profile'){
					dest = 'login';
				}

				currentTab = dest;

				if($('#' + dest).length === 1){
					for(var i = 0; i < tabs.length; i++){
						$t = $('#' + tabs[i]);
						$t.removeClass('active');

						if(tabs[i] === dest){
							m = i;
						}
					}

					$('#' + dest).addClass('active');
					$m.find('li').removeClass('active');
					$m.find('li.' +  dest).addClass('active');
					//$h.attr('class', dest).children('.text').text(mottos[m]);
					$h.attr('class', dest);
					scrollPageTo(user.scroll[dest]);

					var s = '';
					var letterObject = {};

					for(i = 0; i < mottos[m].length; i++){
						s += '<div class="ltr">' + mottos[m][i] + '</div>';

						letterObject['letter' + i] = false;
					}

					$h.children('.text').html(s);


					if(!isMobileDevice()){
						var progress = 0;
						var converted = 0;

						$v.attr('class', currentTab);

						try{
							clearInterval(randomLetters);
						}catch(error){
							//hasn't been set yet
						}

						randomLetters = setInterval(function(){
							s = '';
							var chance = progress / 500;

							for(i = 0; i < mottos[m].length; i++){
								var c = Math.random();

								if(converted / mottos[m].length <= chance){
									if(c <= chance && !letterObject['letter' + i]){
										letterObject['letter' + i] = mottos[m][i];
										converted++;
									}
								}

								s += '<div class="ltr">' + (letterObject['letter' + i] ? mottos[m][i] : randomLettersAndNumbers(1)) + '</div>';
							}

							$h.children('.text').html(s);

							progress += 20;

							if(chance === 1){
								clearInterval(randomLetters);
								s = '';
								progress = 0;
								i = 0;
								letterObject = {};
							}
						}, 20);
					}
				}
			}else{
				if(window.location.hash.length === 0){
					window.location.hash = '/news';
				}else if(window.location.hash !== hash){ //don't keep trying to change the hash if it's the same
					window.location.hash = hash;
				}
			}
		};

		if(!isMobileDevice()){
			$v.attr('src', 'video/all.mp4');			
			$h.children('.text').jrumble({
				x: 2,
				y: 2,
				rotation: 0.25,
				speed: 20,
				opacity: true,
				opacityMin: 0.05,
				scale: 2.5
			});
			
			var randomRumble = setInterval(function(){
				if(Math.random() <= 0.25){
					$h.children('.text').trigger('startRumble');
					setTimeout(function(){
						$h.children('.text').trigger('stopRumble');
					}, 100 + Math.floor(Math.random() * 250));
				}
			}, 5000);
		}else{
			$v.parent().remove();
		}
	}

	function loadHeaderImgs(){
		function imgLoaded(){
			$h.attr('class', tabs[0]).find('.text').text(mottos[0]);
			f();
		}

		$cache.append('<img onload="' + imgLoaded() + '" src="images/d1.png"></img>');
	}

	var $m = $('#menu').find('ul');
	var $h = $('#header');
	var $v = $h.find('.vid video');
	var $t;
	//var $matrix = $h.find('.bck');
	var hash = '';
	var tabs = ['news','games','team','forum','login',/*'join'*/];
	var mottos = ['intel reports','call to arms','the cavalry','zero hour','the armory',/*'for glory'*/];
	var currentTab = tabs[0]; //this is just for making the scrolling easier to set up
	var randomLetters;

	loadNav();
	initNav();
	loadHeaderImgs();
	//initMatrix($matrix, 4);
}