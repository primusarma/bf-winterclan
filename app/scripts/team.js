function createTeam(f){
	function createViewOptions(){
		var $this;
		var d;

		$viewOptions.on('click', function (e){
			if(this.className.indexOf('active') === -1){
				//console.log(e);
				$this = $(this);
				$viewOptions.removeClass('active');
				this.className = this.className + ' active';
				d = $this.attr('class').split(' ').join('').split('active').join('');

				$battalion.find('.views .view').attr('class', function (i, c){ //id, className
					if(c.indexOf(d) > -1){
						return c.split(' active').join('') + ' active';
					}

					return c.split(' active').join('');
				});
			}
		});
	}

	function initCharts(){
		createCharts($locale[0]);
		!isMobileDevice() ? $win.resize(function(){
			!$memberPopup.hasClass('active') ? createCharts($locale[0]) : 0; //throws errors when popup is active...
		}) : 0;
	}

	function createOrgChart(){
		var k, s = '', l = 0, i = 0, o = {founders:[], officers:[], soldiers:[], recruits:[]}, p = {founders:{active:0, inactive:0, retired:0}, officers:{active:0, inactive:0, retired:0}, soldiers:{active:0, inactive:0, retired:0}, recruits:{active:0, inactive:0, retired:0}};

		for(k in dataSet.compiled.roster){
			if(dataSet.compiled.roster[k].status !== 'Quit' && dataSet.compiled.roster[k].status !== 'Removed'){
				dataSet.compiled.roster[k].rank.toLowerCase() === 'founder' ? o.founders.push(dataSet.compiled.roster[k]) : dataSet.compiled.roster[k].rank.toLowerCase() === 'officer' ? o.officers.push(dataSet.compiled.roster[k]) : dataSet.compiled.roster[k].rank.toLowerCase() === 'soldier' ? o.soldiers.push(dataSet.compiled.roster[k]) : o.recruits.push(dataSet.compiled.roster[k]);
			}

			l++; //get the number of members
		}

		for(k in p){
			for(i = 0; i < o[k].length; i++){
				p[k][o[k][i].status.toLowerCase()]++;
			}
		}

		for(k in o){
			o[k].sort(gameStatusSort);

			for(i = 0; i < o[k].length; i++){
				i === 0 ? s += '<div class="group"><div class="subhead"><span class="name">' + k + '</span><span>' + p[k].active + ' active</span>' + '<span>' + p[k].inactive + ' inactive</span>' + '<span>' + p[k].retired + ' retired</span></div><ul class="' + k + '">' : 0;
				s += '<li class="' + o[k][i].profile + ' ' + o[k][i].status.toLowerCase() + '">' + o[k][i].profile + '</li>';
			}

			s += '</ul></div>';
		}

		$orgchart.append('<div class="subtitle">Total members: ' + l + '</div>' + s).find('li').on('click', function (e){
			memberHandler(this.className.split(' ')[0]);
		});
	}

	function createNetwork(){
		function createNetworkFilters(){
			function hideShowNodes(a, d){
				var tf = false;
				var i = 0;

				if(a[0] === 'both companies' && a[1] === 'all members' && a[2] === 'all games'){
					//console.log('showing all - this is default');
					return 1; //show everything by default
				}else{
					if(a[0] === 'both companies'){
						if(a[1] === 'all members'){
							if(a[2] === 'all games'){ //show everyone from the entire battalion playing all games
								return 1;
							}else if(a[2] === 'active games'){ //show everyone from the entire battalion playing only the active games
								tf = false;

								for(i = 0; i < dataSet.compiled.roster[d.name].gamesPlayed.length; i++){
									if(dataSet.compiled.gameData[dataSet.compiled.roster[d.name].gamesPlayed[i]].active > 0){
										tf = true;
									}
								}

								return tf ? 1 : 0;
							}else if(a[2] === 'inactive games'){ //show everyone from the entire battalion playing only the old games
								tf = false;

								for(i = 0; i < dataSet.compiled.roster[d.name].gamesPlayed.length; i++){
									if(dataSet.compiled.gameData[dataSet.compiled.roster[d.name].gamesPlayed[i]].active < 0){
										tf = true;
									}
								}

								return tf ? 1 : 0;
							}
						}else if(a[1] === 'active members'){
							if(a[2] === 'all games'){ //show only active members from the entire battalion playing all games
								if(dataSet.compiled.roster[d.name].status.toLowerCase() === 'active'){
									return 1;
								}else{
									return 0;
								}
							}else if(a[2] === 'active games'){ //show only active members from the entire battalion playing only the active games
								if(dataSet.compiled.roster[d.name].status.toLowerCase() === 'active'){
									tf = false;

									for(i = 0; i < dataSet.compiled.roster[d.name].gamesPlayed.length; i++){
										if(dataSet.compiled.gameData[dataSet.compiled.roster[d.name].gamesPlayed[i]].active > 0){
											tf = true;
										}
									}

									return tf ? 1 : 0;
								}else{
									return 0;
								}
							}else if(a[2] === 'inactive games'){ //show only active members from the entire battalion playing only the old games
								if(dataSet.compiled.roster[d.name].status.toLowerCase() === 'active'){
									tf = false;

									for(i = 0; i < dataSet.compiled.roster[d.name].gamesPlayed.length; i++){
										if(dataSet.compiled.gameData[dataSet.compiled.roster[d.name].gamesPlayed[i]].active < 0){
											tf = true;
										}
									}

									return tf ? 1 : 0;
								}else{
									return 0;
								}
							}
						}else if(a[1] === 'inactive members'){
							if(a[2] === 'all games'){ //show only inactive members from the entire battalion playing all games
								if(dataSet.compiled.roster[d.name].status.toLowerCase() !== 'active'){
									return 1;
								}else{
									return 0;
								}
							}else if(a[2] === 'active games'){ //show only inactive members from the entire battalion playing only the active games
								if(dataSet.compiled.roster[d.name].status.toLowerCase() !== 'active'){
									tf = false;

									for(i = 0; i < dataSet.compiled.roster[d.name].gamesPlayed.length; i++){
										if(dataSet.compiled.gameData[dataSet.compiled.roster[d.name].gamesPlayed[i]].active > 0){
											tf = true;
										}
									}

									return tf ? 1 : 0;
								}else{
									return 0;
								}
							}else if(a[2] === 'inactive games'){ //show only inactive members from the entire battalion playing only the old games
								if(dataSet.compiled.roster[d.name].status.toLowerCase() !== 'active'){
									tf = false;

									for(i = 0; i < dataSet.compiled.roster[d.name].gamesPlayed.length; i++){
										if(dataSet.compiled.gameData[dataSet.compiled.roster[d.name].gamesPlayed[i]].active < 0){
											tf = true;
										}
									}

									return tf ? 1 : 0;
								}else{
									return 0;
								}
							}
						}
					}else if(a[0] === 'winter clan'){
						if(a[1] === 'all members'){
							if(a[2] === 'all games'){ //show everyone from winter playing all games
								if(dataSet.compiled.roster[d.name].company.toLowerCase() === 'winter' || dataSet.compiled.roster[d.name].company.toLowerCase() === 'all'){
									return 1;
								}else{
									return 0;
								}
							}else if(a[2] === 'active games'){ //show everyone from winter playing only the active games
								//console.log(dataSet.compiled.roster[d.name]);
								if(dataSet.compiled.roster[d.name].company.toLowerCase() === 'winter' || dataSet.compiled.roster[d.name].company.toLowerCase() === 'all'){
									tf = false;

									for(i = 0; i < dataSet.compiled.roster[d.name].gamesPlayed.length; i++){
										if(dataSet.compiled.gameData[dataSet.compiled.roster[d.name].gamesPlayed[i]].active > 0){
											tf = true;
										}
									}

									return tf ? 1 : 0;
								}else{
									return 0;
								}
							}else if(a[2] === 'inactive games'){ //show everyone from winter playing only the old games
								if(dataSet.compiled.roster[d.name].company.toLowerCase() === 'winter' || dataSet.compiled.roster[d.name].company.toLowerCase() === 'all'){
									tf = false;

									for(i = 0; i < dataSet.compiled.roster[d.name].gamesPlayed.length; i++){
										if(dataSet.compiled.gameData[dataSet.compiled.roster[d.name].gamesPlayed[i]].active < 0){
											tf = true;
										}
									}

									return tf ? 1 : 0;
								}else{
									return 0;
								}
							}
						}else if(a[1] === 'active members'){
							if(a[2] === 'all games'){ //show only active members from winter playing all games
								if(dataSet.compiled.roster[d.name].status.toLowerCase() === 'active'){
									if(dataSet.compiled.roster[d.name].company.toLowerCase() === 'winter' || dataSet.compiled.roster[d.name].company.toLowerCase() === 'all'){
										return 1;
									}else{
										return 0;
									}
								}else{
									return 0;
								}
							}else if(a[2] === 'active games'){ //show only active members from winter playing only the active games
								if(dataSet.compiled.roster[d.name].status.toLowerCase() === 'active'){
									if(dataSet.compiled.roster[d.name].company.toLowerCase() === 'winter' || dataSet.compiled.roster[d.name].company.toLowerCase() === 'all'){
										tf = false;

										for(i = 0; i < dataSet.compiled.roster[d.name].gamesPlayed.length; i++){
											if(dataSet.compiled.gameData[dataSet.compiled.roster[d.name].gamesPlayed[i]].active > 0){
												tf = true;
											}
										}

										return tf ? 1 : 0;
									}else{
										return 0;
									}
								}else{
									return 0;
								}
							}else if(a[2] === 'inactive games'){ //show only active members from winter playing only the old games
								if(dataSet.compiled.roster[d.name].status.toLowerCase() === 'active'){
									if(dataSet.compiled.roster[d.name].company.toLowerCase() === 'winter' || dataSet.compiled.roster[d.name].company.toLowerCase() === 'all'){
										tf = false;

										for(i = 0; i < dataSet.compiled.roster[d.name].gamesPlayed.length; i++){
											if(dataSet.compiled.gameData[dataSet.compiled.roster[d.name].gamesPlayed[i]].active < 0){
												tf = true;
											}
										}

										return tf ? 1 : 0;
									}else{
										return 0;
									}
								}else{
									return 0;
								}
							}
						}else if(a[1] === 'inactive members'){
							if(a[2] === 'all games'){ //show only inactive members from winter playing all games
								if(dataSet.compiled.roster[d.name].status.toLowerCase() !== 'active'){
									if(dataSet.compiled.roster[d.name].company.toLowerCase() === 'winter' || dataSet.compiled.roster[d.name].company.toLowerCase() === 'all'){
										return 1;
									}else{
										return 0;
									}
								}else{
									return 0;
								}
							}else if(a[2] === 'active games'){ //show only inactive members from winter playing only the active games
								if(dataSet.compiled.roster[d.name].status.toLowerCase() !== 'active'){
									if(dataSet.compiled.roster[d.name].company.toLowerCase() === 'winter' || dataSet.compiled.roster[d.name].company.toLowerCase() === 'all'){
										tf = false;

										for(i = 0; i < dataSet.compiled.roster[d.name].gamesPlayed.length; i++){
											if(dataSet.compiled.gameData[dataSet.compiled.roster[d.name].gamesPlayed[i]].active > 0){
												tf = true;
											}
										}

										return tf ? 1 : 0;
									}else{
										return 0;
									}
								}else{
									return 0;
								}
							}else if(a[2] === 'inactive games'){ //show only inactive members from winter playing only the old games
								if(dataSet.compiled.roster[d.name].status.toLowerCase() !== 'active'){
									if(dataSet.compiled.roster[d.name].company.toLowerCase() === 'winter' || dataSet.compiled.roster[d.name].company.toLowerCase() === 'all'){
										tf = false;

										for(i = 0; i < dataSet.compiled.roster[d.name].gamesPlayed.length; i++){
											if(dataSet.compiled.gameData[dataSet.compiled.roster[d.name].gamesPlayed[i]].active < 0){
												tf = true;
											}
										}

										return tf ? 1 : 0;
									}else{
										return 0;
									}
								}else{
									return 0;
								}
							}
						}
					}else if(a[0] === 'primus arma'){
						if(a[1] === 'all members'){
							if(a[2] === 'all games'){ //show everyone from primus arma playing all games
								if(dataSet.compiled.roster[d.name].company.toLowerCase() === 'primus arma' || dataSet.compiled.roster[d.name].company.toLowerCase() === 'all'){
									return 1;
								}else{
									return 0;
								}
							}else if(a[2] === 'active games'){ //show everyone from primus arma playing only the active games
								//console.log(dataSet.compiled.roster[d.name]);
								if(dataSet.compiled.roster[d.name].company.toLowerCase() === 'primus arma' || dataSet.compiled.roster[d.name].company.toLowerCase() === 'all'){
									tf = false;

									for(i = 0; i < dataSet.compiled.roster[d.name].gamesPlayed.length; i++){
										if(dataSet.compiled.gameData[dataSet.compiled.roster[d.name].gamesPlayed[i]].active > 0){
											tf = true;
										}
									}

									return tf ? 1 : 0;
								}else{
									return 0;
								}
							}else if(a[2] === 'inactive games'){ //show everyone from primus arma playing only the old games
								if(dataSet.compiled.roster[d.name].company.toLowerCase() === 'primus arma' || dataSet.compiled.roster[d.name].company.toLowerCase() === 'all'){
									tf = false;

									for(i = 0; i < dataSet.compiled.roster[d.name].gamesPlayed.length; i++){
										if(dataSet.compiled.gameData[dataSet.compiled.roster[d.name].gamesPlayed[i]].active < 0){
											tf = true;
										}
									}

									return tf ? 1 : 0;
								}else{
									return 0;
								}
							}
						}else if(a[1] === 'active members'){
							if(a[2] === 'all games'){ //show only active members from primus arma playing all games
								if(dataSet.compiled.roster[d.name].status.toLowerCase() === 'active'){
									if(dataSet.compiled.roster[d.name].company.toLowerCase() === 'primus arma' || dataSet.compiled.roster[d.name].company.toLowerCase() === 'all'){
										return 1;
									}else{
										return 0;
									}
								}else{
									return 0;
								}
							}else if(a[2] === 'active games'){ //show only active members from primus arma playing only the active games
								if(dataSet.compiled.roster[d.name].status.toLowerCase() === 'active'){
									if(dataSet.compiled.roster[d.name].company.toLowerCase() === 'primus arma' || dataSet.compiled.roster[d.name].company.toLowerCase() === 'all'){
										tf = false;

										for(i = 0; i < dataSet.compiled.roster[d.name].gamesPlayed.length; i++){
											if(dataSet.compiled.gameData[dataSet.compiled.roster[d.name].gamesPlayed[i]].active > 0){
												tf = true;
											}
										}

										return tf ? 1 : 0;
									}else{
										return 0;
									}
								}else{
									return 0;
								}
							}else if(a[2] === 'inactive games'){ //show only active members from primus arma playing only the old games
								if(dataSet.compiled.roster[d.name].status.toLowerCase() === 'active'){
									if(dataSet.compiled.roster[d.name].company.toLowerCase() === 'primus arma' || dataSet.compiled.roster[d.name].company.toLowerCase() === 'all'){
										tf = false;

										for(i = 0; i < dataSet.compiled.roster[d.name].gamesPlayed.length; i++){
											if(dataSet.compiled.gameData[dataSet.compiled.roster[d.name].gamesPlayed[i]].active < 0){
												tf = true;
											}
										}

										return tf ? 1 : 0;
									}else{
										return 0;
									}
								}else{
									return 0;
								}
							}
						}else if(a[1] === 'inactive members'){
							if(a[2] === 'all games'){ //show only inactive members from primus arma playing all games
								if(dataSet.compiled.roster[d.name].status.toLowerCase() !== 'active'){
									if(dataSet.compiled.roster[d.name].company.toLowerCase() === 'primus arma' || dataSet.compiled.roster[d.name].company.toLowerCase() === 'all'){
										return 1;
									}else{
										return 0;
									}
								}else{
									return 0;
								}
							}else if(a[2] === 'active games'){ //show only inactive members from primus arma playing only the active games
								if(dataSet.compiled.roster[d.name].status.toLowerCase() !== 'active'){
									if(dataSet.compiled.roster[d.name].company.toLowerCase() === 'primus arma' || dataSet.compiled.roster[d.name].company.toLowerCase() === 'all'){
										tf = false;

										for(i = 0; i < dataSet.compiled.roster[d.name].gamesPlayed.length; i++){
											if(dataSet.compiled.gameData[dataSet.compiled.roster[d.name].gamesPlayed[i]].active > 0){
												tf = true;
											}
										}

										return tf ? 1 : 0;
									}else{
										return 0;
									}
								}else{
									return 0;
								}
							}else if(a[2] === 'inactive games'){ //show only inactive members from primus arma playing only the old games
								if(dataSet.compiled.roster[d.name].status.toLowerCase() !== 'active'){
									if(dataSet.compiled.roster[d.name].company.toLowerCase() === 'primus arma' || dataSet.compiled.roster[d.name].company.toLowerCase() === 'all'){
										tf = false;

										for(i = 0; i < dataSet.compiled.roster[d.name].gamesPlayed.length; i++){
											if(dataSet.compiled.gameData[dataSet.compiled.roster[d.name].gamesPlayed[i]].active < 0){
												tf = true;
											}
										}

										return tf ? 1 : 0;
									}else{
										return 0;
									}
								}else{
									return 0;
								}
							}
						}
					}
				}

				return 1;
			}

			var $this;
			var $selectedChoices;
			var a = [], s = '', h = {}, n, t;

			$network.find('.option').on('click', function (e){
				//console.log($(this));

				$this = $(this);
				t = $this.siblings('.option.choice').children('.text').text();
				$this.siblings('.option.choice').children('.text').text($this.find('.text').text());
				$this.siblings('.option.default').children('.text').text($this.find('.text').text());
				$this.find('.text').text(t);
				$this.parent().addClass('noInteraction');
				$selectedChoices = $network.find('.option.choice');
				a = [];
				h = [];
				s = '';

				for(var i = 0; i < $selectedChoices.length; i++){
					a.push($selectedChoices.children('.text:eq(' + i + ')').text());
				}

				if(a[1] === 'all members'){
					s += 'Past and present members of ';
				}else if(a[1] === 'active members'){
					s += 'Active members of ';
				}else if(a[1] === 'inactive members'){
					s += 'Inactive and retired members of ';
				}else{
					console.log('not recognizing the activity choice!');
				}

				if(a[0] === 'both companies'){
					s += 'Winter and Primus Arma ';
				}else if(a[0] === 'winter clan'){
					s += 'Winter ';
				}else if(a[0] === 'primus arma'){
					s += 'Primus Arma ';
				}else{
					console.log('not recognizing the clan choice!');
				}

				if(a[2] === 'all games'){
					//
				}else if(a[2] === 'active games'){
					s += 'playing active games';
				}else if(a[2] === 'inactive games'){
					s += 'who played in games we are no longer competitive in';
				}else{
					console.log('not recognizing the game choice!');
				}

				node.style('display', function (d){
					n = hideShowNodes(a, d);
					n === 0 ? h[d.name] = n : 0;

					return n === 0 ? 'none' : 'block';
				});

				link.style('display', function (d){
					if(h[d.source.name] === 0 || h[d.target.name] === 0){
						return 'none';
					}else{
						return 'block';
					}
				});

				$network.find('.filter .overview .text').text(s);
				setTimeout(function(){$this.parent().removeClass('noInteraction');}, 15);
			});
		}
		function tick(){
			node.attr('transform', function (d){
				var o = {x:d.x, y:d.y, width:this.getBBox().width, height:this.getBBox().height};

				o.x > w - (o.width / 2) ? o.x = w - (o.width / 2) : 0;
				o.x < (o.width / 2) ? o.x = (o.width / 2) : 0;

				o.y > h - o.height ? o.y = h - o.height : 0;
				o.y < 7 ? o.y = 7 : 0;

				d.x = o.x;
				d.y = o.y;
 
				if(d.name === 'Freeseus'){
					d.x = w / 2;
					d.y = h / 2;
				}else if(d.name === 'Epyos'){
					d.x = w / 5;
					d.y = h / 5;
				}else if(d.name === 'Lorquas'){
					d.x = w * 3 / 3.5;
					d.y = h / 5;
				}else if(d.name === 'TheTrollDr'){
					d.x = w / 2;
					d.y = h / 7;
				}else if(d.name === 'Cause'){
					d.x = w / 5.75;
					d.y = h / 1.85;
				}else if(d.name === 'Aco24'){
					d.x = w / 8;
					d.y = h * 3.25 / 4;
				}else if(d.name === 'Spray_And_Pray_'){
					d.x = w * 3 / 3.5;
					d.y = h * 3.25 / 4;
				}else if(d.name === 'MaVcHo39'){
					d.x = w * 2.85 / 4;
					d.y = h / 2;
				}else if(d.name === 'JennHarp'){
					d.x = w * 2.85 / 4;
					d.y = h * 2.67 / 4;
				}else if(d.name === 'onehitvandal'){
					d.x = w / 2.75;
					d.y = h / 3.5;
				}else if(d.name === 'RaTiLiCaN'){
					d.x = w / 2.25;
					d.y = h / 4.25;
				}else if(d.name === 'Flapshot9'){
					d.x = w / 2;
					d.y = h * 3.25 / 3.75;
				}

				o.x = Math.round(o.x);
				o.y = Math.round(o.y);

				return 'translate(' + o.x + ',' + o.y + ')';
			});

			link.attr('x1', function (d){
				return d.source.x;
			})
			.attr('y1', function (d){
				return d.source.y;
			})
			.attr('x2', function (d){
				return d.target.x;
			})
			.attr('y2', function (d){
				return d.target.y;
			});
		}

		var orderArray = [];
		var nodes = {}, links = [];
		var color = 'many';
		var allColorsArray = [], colorArray = [], invitedArray = [], i, j;
		var force, svg, link, node, pattern;

		$network.removeClass('active');

		for(i in dataSet.compiled.roster){
			colorArray = [];
			invitedArray = [];

			if(dataSet.compiled.roster[i].status !== 'Quit' && dataSet.compiled.roster[i].status !== 'Removed'){
				for(j in dataSet.compiled.roster[i].genresPlayed.length){
					colorArray.push(dataSet.compiled.roster[i].genresPlayed[j].toLowerCase().split(' ').join(''));
				}

				colorArray = colorArray.removeDuplicates();

				if(colorArray.length === 1){
					color = colorArray[0];
				}

				invitedArray = String(dataSet.compiled.roster[i].invitedby).length > 2 ? String(dataSet.compiled.roster[i].invitedby).split(', ') : [];
			
				for(j = 0; j < invitedArray.length; j++){
					links.push({source: invitedArray[j], target: dataSet.compiled.roster[i].profile});
				}

				allColorsArray.push(color);
			}
		}

		links.forEach(function (link){
			if(dataSet.compiled.roster[link.source].status !== 'Quit' && dataSet.compiled.roster[link.source].status !== 'Removed'){
				link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
			}

			if(dataSet.compiled.roster[link.target].status !== 'Quit' && dataSet.compiled.roster[link.target].status !== 'Removed'){
				link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
			}
		});

		nodes = d3.values(nodes);

		force = d3.layout.force().nodes(nodes)
			.links(links)
			.size([w, h])
			.linkDistance(function (e){return (Math.random() * (e.source.weight * 2.5)) + 25;})
			.linkStrength(1 * (((window.devicePixelRatio - 1) * 2) + 1))
			.charge(-250 / window.devicePixelRatio)
			.gravity(0.001)
			.chargeDistance(200 / window.devicePixelRatio)
			.on('tick', tick)
			.start();

		svg = d3.select($network[0]).append('svg')
			.attr('width', w)
			.attr('height', h);

		/* //rainbow pattern

		pattern = svg.append('defs')
			.append('pattern')
			.attr('id', 'many')
			.attr('patternTransform', 'rotate(45)')
			.attr('patternUnits', 'userSpaceOnUse')
			.attr('height', 10)
			.attr('width', 10);

		pattern.append('rect')
			.attr('width', 10)
			.attr('height', 10)
			.style('fill', 'rgba(210,158,107,1)');

		pattern.append('rect')
			.attr('width', 8)
			.attr('height', 10)
			.style('fill', 'rgba(174,104,96,1)');

		pattern.append('rect')
			.attr('width', 6)
			.attr('height', 10)
			.style('fill', 'rgba(144,128,180,1)');

		pattern.append('rect')
			.attr('width', 4)
			.attr('height', 10)
			.style('fill', 'rgba(151,160,118,1)');

		pattern.append('rect')
			.attr('width', 2)
			.attr('height', 10)
			.style('fill', 'rgba(121,156,176,1)');

		*/

		link = svg.append('g')
			.attr('class','lines')
			.selectAll('.link')
			.data(force.links())
			.enter()
			.append('line')
			/*
			.attr('stroke', function (e, k){
				//console.log(e, k);
				return allColorsArray[e.target.index];
			})*/
			.attr('class', function (e, k){
				//console.log(e, k);
				return 'link' + allColorsArray[e.target.index];
			});

		node = svg.append('g')
			.attr('class','nodes')
			.selectAll('.node')
			.data(nodes)
			.enter().append('g')
			.attr('class', function (d){
				return dataSet.compiled.roster[d.name].status !== 'Quit' && dataSet.compiled.roster[d.name].status !== 'Removed' ? 'node' : 'nodisplay';
			})
			.style('opacity', function (d){
				return 1;
				//return dataSet.compiled.roster[d.name].status.toLowerCase() === 'active' ? 1 : 0.15;
			})
			.on('mouseover', function (e){
				moveToTop(this); 
				//moveToTop(elMap.active);
			}).on('click', function (d){
				memberHandler(d.name);
			}); //this is in member.js
			//.call(force.drag);

		node.append('text')
			.attr('dy', '1.5em')
			.attr('text-anchor', 'middle')
			.attr('class', function (e, k){return allColorsArray[k];})
			.text(function (d){return d.name.split('_').join(' ');}); //substitute the underscore because it goes out of the background box

		node.append('rect')
			.attr('width', function (d){return Math.round(this.parentNode.getElementsByTagName('text')[0].getBBox().width + 2);})
			.attr('height', function (d){return Math.round(this.parentNode.getElementsByTagName('text')[0].getBBox().height - 2);})
			.attr('rx', 2 / window.devicePixelRatio) //border radius
			.attr('ry', 2 / window.devicePixelRatio) //border radius
			.attr('y', function (d){return Math.round(this.parentNode.getElementsByTagName('text')[0].getBBox().y + 1);})
			.attr('x', function (d){return Math.round(this.getBBox().width / -2);});

		node.append('circle')
			.attr('r', 6 / window.devicePixelRatio)
			.attr('class', function (e, k){
				elMap[e.name] = this.parentNode;
				return allColorsArray[k];
			});
		node.select('text')[0].forEach(function (text){moveToTop(text);}); //move to the text to the top
		
		/*
		for(j = 0; i < 300; i++){
			force.tick();
		}
		
		force.stop();
		*/

		node.attr('order', function (d){
			orderArray.push([this, d.weight]);
		});

		orderArray = orderArray.sort(function(a, b){return a[1] - b[1];});

		for(j = 0; j < orderArray.length; j++){
			moveToTop(orderArray[j][0]);
		}

		createNetworkFilters();
	}

	var $battalion = $('#battalion'), $viewOptions = $battalion.find('.viewOptions li'), $network = $('#network'), $locale = $('#locale'), $orgchart = $('#orgchart');
	var network;
	var w = window.innerWidth - 40;
	var h = w * 0.75; //make it not exactly square
	var elMap = {}; //elementMap

	createOrgChart();
	initCharts(); //this used to be creating the map/location and is now used for stats
	//createNetwork();
	createViewOptions();
	f();
}

function createPSN(){
	var o = whoIsOnline(); //online.js

	if(o.length > 0){
		for(var s = '', c = [0, 0, 0], i = 0; i < o.length; i++){
			try{
				if(o[i].online === true){
					s === '' ? s += '<ul>' : 0;
					s += '<li><span class="member">' + o[i].player + '</span> is <span class="value">online</span> on the <span class="value">' + o[i].system + '</span></span></li>';
					c[0]++;
				}else if(o[i].online !== false && !Number(o[i].online)){
					s === '' ? s += '<ul>' : 0;
					s += '<li><span class="member">' + o[i].player + '</span> is <span class="value">online</span> and' + (o[i].online.toLowerCase() === 'netflix' || o[i].online.toLowerCase() === 'youtube' ? ' watching ' : ' playing ') + '<span class="value">' + o[i].online.shorten(30, true) + '</span> on the <span class="value">' + o[i].system + '</span></span></li>';
					c[1]++;
				}else if(Number(o[i].online)){
					s === '' ? s += '<ul>' : 0;
					o[i].online <= 0 ? o[i].online = 1 : 0; //Somehow it's possible to have someone sign off 0 minutes ago
					o[i].online >= 60 ? o[i].online = 'an hour ago' : o[i].online += ' minutes ago';
					s += '<li class="offline"><span class="member">' + o[i].player + '</span> signed offline <span>' + o[i].online + '</span></li>';
					c[2]++;
				}else{
					//they aren't online
				}
			}catch(error){
				console.log('there was an error with netflix??', o, o[i].online);
			}
		}

		if(s.length < 1){
			s += '<div class="status"><span class="cat">Online: <span class="accent">0</span></span><span class="cat">Gaming: <span class="accent">0</span></span><span class="cat">Recently offline: <span class="accent">0</span></span></div><ul><li><span class="cat">No members have been online in the past hour.</span></li></ul>';
		}else{
			s = '<div class="status"><span class="cat">Online: <span class="accent">' + (c[0] + c[1]) + '</span></span><span class="cat">Gaming: <span class="accent">' + c[1] + '</span></span><span class="cat">Recently offline: <span class="accent">' + c[2] + '</span></span></div>' + s + '</ul>';
		}

		$psn.find('.memberlist').html(s).find('span.member').on('click', function (e){memberHandler(this.innerHTML);});
	}
}