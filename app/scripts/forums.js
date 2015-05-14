function createForums(f, f2, initForums, loginjsAdditionalFunctions){ //functions from login.js needed by forums.js
	function eraseForums(){
		$forumContents.empty();
	}

	function deleteForum(e){
		var $this = $(this);
		var forumName = replaceApostropheAmp(linkify($this.siblings('.login').val()));
		
		if(f2() && dataSet.compiled.roster[f2().name].rank.toLowerCase() === 'founder' && forumName.length > 3){
			$.post('php/forums/delSingleForum.php', {forum:forumName}, function (data){
				data = null;
				//insertRecentAction({member: f2().name, action: 'deleteforum', forum: forumName, subforum: '', subforumname: '', timestamp: getTimestamp()}); //this doesn't work for some reason (maybe the '')
				getForumsData();
			});
		}else{
			if(forumName.length <= 3){
				alert('Forum name is too short');
			}else{
				alert('You do not have permission to do this');
			}
		}
	}

	function createNewForum(e){
		var $this = $(this);
		var forumName = replaceApostropheAmp(linkify($this.siblings('.login.name').val()));
		var forumAbout = replaceApostropheAmp(linkify($this.siblings('.login.about').val()));
		var rank = $this.siblings('.rank').find('ul .first').length === 0 ? $this.siblings('.rank').find('ul li:first-child').text() : -1;
		var type = $this.siblings('.type').find('ul .first').length === 0 ? $this.siblings('.type').find('ul li:first-child').text() : -1;

		rank !== -1 ? rank = rank.split('All members').join(1).split('Soldiers').join(2).split('Officers').join(3).split('Founders').join(4) : 0;
		type !== -1 ? type = type.split('Gaming').join(1).split('Priority').join(2) : 0;

		if(f2() && dataSet.compiled.roster[f2().name].rank.toLowerCase() === 'founder' && forumName.length > 3 && forumAbout.length > 5 && rank > -1 && type > -1){
			$.post('php/forums/insertForumNew.php', {forum:forumName, rank:rank, type:type, about:forumAbout, author:f2().name}, function (data){
				if(data !== 'exists'){
					var o = {}, r = [], i;

					data = $.parseJSON(data);
					forumData = data.forumData.forumlist;

					for(i = 0; i < forumData.length; i++){
						o[forumData[i].forum] = forumData[i];

						r.push(forumData[i].forum);
					}

					forumData = o;
					forumData._order = r;
					forumData._getForums = data.forumData;
					forumData._members = data.forumData.members;

					data = data.underscoreData;

					for(var k in data){
						if(k.match(/_/g).length === 1){
							for(i = 0; i < data[k].length; i++){
								data[k][i].subforum = data[k][i].topic.substring(1, data[k][i].topic.length);
								data[k][i].topic = data[data[k][i].topic]; //change the topic (subforum) to the actual topic (subforum);
								data[k][i].id = Number(data[k][i].id);
								data[k][i].dated = Number(data[k][i].dated);
								data[k][i].lastpost = Number(data[k][i].lastpost);
							}

							data[k].sort(function (a, b){
								if(b.lastpost < a.lastpost){
									return -1;
								}else if(b.lastpost > a.lastpost){
									return 1;
								}else{
									return 0;
								}							
							});

							forumData[k.substr(1, k.length - 1)].subforums = data[k];
						}else{
							//this is a topic (subforum)
						}
					}

					data = null;
					//constructVisuals();
					getForumsData();
				}else{
					alert('There is already a message board with this name. Please choose a different name');
				}
			}).fail(function (e){
				console.log('error', e);
				//$loaderOverlay.find('.text').text('forum error: not inserted');
			});
		}else{
			if(forumName.length <= 3){
				alert('Forum name is too short');
			}else if(forumAbout.length <= 5){
				alert('Forum description is too short');
			}else if(rank <= -1){
				alert('Please set the member rank required to view the forum');
			}else if(type <= -1){
				alert('Please set the board type');
			}else{
				console.log('some other sort of forum requirement fail');
			}
		}
	}

	function getUserForumData(){
		$.post('php/forums/getSingleMember.php', {name:f2().name}, function (data){ //this php script is also called in login.js
			console.log('trying to set:', $.parseJSON(data));

			var newForumMemberData = loginjsFunctions.cleanForumData($.parseJSON(data));

			updateKeyValues(f2(), newForumMemberData); //update member forum data object with new data
			loginjsFunctions.updateForumProfile();
			getForumsData();
		});
	}

	function getForumsData(){
		$.getJSON(onlineOffline('php/forums/getAllForumContent.php'), function (data){
			//console.log('ben', data);

			var a = [], o = {}, r = [];

			forumData = data.forumlist;

			for(var i = 0; i < forumData.length; i++){
				a.push(forumData[i].forum);

				o[forumData[i].forum] = forumData[i];

				r.push(forumData[i].forum);
			}

			forumData = o;
			forumData._order = r;
			forumData._getForums = data;
			forumData._members = data.members;
			forumData._recentActions = data.recent;
			getAllForumsRows(a);
		});

		getNewestActions();
	}

	function getAllForumsRows(a){ //this is the one to pay attention to
		//console.log(a);
		if(a.length > 0){
			$.post(onlineOffline('php/forums/getUnderscore.php'), {forums: a}, function (data){
				forumData._getUnderscore = data;
				data = $.parseJSON(data);

				for(var k in data){
					if(k.match(/_/g).length === 1){
						for(var i = 0; i < data[k].length; i++){
							data[k][i].subforum = data[k][i].topic.substring(1, data[k][i].topic.length);
							data[k][i].topic = data[data[k][i].topic]; //change the topic (subforum) to the actual topic (subforum);
							data[k][i].id = Number(data[k][i].id);
							data[k][i].dated = Number(data[k][i].dated);
							data[k][i].lastpost = Number(data[k][i].lastpost);
						}

						data[k].sort(function (a, b){
							if(b.lastpost < a.lastpost){
								return -1;
							}else if(b.lastpost > a.lastpost){
								return 1;
							}else{
								return 0;
							}							
						});

						forumData[k.substr(1, k.length - 1)].id = Number(forumData[k.substr(1, k.length - 1)].id);
						forumData[k.substr(1, k.length - 1)].rank = Number(forumData[k.substr(1, k.length - 1)].rank);
						forumData[k.substr(1, k.length - 1)].type = Number(forumData[k.substr(1, k.length - 1)].type);
						forumData[k.substr(1, k.length - 1)].subforums = data[k];
					}else{
						//this is a topic (subforum)
					}
				}

				data = null;
				//console.log('forumdata', forumData);
				constructVisuals();
			}).fail(function (e){
				console.log('error', e);
				$loaderOverlay.find('.text').text('no data in forum?');
			});
		}else{
			console.log('there are no forums');
		}
	}

	function forumHandler(e){ //clicked on a forum
		var s = this.className.split('active').join('').split('forum').join('').split(' ').join('');

		if($forumContents.find('.forumInputHolder.' + s)[0].className.indexOf('active') > -1){
			$forumContents.find('.forumInputHolder').removeClass('active');
			$forumContents.find('.subforum').removeClass('active');
		}else{
			$forumContents.find('.forumInputHolder').removeClass('active');
			$forumContents.find('.subforum').removeClass('active');
			$forumContents.find('.forumInputHolder.' + s).addClass('active');
			$forumContents.find('.subforum.' + s).addClass('active');
		}
	}

	function subforumHandler(e){ //clicked on a subforum/topic
		var $this = $(this).parent(); //event is on the "entry" div
		var a, s = '';

		if($this.hasClass('open')){
			$this.removeClass('open');
		}else{
			if($this.addClass('open').find('.entry').hasClass('unread')){
				$this.addClass('open').find('.entry').removeClass('unread');			
					
				$.post('php/forums/readTopic.php', {name: f2().member, subforum: f2().unreadMap[$this.attr('class').split('open').join('').split('active').join('').split(' ').join('')]}, function (data){
					var k, found = false, forum = f2().unreadMap[$this.attr('class').split('open').join('').split('active').join('').split(' ').join('')];

					forum = forum.split('_')[0];
					delete f2().unreadMap[$this.attr('class').split('open').join('').split('active').join('').split(' ').join('')];

					for(k in f2().unreadMap){ //the first part of the subforum name is the forum name. if you find any other subforums with the forum name, that means there are unread messages in the forum
						if(k.indexOf(forum) > -1){
							found = true;
						}
					}

					!found ? $this.siblings('.unread').removeClass('unread') : 0; //if there are no unread subforums in the forum, remove the unread from the forum
				});
			}

			$this.siblings('.subforum').removeClass('open');
			createDropBox($this.find('.textarea.createReply'));
		}
	}

	function createTopic(e){
		var $this = $(this);
		var forumName = replaceApostrophe(linkify($this.siblings('.login.name').val()));
		var forumBody = encodeURI(replaceApostrophe(linkify(lineBreakToBR($this.siblings('.login.body').val()))));

		var i = Number(String($this.parent().parent().parent().attr('class')).split('forumInputHolder').join('').split('createTopic').join('').split('active').join('').split(' ').join('').split('frmgp').join(''));

		if(f2() && forumName.length > 2 && forumBody.length > 2){
			var z = forumData._order[i] + '_' + randomLetters(1) + randomLettersAndNumbers(10);
			var d = getTimestamp();

			$this.siblings('.login').addClass('disabled'); //disable all inputs
			user.forumLocation.forum = forumData._order[i];
			user.forumLocation.subforum = z;
			user.forumLocation.subforumname = forumName;

			$.post('php/forums/createForumTableTopic.php', {forum:z}, function (data){
				if(data !== 'exists'){
					$.post('php/forums/insertForumTopic.php', {author:f2().name, dated: d, topic:z, subforumname:forumName, into:forumData._order[i]}, function (data){
						//this reply is automatic because it makes the first post

						$.post('php/forums/insertTopicReply.php', {author:f2().name, dated: d, titletext:forumName, bodytext:forumBody, into:z}, function (data){
							data = $.parseJSON(data);
			
							f2().lastpost = data.lastpost;
							f2().lastpostdate = data.lastpostdate;
							f2().postcount = data.postcount;

							loginjsFunctions.updateActivityTime();
							insertRecentAction({member: f2().name, action: 'createsubforum', forum: user.forumLocation.forum, subforum: z, subforumname: forumName, timestamp: d});
							getUserForumData();
						}).fail(function (e){
							console.log('error', e);
							$loaderOverlay.find('.text').text('was not able to send a reply text');
						});
					}).fail(function (e){
						console.log('error', e);
						$loaderOverlay.find('.text').text('topic entry not added to forum');
					});
				}else{
					console.log('forum table already exists - this message should be rare');
				}
			}).fail(function (e){
				console.log('error', e);
				$loaderOverlay.find('.text').text('forum table error: not created');
			});
		}else if(!f2()){
			console.log('you need to log in before you can do this - 2');
		}else{
			console.log('Forum name and/or Forum description must be longer than 2 characters. - 2');
		}
	}

	function createReply(e){
		function postReply(){ //files (images) that need to have their src changed in the textbody
			$.post('php/forums/insertTopicReply.php', {author:f2().name, dated: d, titletext:s, bodytext:replyBody, into:s}, function (data){
				data = $.parseJSON(data);

				f2().lastpost = data.lastpost;
				f2().lastpostdate = data.lastpostdate;
				f2().postcount = data.postcount;

				forumPostImageData = [];

				loginjsFunctions.updateActivityTime();
				insertRecentAction({member: f2().name, action: 'reply', forum: user.forumLocation.forum, subforum: user.forumLocation.subforum, subforumname: user.forumLocation.subforumname, timestamp: d});
				getUserForumData();
			});
		}

		var a, s, d, i;
		var $this = $(this);
		var $topic = $this.parent().parent().parent();
		//var replyBody = processForumPostText($this.siblings('.login.body')[0].value.split('\'').join('&#039;'));
		var replyBody = replaceApostrophe(linkify($this.siblings('.login.body').html())); //apostrophe breaks sqlite
		
		if(replyBody.length > 0){
			d = getTimestamp();

			s = $topic.attr('class').split('active').join('').split('open').join('').split('subforum').join('').split(' ').join('');
			a = s.split('sbgp');
			a[0] = a[0].split('frmgp').join('').split('sbgp').join('');
			a[0] = Number(a[0]);
			a[1] = Number(a[1]);

			s = forumData[forumData._order[a[0]]].subforums[a[1]].subforum;

			//user.forumLocation.y = $win.scrollTop();
			user.forumLocation.forum = forumData._order[a[0]];
			user.forumLocation.subforum = s;
			user.forumLocation.subforumname = forumData[forumData._order[a[0]]].subforums[a[1]].subforumname;

			//console.log('look real close:', user.forumLocation.forum, user.forumLocation.subforum);

			$this.addClass('disabled');

			var $replyInput = $this.siblings('.textarea.createReply').addClass('disabled');
			var imgs = $replyInput.children('img');
			var filesToUpload = [];
			var urlsToUpload = [];

			if($replyInput[0].images && imgs.length > 0){
				for(i = 0; i < imgs.length; i++){
					if($replyInput[0].images[imgs[i].id]){
						filesToUpload.push($replyInput[0].images[imgs[i].id]);
						forumPostImageData.push({id: imgs[i].id, name: $replyInput[0].images[imgs[i].id].name});
					}else{
						console.log('no id????? wtf');
					}
				}

				var imagesUploaded = 0;

				for(i = 0; i < filesToUpload.length; i++){
					var formData = new FormData();
						formData.append('file', filesToUpload[i]);

					$.ajax({
						type: 'POST',
						url: 'php/upload/uploadLocalImages.php',
						data: formData,
						processData: false,
						contentType: false,
						success: function (d){
							imagesUploaded++;

							if(imagesUploaded === i){ //all images have been uploaded
								for(i = 0; i < forumPostImageData.length; i++){
									$('#' + forumPostImageData[i].id).attr('src', 'php/upload/images/' + forumPostImageData[i].name);
								}

								replyBody = encodeURI($this.siblings('.login.body').html()); //apostrophe breaks sqlite
								delete $replyInput[0].images;
								postReply();
							}
						},
						fail: function (d){
							console.log('error: images were not uploaded/post did not go through, resetting forums');
							delete $replyInput[0].images;
							getUserForumData();
						}
					});	
				}
			}else{
				replyBody = encodeURI(replyBody);
				postReply();
			}
		}else{
			console.log('Cannot reply, post is empty.');
		}
	}

	function constructVisuals(){
		var $this, memberPostCounts = {};
		var a, b, c, d, i, j, k, time, l = '<div class="forumEvents"><div class="recentPosters"><div class="heading"><span class="text">Recent Activity</span></div><div class="activityContents"><div class="recentPosts"><div class="recent">', s = '</div>';
		var latest = [], forumMembers = [];
		var goToElement;
		var boardTypes = ['Priority Boards', 'Gaming Boards'];
		var lastBoardType;
		editMap = {};

		eraseForums();
		forumData._membersMap = {};
		delete user.dragDropSubforum;

		for(i = 0; i < forumData._members.length; i++){
			forumData._members[i].lastactive = Number(forumData._members[i].lastactive);
			forumData._members[i].lastpostdate = Number(forumData._members[i].lastpostdate);
			forumData._members[i].postcount = Number(forumData._members[i].postcount);
			forumData._members[i].logincount = Number(forumData._members[i].logincount);
			//forumData._members[i].lastpost === 'null' ? null : 

			if(forumData._members[i].lastpost !== 'null'){
				latest.push([forumData._members[i].member, forumData._members[i].lastpost, forumData._members[i].lastpostdate]);
			}

			forumData._membersMap[forumData._members[i].member] = forumData._members[i];
		}

		for(i = 0; i < forumData._recentActions.length; i++){
			forumData._recentActions[i].timestamp = Number(forumData._recentActions[i].timestamp);
		}

		for(i = 0; i < forumData._recentActions.length; i++){
			l += '<div class="rpost"><a class="author" data="' + forumData._recentActions[i].member + '"><img src="' + getUserImage(forumData._recentActions[i].member) + '"></img></a><div class="textHolder"><div class="dated">' + getPrettyDate(forumData._recentActions[i].timestamp) + '</div><div class="text' + (forumData._recentActions[i].action === 'deletesubforum' ? ' strikethrough' : '') + '">' + forumData._recentActions[i].subforumname.shorten(30, true) + '</div><div class="text">' + forumData._recentActions[i].forum.shorten(30, true) + '</div></div></div>';
		}

		l += '</div></div></div></div><div class="recentBrowsers"><div class="heading"><span class="text">Browsing the Forum</span></div><div class="browsers">';

		//you should see if you can do this sort in the php file!
		forumData._members.sort(function (a, b){
			if(b.lastactive < a.lastactive){
				return -1;
			}else if(b.lastactive > a.lastactive){
				return 1;
			}else{
				return 0;
			}							
		});

		f2().unreadMap = {};

		if(forumData._order.length > 0){
			for(i = 0; i < forumData._order.length; i++){
				a = '', b = '', c = 0, d = [], unread = false;
				
				for(j = 0; j < forumData[forumData._order[i]].subforums.length; j++){
					if(f2().unreadtopics.indexOf(forumData[forumData._order[i]].subforums[j].subforum) > -1){
						f2().unreadMap['subforumfrmgp' + i + 'sbgp' + j] = forumData[forumData._order[i]].subforums[j].subforum;
						unread = true;
					}

					b += '<div class="subforum frmgp' + i + ' sbgp' + j + (user.forumLocation && user.forumLocation.forum && user.forumLocation.forum === forumData._order[i] ? ' active' + (user.forumLocation.subforum && user.forumLocation.subforum === forumData[forumData._order[i]].subforums[j].subforum ? ' open' : '') : '') + '"' + (j + 1 === forumData[forumData._order[i]].subforums.length ? 'style="padding: 0 10px"' : '') + '>' + (checkForumPrivs(f2().name, 2) ? '<div class="delSubforum"><i class="fa fa-trash-o"></i></div>' : '') + '<div class="arrow"><i class="fa fa-angle-double-down arrowDown"></i><i class="fa fa-angle-double-up arrowUp"></i></div><div class="entry' + (f2().unreadtopics.indexOf(forumData[forumData._order[i]].subforums[j].subforum) > -1 ? ' unread' : '') + '"><div class="forumAvatar"><div class="count">' + forumData[forumData._order[i]].subforums[j].topic.length + '</div><div class="corner"></div><div class="lastPost" style="background-image:url(' + getUserImage(forumData[forumData._order[i]].subforums[j].topic[forumData[forumData._order[i]].subforums[j].topic.length - 1].author) + ')"></div></div><div class="textGroup"><div class="title"><span>' + tryDecode(forumData[forumData._order[i]].subforums[j].subforumname) + '</span></div></div></div><div class="posts">';

					if(user.forumLocation.subforum && user.forumLocation.subforum === forumData[forumData._order[i]].subforums[j].subforum){
						goToElement = '.subforum.frmgp' + i + '.sbgp' + j + ' .posts:last-child .post:last';
					}

					if(user.forumLocation.subforum && user.forumLocation.subforum === forumData[forumData._order[i]].subforums[j].subforum){
						user.dragDropSubforum = '.subforum.frmgp' + i + '.sbgp' + j;
					}

					for(k = 0; k < forumData[forumData._order[i]].subforums[j].topic.length; k++){
						var editKey = 'edit' + i + '_' + j + '_' + k;
						editMap[editKey] = forumData[forumData._order[i]].subforums[j].topic[k].id + '-' + zipperConceal([forumData[forumData._order[i]].subforums[j].topic[k].dated, forumData[forumData._order[i]].subforums[j].subforum], {reverse: true, shift: 7, base64: true});

						b += '<div class="post p' + k + '">' + (forumData[forumData._order[i]].subforums[j].topic[k].author === f2().name || checkForumPrivs(f2().name, forumData[forumData._order[i]].subforums[j].topic[k].author) ? '<div class="modifyBar"><div class="dated">' + getPrettyDate(Number(forumData[forumData._order[i]].subforums[j].topic[k].dated)) + '</div><div class="quo"><div>&ldquo;</div><span>' + (isMobileDevice() ? '' : 'quote') + '</span></div><div class="edit" map="' + editKey + '"><i class="fa fa-pencil-square"></i> ' + (isMobileDevice() ? '' : 'edit') + '</div>' + ((forumData[forumData._order[i]].subforums[j].topic.length > 1) ? '<div class="del"><i class="fa fa-trash"></i> ' + (isMobileDevice() ? '' : 'delete') + '</div>' : '') + '</div>' : '<div class="modifyBar"><div class="dated">' + getPrettyDate(Number(forumData[forumData._order[i]].subforums[j].topic[k].dated)) + '</div><div class="quo"><div>&ldquo;</div><span>quote</span></div></div>') + '<div class="profile"><div class="avatar"><div class="cornerBig"></div><div class="corner"></div><img src="' + getUserImage(forumData[forumData._order[i]].subforums[j].topic[k].author) + '"></div><div class="name">' + forumData[forumData._order[i]].subforums[j].topic[k].author + '</div><div class="part">' + getforumParticipation(forumData._membersMap[forumData[forumData._order[i]].subforums[j].topic[k].author].postcount) + '</div></div><div class="textGroup">' + tryDecode(forumData[forumData._order[i]].subforums[j].topic[k].bodytext) + '</div></div>';
						c++;
						d.push(forumData[forumData._order[i]].subforums[j].topic[k].author);
					}

					b += '<div class="padder"><div class="textOptions"><i class="fa fa-bold"></i><i class="fa fa-italic"></i><i class="fa fa-underline"></i>' + /*<i class="fa fa-strikethrough"></i> */ '<span class="localFile"><i class="fa fa-file-image-o"></i><input class="localUpload" accept="image/*" type="file"></span>' + /*<i class="fa fa-link"></i> */ '</div><div type="text" class="login textarea createReply body" contenteditable="true" spellcheck="true" autocomplete="off"></div><input class="createReply submit" type="submit" value="Reply"></div></div></div>';
				}

				d = d.removeDuplicates().length;

				b += '<div class="forumInputHolder createTopic frmgp' + i + (user.forumLocation && user.forumLocation.forum && user.forumLocation.forum === forumData._order[i] ? ' active' : '') + '"><div class="padder"><div class="border"><div class="text">Create new topic</div><input type="text" class="login createTopic name" spellcheck="true" autocomplete="off" maxlength="40" placeholder="topic title"><textarea type="text" class="login createTopic body" spellcheck="true" autocomplete="off" maxlength="15000" placeholder="text goes here..."></textarea><input class="createTopic submit" type="submit" value="Create topic"></div></div></div></div>';
				
				if(i === 0 && forumData[forumData._order[i]].type > 0){
					a += '<div class="heading" style="margin:0"><span class="text">' + boardTypes[0] + '</span></div>';
					lastBoardType = forumData[forumData._order[i]].type;
				}else if(i === 0){
					a += '<div class="heading" style="margin:0"><span class="text">' + boardTypes[boardTypes.length - 1] + '</span></div>';
					lastBoardType = forumData[forumData._order[i]].type;
				}else if(forumData[forumData._order[i]].type !== lastBoardType){
					boardTypes.shift();
					a += '<div class="heading" style="margin:0"><span class="text">' + boardTypes[0] + '</span></div>';
					lastBoardType = forumData[forumData._order[i]].type;
				}

				a += '<div class="forumGroup' + (f2().forumRank >= forumData[forumData._order[i]].rank ? '' : ' locked') + '"><div class="fill' + (unread ? ' unread' : '') + '"></div><div class="forum frmgp' + i + '"><div class="entry"><span class="icon" style="margin-right:4px"><i class="fa fa-comment-o"></i><br><span class="tally">' + c + '</span></span><span class="icon"><i class="fa fa-user"></i><br><span class="tally">' + d + '</span></span>' + (f2().forumRank >= forumData[forumData._order[i]].rank ? '' : '<span class="icon lock"><i class="fa fa-lock"></i></span>') + '<div class="naming"><div class="title"><span>' + forumData._order[i] + '</span></div><div class="subtitle">' + forumData[forumData._order[i]].about + '</div></div></div></div>';

				if(f2().forumRank >= forumData[forumData._order[i]].rank){ //don't add the contents of locked forums
					a += b; //a need info from b, but needs to come before it
				}else{
					a += '</div>';
				}

				s += a;
			}
		}else{
			s += '<div class="forum"><span class="text">No forums exist</span></div>';
		}

		time = getTimestamp();
		l += '<a class="member">' + f2().member + '</a>'; //member who is logged in always goes first

		for(i = 0, j = 0; i < forumData._members.length; i++){
			var diff = (time - forumData._members[i].lastactive) / 1000 / 60; //get difference into minutes

			if(diff < 60 && forumData._members[i].member !== f2().member){ //60 minutes - allow them to log in, ignore the member logged in
				l += ', <a class="member">' + forumData._members[i].member + '</a>';
				j++;
			}
		}

		for(i = 0; i < forumData._members.length; i++){
			if(dataSet.compiled.roster[forumData._members[i].member].status !== 'Quit' && dataSet.compiled.roster[forumData._members[i].member].status !== 'Removed'){
				forumMembers.push(forumData._members[i]);
			}
		}

		l += '</div></div></div>';

		$forumContents.parent().find('.forumEvents').remove();
		$forumContents.parent().append(l).children('.forumEvents').find('.member').on('click', function (e){memberHandler(this.innerHTML);});
		$forumContents.parent().children('.forumEvents').find('.recentPosts .recent .rpost a').on('click', function (e){memberHandler(this.getAttribute('data'));});
		$forumContents.append(s).find('.forum').on('click', forumHandler);
		$forumContents.find('.subforum .entry').on('click', subforumHandler);
		$forumContents.find('.subforum .posts .padder .textOptions .localFile .localUpload').on('change', function (e){
			if(e.currentTarget.files && e.currentTarget.files[0]){
				initFileUpload(e.currentTarget.files[0]);
				this.value = '';
			}
		});

		$forumContents.find('.subforum .posts .padder .textOptions i.fa').on('click', function (e){
			console.log(this.className);

			if(this.className.indexOf('bold') > -1){
				document.execCommand('Bold', false, null);
			}else if(this.className.indexOf('italic') > -1){
				document.execCommand('Italic', false, null);
			}else if(this.className.indexOf('underline') > -1){
				console.log('trying underline...');
				document.execCommand('Underline', false, null);
			}
		});

		if(goToElement){
			//scrollPageTo($(goToElement).position().top);
			user.scroll.forum = $(goToElement).position().top;
			goToElement = null;
		}

		$forumContents.find('input.createTopic.submit').on('click', createTopic);
		$forumContents.find('input.createReply.submit').on('click', createReply);
		$forumContents.find('.forumInputHolder .padder .border').on('click', function (e){
			if(e.target.className.indexOf('border') > -1 || e.target.className.indexOf('text') > -1){
				this.className.indexOf(' active') > -1 ? this.className = this.className.split(' active').join('') : this.className += ' active';
			}
		});

		$forumContents.find('.login.textarea.createReply').on('paste', function (e){
			var pasteContent = (e.originalEvent || e).clipboardData.getData('text/html') || prompt('Paste something..');
			var $result = $('<div></div>').append($(pasteContent));
			var $this = $(this);

			e.preventDefault();
			$this.html($this.html() + $result.html());
			makePlainText($this);
		});

		$forumContents.find('.profile').on('click', function (e){
			$this = $(this);
			memberHandler($this.find('.name').text());
		});

		$forumContents.find('.edit').on('click', function (e){
			$this = $(this);
				
			console.log('edit button for:', $this.attr('map'), ':', editMap[$this.attr('map')]);
		});

		$forumContents.find('.quo').on('click', function (e){
			$this = $(this);
			//var txt = $this.parent().siblings('.textGroup').children('span.text').html();
			var txt = $this.parent().siblings('.textGroup').html();
			var author = $this.parent().siblings('.profile').children('.name').text();

			//$this.parent().parent().siblings('.padder').children('.createReply.body').val($this.parent().parent().siblings('.padder').children('.createReply.body').val() + '[[quote=' + author + ']' + txt + '[/quote]]');
			$this.parent().parent().siblings('.padder').children('.createReply.body').html($this.parent().parent().siblings('.padder').children('.createReply.body').html() + '<div class="quote" contenteditable="false"><div class="author">Originally posted by ' + author + '</div><div class="box"><div class="avatarHolder"></div><div class="textHolder">' + txt + '</div></div></div><br class="tempSpacer">');
			
			$('html, body').animate({
				scrollTop: ($this.parent().parent().siblings('.padder').children('.createReply.body').offset().top - 120) + 'px'
			}, 0);

			$this.parent().parent().siblings('.padder').children('.createReply.body').focus();
			moveCaretToEnd($this.parent().parent().siblings('.padder').children('.createReply.body')[0]);
		});

		$forumContents.find('.del').on('click', function (e){ //delete
			var s, a, p, b, d;

			$this = $(this);
			s = $this.parent().parent().parent().parent().attr('class').split('active').join('').split('open').join('').split('subforum').join('').split(' ').join('');
			a = s.split('sbgp');
			p = Number($this.parent().parent().attr('class').split('post').join('').split('p').join(''));
			
			a[0] = a[0].split('frmgp').join('').split('sbgp').join('');
			a[0] = Number(a[0]);
			a[1] = Number(a[1]);

			s = forumData[forumData._order[a[0]]].subforums[a[1]].subforum;
			b = forumData[forumData._order[a[0]]].subforums[a[1]].topic[p].author;
			p = forumData[forumData._order[a[0]]].subforums[a[1]].topic[p].id;
			user.forumLocation.forum = forumData._order[a[0]];
			user.forumLocation.subforum = s;
			user.forumLocation.subforumname = forumData[forumData._order[a[0]]].subforums[a[1]].subforumname;
			d = getTimestamp();

			$forumContents.children().css('pointer-events', 'none');

			$.post('php/forums/delSinglePost.php', {forum:s, id:p, author:b, deletor:f2().name}, function (data){
				data = $.parseJSON(data);

				if(data !== 'admin action'){
					f2().lastpost = data.lastpost;
					f2().lastpostdate = data.lastpostdate;
					f2().postcount = data.postcount;
				}

				loginjsFunctions.updateActivityTime();
				insertRecentAction({member: f2().name, action: 'delete', forum: user.forumLocation.forum, subforum: user.forumLocation.subforum, subforumname: user.forumLocation.subforumname, timestamp: d});
				getUserForumData();
			});
		});

		$forumContents.find('.delSubforum').on('click', function (e){ //delete subforum
			var s, a, p, d, n;

			$this = $(this);
			s = $this.parent().attr('class').split('active').join('').split('open').join('').split('subforum').join('').split(' ').join('');
			a = s.split('sbgp');
			
			a[0] = a[0].split('frmgp').join('').split('sbgp').join('');
			a[0] = Number(a[0]);
			a[1] = Number(a[1]);

			s = forumData._order[a[0]];
			p = forumData[forumData._order[a[0]]].subforums[a[1]].subforum;
			n = forumData[forumData._order[a[0]]].subforums[a[1]].subforumname;
			d = getTimestamp();

			$forumContents.children().css('pointer-events', 'none');
			$.post('php/forums/delSingleSubforum.php', {forum:s, subforum:p}, function (data){
				data = $.parseJSON(data);

				if(data !== 'admin action'){
					f2().lastpost = data.lastpost;
					f2().lastpostdate = data.lastpostdate;
					f2().postcount = data.postcount;
				}

				loginjsFunctions.updateActivityTime();
				insertRecentAction({member: f2().name, action: 'deletesubforum', forum: s, subforum: p, subforumname: n, timestamp: d});
				getUserForumData();
			});
		});

		if(user.dragDropSubforum){
			createDropBox($(user.dragDropSubforum + ' .posts .padder').find('.textarea.createReply'));
		}

		//$activityNotify.html(s).addClass('active').off().on('click', jumpToForumLocation);

		if(f2().recentActions && dataSet.compiled.roster[f2().name].forumHistory){
			//console.log('you should be in here!');
			//console.log(f2().recentActions, dataSet.compiled.roster[f2().name].forumHistory);

			if(f2().recentActions.timestamp > dataSet.compiled.roster[f2().name].forumHistory.lastactive){
				//console.log('something happened since you were last here!', f2().recentActions);
			}
		}
	}

	function setGetRecentActionsTimer(){
		try{
			clearTimeout(compareSetTimeout);
		}catch(error){ //this happens if setTimeout hasn't been set yet
			console.log('timeout isnt set, cant clear');
		}

		compareSetTimeout = setTimeout(getNewestActions, 10000);
	}

	function getNewestActions(){
		$.post('php/forums/getRecentActionsNew.php', {name: f2().name}, function (data){ //you need to send the member name now because it retrieves
			data = $.parseJSON(data);

			if(f2().recentActions){
				if(f2().recentActions.id !== data.recent.id && f2().name !== data.recent.member){ //has something new happened that was not done by this user?
					var s = '';

					switch(data.recent.action){
						case 'reply':
							s = data.recent.member + ' posted in ' + data.recent.forum + ' - ' + data.recent.subforumname;
							break;
						case 'edit':
							s = data.recent.member + ' edited a post in ' + data.recent.forum + ' - ' + data.recent.subforumname;
							break;
						case 'delete': //not sure when this is used
							s = data.recent.member + ' deleted a post in ' + data.recent.forum + ' - ' + data.recent.subforumname;
							break;
						case 'deleteforum':
							s = data.recent.member + ' deleted forum ' + data.recent.forum;
							break;
						case 'deletesubforum':
							s = data.recent.member + ' deleted a topic in ' + data.recent.forum;
							break;
						case 'createsubforum':
							s = data.recent.member + ' created ' + data.recent.forum + ' - ' + data.recent.subforumname;
							break;
						default:
							break;
					}

					f2().recentActions = data.recent;
					f2().unreadtopics = data.update.unreadtopics;
					$activityNotify.html(s).addClass('active').off().on('click', jumpToForumLocation);
				}
			}else{
				f2().recentActions = data.recent; //set stuff the first time you get in
			}

			setGetRecentActionsTimer();
		}).fail(function (e){
			console.log('failed to get recent actions', e);
		});
	}

	function jumpToForumLocation(e){
		this.className = '';
						
		if(f2().recentActions.action.indexOf('delete') === -1){
			user.forumLocation.forum = f2().recentActions.forum;
			user.forumLocation.subforum = f2().recentActions.subforum;
			user.forumLocation.subforumname = f2().recentActions.subforumname;
		}

		loginjsFunctions.updateActivityTime();
		getUserForumData();
		window.location.hash = '/forum'; //not sure if this should actually be used this way - may create a bug
		
		if(f2().recentActions.action.indexOf('delete') === -1){
			//scrollPageTo();
			console.log('should have scrolled');
		}
	}

	function insertRecentAction(o){
		$.post('php/forums/insertRecentAction.php', o, function (data){
			//console.log(data);
		}).fail(function (e){
			console.log('some sort of error', e);
		});
	}

	var $forum = $('#forum'), $forumContents = $forum.find('.forumContents');
	var $inputs;
	var $createForum;
	var $hoverThis;
	var forumData = {};
	var compareSetTimeout;
	var forumPostImageData = [];
	var loginjsFunctions;
	var editMap;

	if(loginjsAdditionalFunctions && loginjsAdditionalFunctions !== null && loginjsAdditionalFunctions !== undefined){
		loginjsFunctions = loginjsAdditionalFunctions;
	}

	if(initForums){
		$forum.find('input.create.name').on('keypress', function (e){return isAlphaNumbericOrSpace(String.fromCharCode(e.which));});
		$createForum = $forum.find('.createForum').on('click', createNewForum);
		$forum.find('.inputs input.deleteForum').on('click', deleteForum);
		getForumsData();
	}else{
		f();
	}
}