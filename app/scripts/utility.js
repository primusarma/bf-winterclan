function isHttps(){
	return document.location.protocol === 'https:' || document.location.href.indexOf('localhost') > -1 || document.location.href.indexOf('http://127.0.0.1:9000/') > -1;
}

function goToURL(a){
	window.location.href = a;
}

function refreshBrowser(){
	window.location.reload();
}

function isMobileDevice(){
	return (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) ? true : false;
}

function isInputLetter(c){
	return (/^[\ba-zA-Z\s-]$/).test(c) ? true : false;
}

function isInputNumber(c){
	return (/^\d+$/).test(c) ? true : false;
}

function isAlphaNumberic(c){
	return (/[^a-zA-Z0-9]/g).test(c) ? false : true;
}

function isAlphaNumbericOrSpace(c){
	return (/[^a-zA-Z\d\s]+$/).test(c) ? false : true;
}

function isObject(obj){
	return obj === Object(obj);
}

function isArray(arr){
	return arr instanceof Array;
}

function isNumber(n){
	return !isNaN(n);
}

function isBool(n){
	return String(n).toUpperCase() === 'TRUE' ? 'true' : String(n).toUpperCase() === 'FALSE' ? true : false;
}

function checkType(c){
	return isBool(c) ? Boolean(c) : isNumber(c) ? Number(c) : c;
}

function removeLastChar(s){
	return s.substring(0, s.length - 1);
}

function moveToTop(el){
	el.parentNode.appendChild(el);
}

function moveToBottom(el){
	el.parentNode.insertBefore(el, el.parentNode.firstChild);
}

function existsInArray(w, a){
	for(var i = 0; i < a.length; i++){
		if(a[i] === w){
			return true;
		}
	}
	return false;
}

function divSplitString(s, b, a, t){ //string, before, after, return as array
	if(b || a){
		s = s.split('');

		for(var i = 0; i < s.length; i++){
			if(s[i] === ' '){
				s[i] = '&nbsp;';
			}

			if(b){
				s[i] = b + s[i];
			}

			if(a){
				s[i] = s[i] + a;
			}
		}
	}else{
		s = s.split('');
	}

	if(!t){
		s = s.join('');
	}

	return s;
}

function linkify(text){  
	var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;  
	
	return text.replace(urlRegex, function (url){
		return url.indexOf('youtube.com/') > -1 || url.indexOf('twitch.tv/') > -1 || url.indexOf('vimeo.com/') > -1 ? '<a target="_blank" href="' + url + '">video</a>' : '<a target="_blank" href="' + url + '">link</a>';
		//return url.indexOf('youtube.com/') > -1 || url.indexOf('twitch.tv/') > -1 || url.indexOf('vimeo.com/') > -1 ? '<a target="_blank" href="' + url + '">video</a>' : url.indexOf('.jpeg') > -1 || url.indexOf('.jpg') > -1 || url.indexOf('.png') > -1 || url.indexOf('.gif') > -1 ? '<img style="max-width: 500px; max-height: 500px;" src="' + url + '"></img>' : '<a target="_blank" href="' + url + '">link</a>';
	});
}

function getUserImage(member){
	if(psnDataSet._memberData[member]){
		if(psnDataSet._memberData[member].personalDetail && psnDataSet._memberData[member].personalDetail.profilePictureUrl){
			return 'php/upload/imagesPSN/' + member + '_1.png';
			//return psnDataSet._memberData[member].personalDetail.profilePictureUrl;
		}else{
			//return psnDataSet._memberData[member].avatarUrl;
			return 'php/upload/imagesPSN/' + member + '_0.png';
		}
	}else{
		return 'images/noAvatar.png';
	}
}

function getAppendUnstyledSVGImage(url, size, els){
	if(!document.cache){document.cache = {};}
	if(!document.cache[url]){
		d3.xml(url, 'image/svg+xml', function (xml){
			d3.select(xml.documentElement)
				.attr('width', size.width)
				.attr('height', size.height)
				.selectAll('path, rect')
				.attr('fill', null);
			document.cache[url] = xml.documentElement;
			els[0].appendChild(xml.documentElement);

			for(var i = 1; i < els.length; i++){
				els[i].appendChild(document.cache[url].cloneNode(true));
			}
		});
	}else{
		for(var i = 0; i < els.length; i++){
			els[i].appendChild(document.cache[url].cloneNode(true));
		}
	}
}

function getforumParticipation(n){
	if(n > 2499){
		n = 'Apocalyptic';
	}else if(n > 999){
		n = 'Godlike';
	}else if(n > 499){
		n = 'Unstoppable';
	}else if(n > 249){
		n = 'Rampage';
	}else if(n > 99){
		n = 'Dominating';
	}else if(n > 49){
		n = 'Killing spree';
	}else if(n > 24){
		n = 'Ultra kill';
	}else if(n > 9){
		n = 'Multi kill';
	}else if(n > 4){
		n = 'Double kill';
	}else if(n > 0){
		n = 'First blood';
	}else{
		n = 'Spectator';
	}

	return n;
}

function getforumPostStyle(t, i, l, w, s){ //total posts, image posts, link posts, total words, times signed in
	var style = 'Spectator';

	if(t > 10 || s > 5){
		if(i / t > 0.75 && l / t > 0.75 && w / t > 100){
			style = 'Forum troll';
		}else if(i / t > 0.75 && l / t > 0.75){
			style = 'Content whore';
		}else if(i / t > 0.75){
			style = 'Image spammer';
		}else if(l / t > 0.75){
			style = 'Link linker';
		}else if(i / t > 0.5 || l / t > 0.5){
			style = 'Contributor';
		}else if(i / t > 0.25 || l / t > 0.25 || t / s > 0.1){
			style = 'Casual poster';
		}else if(i / t > 0.1 || l / t > 0.1){
			style = 'Peekaboo poster';
		}else if(t / s < 0.1){
			style = 'Shadow lurker';
		}
	}else{
		style = 'New poster';
	}	

	return style;
}

function tryDecode(s){
	var t = s;

	try{
		s = decodeURI(s);
	}catch(error){
		console.log('error decoding:', t);
		s = t;
	}

	return s.split('&amp;nbsp;').join(' ');
}

function replaceApostrophe(s){
	return s.split('\'').join('’');
}

function replaceApostropheAmp(s){
	return s.split('\'').join('’').split('&').join('&amp;');
}

function lineBreakToBR(s){
	return s.replace(/(?:\r\n|\r|\n)/g, '<br>');
}

function processForumPostText(t){
	//t = getLinkHref(t);
	t = formatForumQuote(t);

	return t;
}

function getLinkHref(t){ //remove's all tags with href: <a>
	return t.match(/href="([^"]*)/)[1];
}

function formatForumQuote(t){
	var rgx1 = (/(\[\[quote=.*?\].*?\[\/quote\]\])/);
	var a = t.split(rgx1);

	for(var i = 0; i < a.length; i++){
		var rgx2 = (/\[\[quote=(.*?)](.*?)\[\/quote]\]/);
		
		if(a[i].match(rgx2) !== null){
			var b = a[i].split(rgx2);

			for(var j = b.length -1; j >= 0; j--){
				if(b[j].length === 0){
					b.splice(j, 1);
				}
			}

			//a[i] = '<div class="quote"><div class="author">Originally posted by ' + b[0] + '</div><div class="text">' + b[1] + '</div></div>';
			//a[i] = '<div class="quote"><div class="author">Originally posted by ' + b[0] + '</div><div class="box"><div class="avatarHolder"><img src="' + getUserImage(b[0]); + '"></img></div><div class="textHolder">' + b[1] + '</div></div></div>';
			a[i] = '<div class="quote"><div class="author">Originally posted by ' + b[0] + '</div><div class="box"><div class="avatarHolder"></div><div class="textHolder">' + b[1] + '</div></div></div>';
		}
	}

	//console.log(a);

	return a.join('');
}

function makePlainText($editableDiv){
	$.each($editableDiv.find('*'), function (idx, element){
		var $el = $(element);

		if($el.length > 0){
			$el.removeAttr('style').removeClass();
		}
	});

	$editableDiv.children('style, meta, link').remove(); //remove additional formatting stuff (MS word)
}

function zipperConceal(arrayOfStrings, settings){
	var n = '1234567890';
	var w = 'abcdefghijklmnopqrstuvwxyz';
	var i, j, l = 0, s = '';
	var p = '|'; //make sure your strings don't use this char (PIPE)

	for(i = 0; i < arrayOfStrings.length; i++){
		arrayOfStrings[i].length > l ? l = arrayOfStrings[i].length : 0;
	}

	if(settings && settings.reverse){
		i = l;
		
		while(i--){
			for(j = 0; j < arrayOfStrings.length; j++){
				if(i < arrayOfStrings[j].length){
					s += arrayOfStrings[j][i];
				}else{
					s += p;
				}
			}
		}
	}else{
		for(i = 0; i < l; i++){
			for(j = 0; j < arrayOfStrings.length; j++){
				if(i < arrayOfStrings[j].length){
					s += arrayOfStrings[j][i];
				}else{
					s += p;
				}
			}
		}
	}

	if(settings){
		var position;
		var shiftedChar;

		if(settings.shift > 10 || settings.shift < 0){
			settings.shift = 9;
		}

		for(i = 0; i < s.length; i++){
			var charGroup = n.indexOf(s[i]) > -1 ? n : w; //does the char belong to the numbers or letters group

			position = charGroup.indexOf(s[i].toLowerCase());

			if(settings.shift + position > charGroup.length - 1){ //if it's too large...
				position = settings.shift + position - charGroup.length;
			}else{
				position = settings.shift + position;
			}

			shiftedChar = charGroup.charAt(position);

			s[i] !== s[i].toLowerCase() ? shiftedChar = shiftedChar.toUpperCase() : 0;
			s[i] === p ? shiftedChar = p : 0;
			s[i] === ' ' ? shiftedChar = ' ' : 0;
			s[i] === '_' ? shiftedChar = '_' : 0; //leave the underscore alone
			s = s.replaceAt(i, shiftedChar);
		}
	}

	s += '?' + arrayOfStrings.length; //need to know how many strings there are

	return settings.base64 ? s = window.btoa(s) : s;
}

function checkForumPrivs(actionMember, otherMember){
	var a = Number(dataSet.compiled.roster[actionMember].rank.toLowerCase().split('founder').join('3').split('officer').join('2').split('soldier').join('1').split('recruit').join('0'));
	var b = !isNumber(otherMember) ? b = Number(dataSet.compiled.roster[otherMember].rank.toLowerCase().split('founder').join('3').split('officer').join('2').split('soldier').join('1').split('recruit').join('0')) : b = otherMember;

	if(a > b && a > 1 || a === 3){
		return true;
	}else{
		return false;
	}
}

function onlineOffline(s){ //this will allow you to test offline with dummy data and not get CORS errors - CORS should not be allowed for localhost
	if(document.location.href.indexOf('https://winterclan.net') > -1){
		return s;
	}else{
		s = s.split('/');
		s = s[s.length - 1];
		return '../_offline/' + s.split('.php').join('.js');
	}
}

function isOnline(){
	return document.location.href.indexOf('https://winterclan.net') > -1;
}

function fitTextByLetterSpacing($el, txt, maxWidth, additionalSpacing){ //the $el should be a div with a span inside, and the div should be an inline-block
	var w, l;
	
	$el.find('span').text('|'); //give it a char at first to get the width
	l = parseInt($el.css('letter-spacing'), 10); //letter-spacing from css

	!additionalSpacing ? additionalSpacing = 0 : 0;

	$el.find('span').text(txt);
	w = $el.find('span').outerWidth();

	while(w + additionalSpacing >= maxWidth){
		$el.css('letter-spacing', l-- + 'px');
		w = $el.find('span').outerWidth();
	}
}

////////////////////////////////////////////
// Prototyping
////////////////////////////////////////////

String.prototype.capitalize = function(){
	return this.charAt(0).toUpperCase() + this.substr(1, this.length - 1);
};

String.prototype.shorten = function(n, e){//number, ellipses?
	if(e && this.length > n){
		return this.substring(0, n) + '...';
	}else{
		return this.substring(0, n);
	}
};

String.prototype.replaceAt = function(index, character){
	return this.substr(0, index) + character + this.substr(index + character.length);
};

Array.prototype.removeDuplicates = function(){
	return this.filter(function (v, i, a){return a.indexOf(v) === i;});
};

Array.prototype.average = function(){	
	if(this.length > 0){
		for(var i = 0, s = 0; i < this.length; i++){
			s += this[i];
		}

		return s / this.length;
	}

	return 0; //array has no length, nothing to average
};

Array.prototype.sum = function(){	
	if(this.length > 0){
		for(var i = 0, s = 0; i < this.length; i++){
			s += this[i];
		}

		return s;
	}

	return 0; //array has no length, nothing to average
};


////////////////////////////////////////////
// Sorting
////////////////////////////////////////////

function gameOnlineOffline(a, b){
	var av = a.online && a.online !== true && !Number(a.online) ? 3 : a.online === true ? 2 : Number(a.online) ? a.online * -1 : -9999999;
	var bv = b.online && b.online !== true && !Number(b.online) ? 3 : b.online === true ? 2 : Number(b.online) ? b.online * -1 : -9999999;

	return bv - av || a.player.localeCompare(b.player);
}

function gameStatusSort(a, b){
	return (b.status === 'Active' ? 2 : b.status === 'Inactive' ? 1 : 0) - (a.status === 'Active' ? 2 : a.status === 'Inactive' ? 1 : 0) || a.profile.localeCompare(b.profile);
}

function sortValue(a, b){
	return a.value - b.value;
}

function sortLabel(a, b){
	return a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
}

function sortValueThenLabel(a, b){
	return a.value < b.value ? -1 : a.value > b.value ? 1 : a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
}


////////////////////////////////////////////
// Animation
////////////////////////////////////////////

function fadeIn($el, f){
	if(!isMobileDevice()){
		$el.addClass('active').css('opacity', 0).stop().animate({
			opacity: 1,
		}, 250, function (e){
			f ? f() : 0;
		});
	}else{
		$el.addClass('active').css('opacity', 1);
		f ? f() : 0;
	}
}

function fadeOut($el, f){
	if(!isMobileDevice()){
		$el.addClass('active').css('opacity', 1).stop().animate({
			opacity: 0,
		}, 250, function (e){
			$el.removeClass('active');
			f ? f() : 0;
		});
	}else{
		$el.removeClass('active').css('opacity', 0);
		f ? f() : 0;
	}
}


////////////////////////////////////////////
// Other
////////////////////////////////////////////

function scrollPageTo(y){
	window.scrollTo(0, y); //this doesn't work with overflow: hidden
	//$main.scrollTop(0);
}

function getTimestamp(){
	var d = new Date();
	
	return (d.getTime());
}

function getPrettyDate(d){
	d = new Date(d);
	d = String(d).split(' ');

	var t = d[4];
	var n = t.split(':');

	if(t.charAt(0) === '0' && t.charAt(1) === '0'){
		t = '12' + t.substring(2, t.length - 3) + 'am';
	}else if(t.charAt(0) === '0'){
		t = t.substring(1, t.length - 3) + 'am';
	}else if(Number(n[0]) > 12){
		n[0] = Number(n[0]) - 12;
		t = n[0] + ':' + n[1] + 'pm';
	}else{
		t = t.substring(0, t.length - 3) + 'pm';
	}

	//console.log(t);

	return '<span class="date"><span>' + d[1] + ' ' + d[2] + ', </span><span>' + d[3] + ' </span><span class="smallcaps">at </span><span>' + t + '</span></span>';
}

function timeElapsedSince(timestamp){
	var ps, pm, ph, pd, min, hou, sec, days, now = new Date(), ts = new Date(timestamp * 1000), delta = now.getTime() - ts.getTime();
	
	delta = delta / 1000; //us to s

	if(delta <= 59){
		ps = (delta > 1) ? 's' : '';
		return delta + ' second' + ps;
	}

	if(delta >= 60 && delta <= 3599){
		min = Math.floor(delta / 60);
		sec = delta - (min * 60);
		pm = (min > 1) ? 's' : '';
		ps = (sec > 1) ? 's' : '';
		return min + ' minute' + pm + ' ' + sec + ' second' + ps;
	}

	if(delta >= 3600 && delta <= 86399){
		hou = Math.floor(delta / 3600);
		min = Math.floor((delta - (hou * 3600)) / 60);
		ph = (hou > 1) ? 's': '';
		pm = (min > 1) ? 's': '';
		return hou + ' hour' + ph + ' ' + min + ' minute' + pm;
	} 

	if(delta >= 86400){
		days = Math.floor(delta / 86400);
		hou =  Math.floor((delta - (days * 86400)) / 60 / 60);
		pd = (days > 1) ? 's': '';
		ph = (hou > 1) ? 's': '';
		return days + ' day' + pd + ' ' + hou + ' hour' + ph;
	}
}

function randomLetters(n){ //generates 10 random letters unless you specify a certain number of them
	var t = '';
	var c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

	n ? 0 : n = 10;

	for(var i = 0; i < n; i++){
		t += c.charAt(Math.floor(Math.random() * c.length));
	}

	return t;
}

function randomNumbers(n){ //generates 10 random numbers unless you specify a certain number of them
	var t = '';
	var c = '1234567890';

	n ? 0 : n = 10;

	for(var i = 0; i < n; i++){
		t += c.charAt(Math.floor(Math.random() * c.length));
	}

	return t;
}

function randomLettersAndNumbers(n){ //generates 10 random numbers and letters unless you specify a certain number of them
	var t = '';
	var c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';

	n ? 0 : n = 10;

	for(var i = 0; i < n; i++){
		t += c.charAt(Math.floor(Math.random() * c.length));
	}

	return t;
}

function initDragDrop(){
	document.ondragover = function(){
		if(document.dragDropTarget){
			document.dragDropTarget.addClass('hover');
		}

		return false;
	};

	document.ondragleave = function(){
		if(document.dragDropTarget){
			document.dragDropTarget.removeClass('hover');
		}
		return false;
	};

	document.ondrop = function(e){
		console.log('dropping:', document.dragDropTarget);

		if(document.dragDropTarget){
			document.dragDropTarget.removeClass('hover');
			e.preventDefault();

			readFile(e.dataTransfer.files[0]);
		}

		return false;
	};
}

function initFileUpload(file){
	if(document.dragDropTarget){
		readFile(file);
	}

	return false;
}

function readFile(file){
	try{
		var reader = new FileReader();

		if(file.type){
			console.log('read file type');

			if(file.type.indexOf('image/') > -1 && file.size < 1500000){ //1.5megs
				reader.onload = function(e){
					var tempName = 'temp' + Math.random().toString(36).substring(12) + Math.random().toString(36).substring(12);

					document.dragDropTarget.append('<img id="' + tempName + '" style="max-width:600px; max-height:600px;" src="' + event.target.result + '"></img><div><br></div>');
					
					$('#' + tempName).load(function(){ //image loaded correctly
						moveCaretToEnd(document.dragDropTarget[0]);
						document.dragDropTarget[0].images[tempName] = file;
						$(this).off();
					}).error(function(){ //image did not load
						showImageError(document.dragDropTarget, 'Invalid image');
						$(this).remove();
					});
				};

				reader.readAsDataURL(file);
			}else if(file.type.indexOf('image/') > -1){ //file is larger than 1.5megs
				showImageError(document.dragDropTarget, 'Image is too large (must be < 1.5Mb)');
			}else{
				//console.log(file);
				//console.log('file\'s extension is not an image:', file.type.length > 0 ? file.type : 'file type unknown');
				showImageError(document.dragDropTarget, 'Only .bmp, .jpg, .jpeg, .png file types are supported');
				moveCaretToEnd(document.dragDropTarget[0]);
			}
		}
	}catch(error){
		//this happens when you drag text
	}
}

function createDropBox($dragDropTarget){
	document.dragDropTarget = $dragDropTarget; //setting a new dragdrop target
	$dragDropTarget[0].images = {};
}

function moveCaretToEnd(c){ //contentEditableElement (div)
	var range, selection;
	if(document.createRange){
		range = document.createRange();
		range.selectNodeContents(c);
		range.collapse(false);
		selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);
	}
}

function showImageError($el, t){
	$el.append('<div><div class="imageError" contenteditable="false"><i class="fa fa-warning"></i> ' + t + '</div><div style="display:inline-block;"></div><br></div>');
}

function legal(force){
	if(isMobileDevice() || force){
		$legal.empty().append('<div class="logo"><img class="emblem" src="images/blueW.png"></img><div class="winter">winte<span class="lastletter">r</span></div></div><div class="text" style="margin-top:20px">Founded by Epyos, Freeseus and Lorquas. Designed by Freeseus.</div><div class="text">© 2015 Winter Clan &amp; Primus Arma. All rights reserved.</div>');
	}else{
		$legal.empty().append('<div class="text textRight">© 2015 Winter Clan &amp; Primus Arma.<br>All rights reserved.</div><div class="logo"><img class="emblem" src="images/blueW.png"></img><div class="winter">winte<span class="lastletter">r</span></div></div><div class="text textLeft">Founded by Epyos, Freeseus and Lorquas.<br>Designed by Freeseus.</div>');
	}
}

function updateKeyValues(object, newValuesObject){
	for(var k in newValuesObject){
		object[k] = newValuesObject[k];
	}
}

function constructProfile(memberPSNObject, popup){
	var s = '';
	s += createTrophies(memberPSNObject.name, popup);
	s += createReputation(memberPSNObject.name);
	s += createAccolades(memberPSNObject);
	s += createSystemIconHTML(memberPSNObject.name);
	s += createForumProfile(memberPSNObject);
	s += createGamesPlayed(memberPSNObject.name);

	return s;
}

function createTrophies(member, popup){
	var s = '';

	if(psnDataSet._memberData[member]){
		s = '<div class="psn"><div class="member"><div class="nameBackground">' + (popup ? '<div class="close">×</div>' : '') + '<div class="name"><span></span></div></div></div><div class="online">' + (psnDataSet._memberData[member].presence && psnDataSet._memberData[member].presence.primaryInfo.onlineStatus === 'online' ? 'Online now' : psnDataSet._memberData[member].presence && psnDataSet._memberData[member].presence.primaryInfo.lastOnlineDate ? 'Last online on ' + getPrettyDate(psnDataSet._memberData[member].presence.primaryInfo.lastOnlineDate) : psnDataSet._memberData[member] ? 'Unable to determine last date online' : 'Has never been online and/or needs to send Freeseus a PSN friend request') + '</div><div class="trophyHolder"><div class="avatar"><img src="' + getUserImage(member) + '"></img></div><div class="trophy"><div class="text">' + psnDataSet._memberData[member].trophySummary.level + '</div><div class="text">level</div><i class="fa fa-star"></i><div class="bg"></div><div class="fill"></div></div><div class="trophy bronze"><div class="text">' + psnDataSet._memberData[member].trophySummary.earnedTrophies.bronze + '</div><div class="text">bronze</div><div class="icon bronze"></div><div class="bg"></div><div class="fill"></div></div><div class="trophy silver"><div class="text">' + psnDataSet._memberData[member].trophySummary.earnedTrophies.silver + '</div><div class="text">silver</div><div class="icon silver"></div><div class="bg"></div><div class="fill"></div></div><div class="trophy gold"><div class="text">' + psnDataSet._memberData[member].trophySummary.earnedTrophies.gold + '</div><div class="text">gold</div><div class="icon gold"></div><div class="bg"></div><div class="fill"></div></div><div class="trophy platinum"><div class="text">' + psnDataSet._memberData[member].trophySummary.earnedTrophies.platinum + '</div><div class="text">platinum</div><div class="icon platinum"></div><div class="bg"></div><div class="fill"></div></div></div></div>';
	}else{
		s = '<div class="psn"><div class="member"><div class="nameBackground">' + (popup ? '<div class="close">×</div>' : '') + '<div class="name"><span></span></div></div></div><div class="online">' + 'PlayStation®Network account does not exist' + '</div><div class="trophyHolder"><div class="avatar"><img src="' + getUserImage(member) + '"></img></div><div class="trophy disabled"><div class="text">NA</div><div class="text">level</div><i class="fa fa-star"></i><div class="bg"></div><div class="fill"></div></div><div class="trophy disabled bronze"><div class="text">NA</div><div class="text">bronze</div><div class="icon bronze"></div><div class="bg"></div><div class="fill"></div></div><div class="trophy disabled silver"><div class="text">NA</div><div class="text">silver</div><div class="icon silver"></div><div class="bg"></div><div class="fill"></div></div><div class="trophy disabled gold"><div class="text">NA</div><div class="text">gold</div><div class="icon gold"></div><div class="bg"></div><div class="fill"></div></div><div class="trophy disabled platinum"><div class="text">NA</div><div class="text">platinum</div><div class="icon platinum"></div><div class="bg"></div><div class="fill"></div></div></div></div>';
	}

	return s;
}

function createReputation(member){
	var s = '';
	s += '<div class="reputation"><div class="heading"><div class="title">Reputation</div></div><div class="career"><div class="container">';
	s += '<div class="attrBar rank"><div class="key">Rank</div><div class="value">' + dataSet.compiled.roster[member].rank + '</div></div>';
	s += '<div class="attrBar company"><div class="key">Company</div><div class="value">' + dataSet.compiled.roster[member].company + '</div></div>';
	s += '<div class="attrBar service"><div class="key">Years of Service</div><div class="value">' + dataSet.compiled.roster[member].yearsofservice + '</div></div>';
	s += '<div class="attrBar tours"><div class="key">Tours of Duty</div><div class="value">' + dataSet.compiled.roster[member].toursofduty + '</div></div>';
	s += '<div class="attrBar status"><div class="key">Status</div><div class="value">' + dataSet.compiled.roster[member].status + '</div></div></div>';
	s += '<div class="container"><div class="attrDef title"><div class="key">Title: ' + dataSet.compiled.roster[member].titleAndRole.title.name + '</div><div class="value">' + dataSet.compiled.roster[member].titleAndRole.title.def + '</div></div></div>';
	s += '<div class="container"><div class="attrDef role"><div class="key">Role: ' + dataSet.compiled.roster[member].titleAndRole.role.name + '</div><div class="value">' + dataSet.compiled.roster[member].titleAndRole.role.def + '</div></div></div></div></div>';

	return s;
}

function createAccolades(memberPSNObject, forcedMemberName, seeLog){
	var k, l, b = {}; 
	var memberObject = dataSet.compiled.roster[forcedMemberName ? forcedMemberName : memberPSNObject.name];
	var s = '<div class="accolades"><div class="heading"><div class="title">Accolades</div></div>';
	var a = {
			patriot:{
				yearsofservice: 5,
				toursofduty: 5,
				gamingsystems: 2
			},
			ascendant:{
				rank: memberObject.rank === 'Founder' ? 'Founder' : memberObject.rank === 'Officer' ? 'Officer' : 'Not an officer',
				yearsofservice: 3,
				leadership: 8
			},
			ambassador:{
				invited: 25,
				dedication: 9,
				temperament: 8
			},
			symbiote:{
				gamesPlayed: 5,
				aptitude: 8,
				consistency: 7
			},
			omnipotent:{
				skillAvg: 9,
				genresPlayed: 3,
				versatility: 5
			},
			glorious:{
				ss: 0 //spreadsheet
			},
			war_machine:{
				ss: 1 //spreadsheet
			},
			thy_bidding:{
				title: memberObject.titleAndRole.title.name
			},
			revered:{
				aptitude: 9,
				temperament: 8
			},
			prestige:{
				dedication: 9,
				leadership: 7
			},
			clandestine:{
				dedication: 0 //every one who has joined the clan has a dedication of at least 1
			},
			road_warrior:{
				ss: 2 //spreadsheet
			},
			initiative:{
				invited: 5,
			},
			contributor:{
				postcount: 50
			},
			graduation:{
				rank: memberObject.rank === 'Founder' ? 'Founder' : memberObject.rank === 'Officer' ? 'Officer' : memberObject.rank === 'Soldier' ? 'Soldier' : 'Recruit' //everything but recruit should return true
			}
		};

	for(k in a){
		for(l in a[k]){
			if(memberPSNObject[l] || memberObject[l]){
				!b[k] && b[k] !== false ? b[k] = 'not set' : 0;

				if(memberPSNObject[l] >= a[k][l] && b[k] !== false || memberObject[l] >= a[k][l] && b[k] !== false || isArray(memberObject[l]) && memberObject[l].length >= a[k][l] && b[k] !== false){
					b[k] = true;
				}else{
					b[k] = false;
				}
			}else{
				!b[k] && b[k] !== false ? b[k] = 'not set' : 0;
				if(b[k] !== false){
					switch(l){
						case 'ss':
							if(memberObject.accolades.split(',')[a[k][l]] > 0){
								b[k] = true;
							}else{
								b[k] = false;
							}
							break;
						case 'gamingsystems':
							if(memberObject.pc === true && memberObject.ps3 === true || memberObject.pc === true && memberObject.ps4 === true || memberObject.ps3 === true && memberObject.ps4 === true){
								b[k] = true;
							}else{
								b[k] = false;
							}
							break;
						case 'title':
							if(a[k][l] === 'Sentinel' || a[k][l] === 'Vindicator' || a[k][l] === 'Agent' || a[k][l] === 'Knight' || a[k][l] === 'Warlock' || a[k][l] === 'Sage' || a[k][l] === 'Punisher'){
								b[k] = true;
							}else{
								b[k] = false;
							}
							break;
						default:
							console.log(l + ' was not found in user object');
							break;
					}
				}
			}
		}
	}

	l = 0;

	for(k in a){
		if(l % 5 === 0){
			l !== 0 ? s += '</div>' : 0;
			l === 0 || k !== 'graduation' ? s += '<div class="tier">' : 0;
		}

		seeLog ? console.log(k, b[k]) : 0;

		s += '<div class="accolade' + (b[k] === true ? ' active' : '') + '"><div class="border"><img src="images/accolades/' + k + '_b.png"></img><div>' + k.split('_').join(' ') + '</div></div></div>';
		l++;
	}

	return s + '</div></div>';
}

function createGamesPlayed(member){
	var i = 0, o = {active:[], inactive:[]};
	var s = '<div class="games"><div class="heading"><div class="title">Games</div></div>';

	for(i = 0; i < dataSet.compiled.roster[member].gamesPlayed.length; i++){
		if(dataSet.compiled.gameData[dataSet.compiled.roster[member].gamesPlayed[i]].active > 0){
			o.active.push({order: dataSet.compiled.gameData[dataSet.compiled.roster[member].gamesPlayed[i]].order, game: dataSet.compiled.gameData[dataSet.compiled.roster[member].gamesPlayed[i]].name, genre: dataSet.compiled.gameData[dataSet.compiled.roster[member].gamesPlayed[i]].genre.toLowerCase().split(' ').join(''), url:dataSet.compiled.roster[member][dataSet.compiled.gameData[dataSet.compiled.roster[member].gamesPlayed[i]].game.toLowerCase() + 'url']});
		}else{
			o.inactive.push({order: dataSet.compiled.gameData[dataSet.compiled.roster[member].gamesPlayed[i]].order, game: dataSet.compiled.gameData[dataSet.compiled.roster[member].gamesPlayed[i]].name, genre: dataSet.compiled.gameData[dataSet.compiled.roster[member].gamesPlayed[i]].genre.toLowerCase().split(' ').join(''), url:dataSet.compiled.roster[member][dataSet.compiled.gameData[dataSet.compiled.roster[member].gamesPlayed[i]].game.toLowerCase() + 'url']});
		}
	}

	o.active.sort(function (a, b){return b.order - a.order;});
	o.inactive.sort(function (a, b){return b.order - a.order;});

	for(i = 0; i < o.active.length; i++){
		s += '<div class="game ' + o.active[i].genre + '"><div class="fill ' + o.active[i].genre + '"></div><span class="name">' + o.active[i].game + '</span><span class="type">' + o.active[i].genre + '</span>' + (o.active[i].url ? '<a class="url" target="_blank" href="' + o.active[i].url + '">View profile<i style="margin-left:10px" class="fa fa-external-link"></i></a>' : '') + '</div>';
	}

	for(i = 0; i < o.inactive.length; i++){
		s += '<div class="game ' + o.inactive[i].genre + '"><div class="fill ' + o.inactive[i].genre + '"></div><span class="name">' + o.inactive[i].game + '</span><span class="type">' + o.inactive[i].genre + '</span>'  + (o.inactive[i].url ? '<a class="url" target="_blank" href="' + o.inactive[i].url + '">View profile<i style="margin-left:10px" class="fa fa-external-link"></i></a>' : '') + '</div>';
	}

	return s + '</div>';
}

function createSystemIconHTML(member){
	var s = '<div class="systems"><div class="heading"><div class="title">Systems</div></div>';
	var systemsWithIcons = ['psn', 'ps3', 'ps4', 'pc']; //should find out how to automate this... but you'll need icons for each new system

	for(var i = 0; i < systemsWithIcons.length; i++){
		s += '<div class="system' + (dataSet.compiled.roster[member][systemsWithIcons[i]] === true ? ' active' : '') + '"><img src="images/icons/' + systemsWithIcons[i] + '.png"></img><div>' + systemsWithIcons[i].split('psn').join('psn app').toUpperCase() + '</div></div>';
	}

	return s + '</div>';
}

function createForumProfile(memberPSNObject){
	var s = '';

	if(memberPSNObject.postcount){
		s = '<div class="forum"><div class="heading"><div class="title">Forum</div></div><div class="stat">Participation: ' + getforumParticipation(Number(memberPSNObject.postcount)) + '</div><div class="stat">Posts: ' + memberPSNObject.postcount + '</div></div>';
	}

	return s;
}

function matrixRain($el){
	$el.html('<canvas id="matrixRain"></canvas>');

	var c = $('#matrixRain')[0];
	var ctx = c.getContext('2d');

	c.width = $el.outerWidth();
	c.height = $el.outerHeight();

	//symbols1 characters - taken from the unicode charset
	//var symbols1 = "田由甲申甴电甶男甸甹町画甼甽甾甿畀畁畂畃畄畅畆畇畈畉畊畋界畍畎畏畐畑";
	var symbols1 = ('|').split('');
	var symbols2 = ('01').split('');
	//converting the string into an array of single characters

	var fontSize = 5;
	var columns = c.width / fontSize; //number of columns for the rain
	//an array of drops - one per column
	var drops = [];
	//x below is the x coordinate
	//x below is the x coordinate
	//1 = y co-ordinate of the drop(same for every drop initially)
	for(var x = 0; x < columns; x++){
		drops[x] = 1; 
	}

	function draw(){
		ctx.fillRect(0, 0, c.width, c.height);
		ctx.clearRect(0, 0, c.width, c.height); //this will remove the black background
		
		//looping over drops
		for(var i = 0; i < drops.length; i++){
			//a random symbols1 character to print
			var text = symbols1[Math.floor(Math.random() * symbols1.length)];
			var text2 = symbols2[Math.floor(Math.random() * symbols2.length)];
			//x = i*fontSize, y = value of drops[i]*fontSize

			//ctx.font = (fontSize + Math.ceil(Math.random() * 50)) + 'px arial';
			ctx.font = fontSize + 'px arial';
			ctx.fillText(text, i * fontSize, drops[i] * fontSize);

			ctx.font = (fontSize * 5) + 'px arial';
			ctx.fillText(text2, i * fontSize * 5, drops[i] * fontSize * 2.5);
			
			//sending the drop back to the top randomly after it has crossed the screen
			//adding a randomness to the reset to make the drops scattered on the Y axis
			if(drops[i] * fontSize > c.height && Math.random() > 0.975){
				drops[i] = 0;
			}

			drops[i]++;
		}
	}
	
	setInterval(draw, 20);
}

function initMatrix($el, fs){ //element and fontsize
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	var M;
	
	$el.totalCount = 0;

	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x){
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if(!window.requestAnimationFrame){
		window.requestAnimationFrame = function(callback){
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function(){callback(currTime + timeToCall);}, timeToCall);
			
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if(!window.cancelAnimationFrame){
		window.cancelAnimationFrame = function(id){
			clearTimeout(id);
		};
	}

	var fontSize = fs || 60;

	M = {
		settings:{
			COL_WIDTH: fontSize * 1.75, //helps remove a bit of the space between characters
			COL_HEIGHT: fontSize * 0.85,
			VELOCITY_PARAMS:{
				min: 1,
				max: 5
			},
			CODE_LENGTH_PARAMS:{
				min: $el.outerHeight() / fontSize,
				max: $el.outerHeight() / (fontSize / 3)
			}
		},
		animation: null,
		blue: [208, 59, 53],
		c: null,
		ctx: null,
		lineC: null,
		ctx2: null,
		WIDTH: $el.outerWidth(),
		HEIGHT: $el.outerHeight(),
		COLUMNS: null,
		canvii: [],

		font: fontSize + 'px ' + $el.css('font-family'),
		//letters: ('1234567890').toUpperCase().split(''),
		letters: ('0').toUpperCase().split(''),
		codes: [],
		createCodeLoop: null,
		codesCounter: 0,

		init: function(){
			M.c = document.createElement('canvas');
			M.c.className = 'code';
			M.ctx = M.c.getContext('2d');
			M.c.width = M.WIDTH;
			M.c.height = M.HEIGHT;

			$el.empty().append(M.c);

			M.ctx.shadowBlur = 0;
			M.ctx.font = M.font;

			M.COLUMNS = Math.ceil(M.WIDTH / M.settings.COL_WIDTH);

			for(var i = 0; i < M.COLUMNS; i++){
				M.codes[i] = [];
				M.codes[i][0] = {
					'open': true,
					'position': {'x': 0, 'y': 0},
					'strength': 0
				};
			}

			M.loop();

			//M.createLines();
			M.createCode();

			window.onresize = function(){
				if(M.WIDTH !== $el.outerWidth()){ //don't resize unless the user makes the window wider
					window.cancelAnimationFrame(M.animation);
					M.animation = null;
					M.ctx.clearRect(0, 0, M.WIDTH, M.HEIGHT);
					M.codesCounter = 0;

					//M.ctx2.clearRect(0, 0, M.WIDTH, M.HEIGHT);

					M.WIDTH = $el.outerWidth();
					M.init();
				}

				if(window.innerWidth <= 700 && !isMobileDevice()){
					legal(true); //force it
				}else if(!isMobileDevice()){
					legal();
				}
			};
		},
		loop: function(){
			M.WIDTH = $el.outerWidth();
			M.HEIGHT = $el.outerHeight();

			M.animation = window.requestAnimationFrame(function(){
				M.loop();
				$el.totalCount++;
			});
			M.draw();
		},
		draw: function(){
			var velocity, height, x, y, c, ctx;

			// slow fade BG colour
			M.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
			M.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
			M.ctx.fillRect(0, 0, M.WIDTH, M.HEIGHT);

			M.ctx.globalCompositeOperation = 'source-over';
			M.ctx.clearRect(0, 0, M.WIDTH, M.HEIGHT);

			for(var i = 0; i < M.COLUMNS; i++){
				// check member of array isn't undefined at this point
				if(M.codes[i][0].canvas){
					velocity = M.codes[i][0].velocity;
					height = M.codes[i][0].canvas.height;
					x = M.codes[i][0].position.x;
					y = M.codes[i][0].position.y - height;
					c = M.codes[i][0].canvas;
					ctx = c.getContext('2d');
					M.ctx.drawImage(c, x, y, M.settings.COL_WIDTH, height);
					
					if((M.codes[i][0].position.y - height) < M.HEIGHT){
						M.codes[i][0].position.y += velocity;
					}else{
						M.codes[i][0].position.y = 0;
					}
				}
			}

			//console.log($el.totalCount);
		},
		createCode: function(){
			if(M.codesCounter > M.COLUMNS){
				clearTimeout(M.createCodeLoop);
				return;
			}

			var randomInterval = M.randomFromInterval(0, 100);
			var column = M.assignColumn();

			if(column){
				var codeLength = M.randomFromInterval(M.settings.CODE_LENGTH_PARAMS.min, M.settings.CODE_LENGTH_PARAMS.max);
				var codeVelocity = (Math.random() * (M.settings.VELOCITY_PARAMS.max - M.settings.VELOCITY_PARAMS.min)) + M.settings.VELOCITY_PARAMS.min;
				var lettersLength = M.letters.length;

				M.codes[column][0].position = {'x': (column * M.settings.COL_WIDTH), 'y': 0};
				M.codes[column][0].velocity = codeVelocity;
				M.codes[column][0].strength = M.codes[column][0].velocity / M.settings.VELOCITY_PARAMS.max;

				for(var i = 1; i <= codeLength; i++){
					var newLetter = M.randomFromInterval(0, (lettersLength - 1));
					M.codes[column][i] = M.letters[newLetter];
				}

				M.createCanvii(column);
				M.codesCounter++;
			}

			M.createCodeLoop = setTimeout(M.createCode, randomInterval);
		},
		createCanvii: function(i){
			var codeLen = M.codes[i].length - 1;
			var canvHeight = codeLen * M.settings.COL_HEIGHT;
			var strength = M.codes[i][0].strength;
			var text, fadeStrength;

			var newCanv = document.createElement('canvas');
			var newCtx = newCanv.getContext('2d');

			newCanv.width = M.settings.COL_WIDTH;
			newCanv.height = canvHeight;

			for(var j = 1; j < codeLen; j++){
				text = M.codes[i][j];
				newCtx.globalCompositeOperation = 'source-over';
				newCtx.font = M.font;

				if(j < 5){
					newCtx.shadowColor = 'hsl(' + M.blue[0] + ', ' + M.blue[1] + '%, ' + M.blue[2] + '%)';
					newCtx.shadowOffsetX = 0;
					newCtx.shadowOffsetY = 0;
					newCtx.shadowBlur = 10;
					newCtx.fillStyle = 'hsla(' + M.blue[0] + ', ' + M.blue[1] + '%, ' + (100 - (j * 5)) + '%, ' + (Math.random() * strength) + ')';
				}else if(j > (codeLen - 4)) {
					fadeStrength = j / codeLen;
					fadeStrength = 1 - fadeStrength;

					newCtx.shadowOffsetX = 0;
					newCtx.shadowOffsetY = 0;
					newCtx.shadowBlur = 0;
					newCtx.fillStyle = 'hsla(' + M.blue[0] + ', ' + M.blue[1] + '%, ' + M.blue[2] + '%, ' + (fadeStrength + 0.3) + ')';
				}else{
					newCtx.shadowOffsetX = 0;
					newCtx.shadowOffsetY = 0;
					newCtx.shadowBlur = 0;
					newCtx.fillStyle = 'hsla(' + M.blue[0] + ', ' + M.blue[1] + '%, ' + (100 - (j * 5)) + '%, ' + (Math.random() * strength) + ')';
				}

				newCtx.fillText(text, 0, (canvHeight - (j * M.settings.COL_HEIGHT)));
			}

			M.codes[i][0].canvas = newCanv;

		},

		assignColumn: function(){
			var randomColumn = M.randomFromInterval(0, (M.COLUMNS - 1));

			if(M.codes[randomColumn][0].open){
				M.codes[randomColumn][0].open = false;
			}else{
				return false;
			}

			return randomColumn;
		},
		randomFromInterval: function(from, to){
			return Math.floor(Math.random() * (to - from + 1) + from);
		}
	};

	$el.M = M;

	M.init();
}