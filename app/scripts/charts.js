function createCharts(el){
	//console.log(dataSet.compiled);

	var $el = $(el).empty();
	var $group = $el.append('<div class="chartGroup"><div class="subhead">Roster composition</div></div>').find('.chartGroup');

	companiesChart($group);
	playerStatus($group);
	rankDistr($group);
	invitedBy($group);

	$group = $el.append('<div class="chartGroup"><div class="subhead">Popular games and systems</div></div>').find('.chartGroup').last();
	mostPopularGames($group);
	
	$group = $group.append('<div class="stats"><div class="stat"></div><div class="stat spacer"></div><div class="stat"></div><div class="stat spacer"></div><div class="stat"></div></div>').find('.stats').last();
	membersPlayedOnSystems($group);
	gamesPlayedOnSystems($group);
	genresPlayedOnSystems($group);

	//psn trophies
	$group = $el.append('<div class="chartGroup"><div class="subhead">Trophies acquired</div></div>').find('.chartGroup').last();
	trophiesAcquired($group);

	$group = $el.append('<div class="chartGroup"><div class="subhead">Personality & notoriety</div></div>').find('.chartGroup').last();
	showTitlesOrRoles($group, 'titles');
	showTitlesOrRoles($group, 'roles');

	$group = $el.append('<div class="chartGroup"><div class="subhead">Recruitment timeline</div></div>').find('.chartGroup').last();
	createRosterTimeline($group);
}

function companiesChart($el){
	var data = [];
	for(var k in dataSet.compiled.companies){
		data.push({label: k.split('PrimusArma').join('Primus Arma'), value: dataSet.compiled.companies[k].members.length});
	}

	$el.append('<div class="vis"><div class="chart"></div><div>Enrollment</div></div>');
	createPie($el.find('.vis').last().find('.chart')[0], data.sort(sortValue));
}

function playerStatus($el){
	var data = [];
	for(var k in dataSet.compiled.statuses){
		if(dataSet.compiled.statuses[k] > 0 && k.indexOf('Quit') < 0){ //take out quit for now
			data.push({label: k, value: dataSet.compiled.statuses[k]});
		}
	}
	
	$el.append('<div class="vis"><div class="chart"></div><div>Status</div></div>');
	createPie($el.find('.vis').last().find('.chart')[0], data.sort(sortValue));
}

function rankDistr($el){
	var k, obj = {d:{}, data:[]};

	for(k in dataSet.compiled.roster){
		if(!obj.d[dataSet.compiled.roster[k].rank]){
			obj.d[dataSet.compiled.roster[k].rank] = 1;
		}else{
			obj.d[dataSet.compiled.roster[k].rank]++;
		}
	}

	for(k in obj.d){
		obj.data.push({label: k, value: obj.d[k]});
	}

	$el.append('<div class="vis"><div class="chart"></div><div>Rank distribution</div></div>');
	createPie($el.find('.vis').last().find('.chart')[0], obj.data.sort(sortValue));
}

function invitedBy($el){
	var k;
	var data = [];
	var other = {label: 'Other', value: 0};
	var others;
	for(k in dataSet.compiled.roster){
		if(dataSet.compiled.roster[k].invited.length > 0){
			data.push({label: k, value: dataSet.compiled.roster[k].invited.length});
		}
	}

	data = data.sort(sortValue);
	others = data.splice(0, data.length - 5);

	for(k = 0; k < others.length; k++){
		other.value += others[k].value;
	}

	data.unshift(other);
	$el.append('<div class="vis"><div class="chart"></div><div>Recruitment</div></div>');
	createPie($el.find('.vis').last().find('.chart')[0], data);
}

function mostPopularGames($el){
	var k;
	var s = '<div class="stats">';
	var data = [];
	var most = {pc: null, ps3: null, ps4: null};
	for(k in dataSet.compiled.gameData){
		if(dataSet.compiled.gameData[k].system.indexOf(', ') === -1){ //don't allow spaces
			if(!most[dataSet.compiled.gameData[k].system] || dataSet.compiled.gameData[k].members.length > most[dataSet.compiled.gameData[k].system].members.length){
				most[dataSet.compiled.gameData[k].system] = dataSet.compiled.gameData[k];
			}
		}
	}

	for(k in most){
		s += '<div class="stat"><div class="textGroup ' + (k === 'pc' ? 'left' : k === 'ps3' ? 'center' : 'right') + '"><div class="large ' + most[k].genre.toLowerCase().split(' ').join('') + '">' + most[k].name + '</div><div class="medium">' + most[k].members.length + ' participants' + '</div><div class="small">' + (most[k].system.indexOf(',') < 0 ? 'Only for ' + most[k].system.toUpperCase() : 'For' + most[k].system.toUpperCase()) + '</div><div class="smallest">' + most[k].genre + '</div></div></div>';
	}

	$el.append(s + '</div>');
}

function membersPlayedOnSystems($el){
	var data = [];

	for(var k in dataSet.compiled.systems.members){
		data.push({label: k, value: dataSet.compiled.systems.members[k]});
	}

	$el.find('.stat').first().append('<div class="chart"></div><div>Systems owned</div></div>');
	createColumnChart($el.find('.stat').first().find('.chart')[0], data.sort(sortValue));
}

function gamesPlayedOnSystems($el){
	var data = [];

	for(var k in dataSet.compiled.systems.games){
		data.push({label: k, value: dataSet.compiled.systems.games[k]});
	}

	$el.find('.stat').eq(2).append('<div class="chart"></div><div>Games per system</div></div>');
	createColumnChart($el.find('.stat').eq(2).find('.chart')[0], data.sort(sortValue));
}

function genresPlayedOnSystems($el){
	var data = {pc:{}, ps3:{}, ps4:{}};
	var i, k, k2;
	for(k in dataSet.compiled.gameData){
		var system = dataSet.compiled.gameData[k].system.split(', ');

		for(i = 0; i < system.length; i++){
			for(k2 in data){
				if(!data[k2][dataSet.compiled.gameData[k].genre]){
					data[k2][dataSet.compiled.gameData[k].genre] = 0;
				}
			}

			if(!data[system[i]][dataSet.compiled.gameData[k].genre]){
				data[system[i]][dataSet.compiled.gameData[k].genre] = 1;
			}else{
				data[system[i]][dataSet.compiled.gameData[k].genre]++;
			}
		}
	}

	//console.log(data);

	$el.find('.stat').last().append('<div class="chart"></div><div>Genres per system</div></div>');
	createStackedColumnChart($el.find('.stat').last().find('.chart')[0], data);
}

function trophiesAcquired($el){
	var psnTrophyData = {psnMembers:[], psnAccounts:0, psnTrophies:{_level:[], _total:[], _order:['platinum', 'gold', 'silver', 'bronze'], bronze:[], silver:[], gold:[], platinum:[]}};

	var s = '<div class="stats">';
	var i = 0;
	for(var k in dataSet.compiled.roster){
		if(dataSet.compiled.roster[k].psn && dataSet.compiled.roster[k].trophySummary){
			if(dataSet.compiled.roster[k].trophySummary.level){
				psnTrophyData.psnTrophies._level.push(dataSet.compiled.roster[k].trophySummary.level);
			}

			if(dataSet.compiled.roster[k].trophySummary.earnedTrophies){
				psnTrophyData.psnTrophies._total.push(i);

				for(var k2 in dataSet.compiled.roster[k].trophySummary.earnedTrophies){
					psnTrophyData.psnTrophies[k2].push(dataSet.compiled.roster[k].trophySummary.earnedTrophies[k2]);
					psnTrophyData.psnTrophies._total[i] += dataSet.compiled.roster[k].trophySummary.earnedTrophies[k2];
				}

				i++;
			}

			psnTrophyData.psnAccounts++;
			psnTrophyData.psnMembers.push(k);
		}
	}

	/*
	console.log(psnTrophyData);

	console.log('bronze average', psnTrophyData.psnTrophies.bronze.average());
	console.log('silver average', psnTrophyData.psnTrophies.silver.average());
	console.log('gold average', psnTrophyData.psnTrophies.gold.average());
	console.log('platinum average', psnTrophyData.psnTrophies.platinum.average());
	console.log('total trophies average', psnTrophyData.psnTrophies._total.average());
	*/

	for(i = 0; i < psnTrophyData.psnTrophies._order.length; i++){
		k = psnTrophyData.psnTrophies._order[i];
		var text = '<div>' + Math.floor(psnTrophyData.psnTrophies[k].sum()) + ' total</div>';
			text += '<div>' + Math.floor(psnTrophyData.psnTrophies[k].average()) + ' on avg</div>';

		s += '<div class="stat"><div class="imageGroup ' + (k === 'platinum' ? 'left' : k === 'bronze' ? 'right' : 'center') + '"><div class="trophy ' + k + '"></div><div class="label">' + k.capitalize() + '</div>' + text + '</div></div>';
	}

	$el.append(s + '</div>');
	getAppendUnstyledSVGImage('images/icons/trophy_bronze.svg', isMobileDevice() ? {width:40, height:40} : {width:80, height:80}, $el.find('.trophy'));
}

function showTitlesOrRoles($el, which){
	var data = [];

	for(var k in dataSet.compiled.values[which]){
		data.push({label: k, value: dataSet.compiled.values[which][k]});
	}

	$el.append('<div class="bar"><div class="chartTitle">Member ' + which + '</div></div>');
	createBarChart($el.find('.bar').last()[0], data, true);
}

function createRosterTimeline($el){
	$el.append('<div class="plot"><div class="chart"></div><div>Members recruited over time</div></div>');
	createScatterplot($el.find('.plot .chart')[0]);
}

function createPie(el, data, val, useDataColor){
	var width = isMobileDevice() ? 120 : 155,
		height = width,
		radius = Math.min(width, height) / 2;

	var colorPercent = d3.scale.linear().domain([-0.1, 1]).range(['#2d3137', '#428DCE']); //#2d3137, #E9E9E9, #428DCE

	var totalValue = 0; 
	var arc = d3.svg.arc()
		.outerRadius(radius - 15)
		.innerRadius(radius - 25);

	var arc2 = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(radius - 30);

	var pie = d3.layout.pie()
		.padAngle(0.015)
		.sort(null) //enable this to remove sorting
		.value(function (d){
			totalValue += d.value;
			return d.value;
		});

	var padding = 50; //necessary for the text that runs off
	var svg = d3.select(el).append('svg')
		.attr('width', width + padding) //50px of padding
		.attr('height', height)
		.append('g')
		.attr('transform', 'translate(' + (width + padding) / 2 + ',' + height / 2 + ')');

	//for the arcs
	var g = svg.selectAll('.arc')
		.data(pie(data))
		.enter().append('g')
		.attr('class', function (d, i){
			return 'arc ' + 'txt' + i;
		});

	g.append('path')
		.attr('d', arc)
		.attr('dlength', data.length - 1)
		.style('fill', function (d, i){
			//return colorPercent(d.data.value / totalValue); //this will give you the fraction of the data
			return useDataColor ? d.data.color : colorPercent(i / Number(this.getAttribute('dlength')));}) //this will give you the int order of the data
		.on('mouseover', function (d){
			d3.select(this.parentNode.parentNode).selectAll('.arc path').transition()
				.ease('expo')
				.duration(100)
				.style('opacity', 0.25)
				.style('fill', function (d, i){
					//return colorPercent(d.data.value / totalValue); //this will give you the fraction of the data
					return useDataColor ? d.data.color : colorPercent(i / Number(this.getAttribute('dlength')));}) //this will give you the int order of the data
				.attr('d', arc);
			d3.select(this.parentNode.parentNode).selectAll('.lbl').transition()
				.ease('expo')
				.duration(100)
				.style('opacity', 0);
			d3.select(this.parentNode.parentNode).selectAll('.' + this.parentNode.className.baseVal.split('arc ').join('')).transition()
				.ease('expo')
				.duration(100)
				.style('opacity', 1);
			d3.select(this)
				.transition()
				.ease('expo')
				.duration(100)
				.style('opacity', 1)
				.style('fill', function (d, i){
					//return colorPercent(d.data.value / totalValue); //this will give you the fraction of the data
					return useDataColor ? d.data.color : colorPercent(1);}) //this will give you the int order of the data
				.attr('d', arc2);
			})
		.on('mouseout', function (d){
			d3.select(this.parentNode.parentNode).selectAll('.arc path').transition()
				.ease('expo')
				.duration(100)
				.style('opacity', 1)
				.style('fill', function (d, i){
					//return colorPercent(d.data.value / totalValue); //this will give you the fraction of the data
					return useDataColor ? d.data.color : colorPercent(i / Number(this.getAttribute('dlength')));}) //this will give you the int order of the data
				.attr('d', arc);

			d3.select(this.parentNode.parentNode).selectAll('.lbl').transition()
				.ease('expo')
				.duration(750)
				.style('opacity', 1);
		});

	//for the text labelling, which needs to be on top of the arcs
	var h = svg.selectAll('.lbl')
		.data(pie(data))
		.enter().append('g')
		.attr('class', function (d, i){
			return 'lbl ' + 'txt' + i;
		});

	h.append('text')
		.attr('transform', function (d){
			return 'translate(' + arc.centroid(d) + ')';})
		.attr('dy', '0')
		.style('text-anchor', 'middle')
		.text(function (d){
			return d.data.label;
		});

	h.append('text')
		.attr('class', 'int')
		.attr('transform', function (d){
			return 'translate(' + arc.centroid(d) + ')';})
		.attr('dy', '12px')
		.style('text-anchor', 'middle')
		.text(function (d){
			return val === 'both' ? d.data.value + ' (' + Math.round(d.data.value / (totalValue / 2) * 1000) / 10 + '%)' : val ? d.data.value : Math.round(d.data.value / (totalValue / 2) * 1000) / 10 + '%';
		});
}

function createScatterplot(el){
	function createLine(){
		var line = d3.svg.line()
			.x(function (d){return xScale(d.value);})
			.y(function (d){return yScale(d.i / (data.length - 1));});

		svg.append('svg:path')
			.attr('class', 'plotline')
			.attr('d', line(data));
	}

	function createArea(){
		var area = d3.svg.area()
			.x(function (d){return xScale(d.value);})
			.y0(function (d){return yScale(0);})
			.y1(function (d){return yScale(d.i / (data.length - 1));});

		svg.append('svg:path')
			.attr('class', 'plotarea')
			.attr('d', area(data));
	}

	function createColumns(){
		svg.append('g').attr('class', 'cols').selectAll('.col')
			.data(data).enter().append('rect')
			.attr('class', function (d){
				return 'col ' + d.genre;
			})
			.attr('x', function (d){
				return Math.floor(xScale(d.value));
			})
			.attr('y', function (d){
				return yScale(0) - yScale(1 - (d.i / (data.length - 1)));
			})
			.attr('width', function (d){
				if(d.i === data.length - 1){
					console.log('last');
				}else if(d.i > 0){
					//console.log(Math.floor(xScale(data[d.i + 1].value)) - Math.floor(xScale(d.value)));
					return Math.floor(xScale(data[d.i + 1].value)) - Math.floor(xScale(d.value));
				}else{
					//console.log(Math.floor(xScale(data[1].value)) - Math.floor(xScale(d.value)));
					return Math.floor(xScale(data[1].value)) - Math.floor(xScale(d.value));
				}

				return 0;
			})
			.attr('height', function (d){
				return yScale(1 - (d.i / (data.length - 1)));
		});
	}

	function createCircles(){
		svg.append('g').attr('class', 'circles').selectAll('circle')
			.data(data).enter().append('circle')
			.attr('class', function (d){return d.genre;})
			.attr('cx', function (d){return Math.floor(xScale(d.value));})
			.attr('cy', function (d, i){
				//console.log(i);
				//return yScale(d.i / (data.length - 1));})
				//return Math.floor(yScale(Math.random() * 1));})

				//console.log(yScale(d.i / (data.length - 1)));

				if(i > 0){
					//console.log(Math.floor(xScale(d.value)), Math.floor(xScale(data[i - 1].value)), 'vs', getR(d));
					if(Math.floor(xScale(d.value)) - Math.floor(xScale(data[i - 1].value)) < getR(d) && last / h < yScale(last) && d.i / (data.length - 1) > last){
						last += getR(d) / h;
					}else{
						last = 0;
					}
				}

				return yScale(last);})
			.attr('r', getR)
			.on('mouseover', function (d){
				/*
				svg.append('defs')
					.append('pattern')
					.attr('id', 'svgMemberFill')
					.attr('width', function(){return getR2() * 2;})
					.attr('height', function(){return getR2() * 2;})
					.append('image')
					.attr('width', function(){return getR2() * 2;})
					.attr('height', function(){return getR2() * 2;})
					.attr('xlink:href', 'images/Freeseus_1.png');
				*/

				var x, y, c, b, g, t, r;
				g = svg.select('.circles').append('g').attr('class', 'gHover');
				
				x = Math.round(this.getBBox().x + (getR(d)) + (getR({rank: 'Founder'}) * 1.5));
				y = Math.round(this.getBBox().y - getR({rank: 'Founder'}) + getR(d));

				t = g.append('text')
					.attr('dy', '1em')
					.attr('text-anchor', 'left')
					.attr('x', x)
					.attr('y', y)
					.style('pointer-events', 'none');
					
					/*
					.text(function (){
						//console.log(d);

						var date = new Date(d.value);
							date = String(date).split(' ');
						console.log(date[1] );

						return d.label.split('_').join(' ') + ' ' + date[1] + ', ' + date[3];
					}); //substitute the underscore because it goes out of the background box
*/

				b = Math.round(d3.select(this.parentNode).select('.gHover')[0][0].getBBox().height - 2);

				t.append('tspan').text(d.label.split('_').join('\xA0')); //hard coded no-breaking space

				/*
				t.append('tspan')
					.attr('y', b)
					.text(function(){
						var date = new Date(d.value);
							date = String(date).split(' ');

						return date[1] + ', ' + date[3];
				});
*/

				c = Math.round(d3.select(this.parentNode).select('.gHover')[0][0].getBBox().width + 2);
				b = Math.round(d3.select(this.parentNode).select('.gHover')[0][0].getBBox().height - 2);

				r = g.append('rect')
					.attr('x', x - 1)
					.attr('y', y + 2)
					.attr('width', c)
					.attr('height', b)
					.attr('rx', 2 / window.devicePixelRatio) //border radius
					.attr('ry', 2 / window.devicePixelRatio); //border radius

					//console.log(x + c, w);

				if(x + c >= w - 10){ //10 pixels of buffer from the edge of the screen
					x = this.getBBox().x - (getR(d) / 2);

					t.attr('x', x).attr('text-anchor', 'end');
					r.attr('x', x - t[0][0].getBBox().width - 1);
				}
				
				moveToTop(this);
				moveToTop(t[0][0]);

				d3.select(this)
					//.transition()
					//.ease('expo')
					//.duration(100)
					.attr('r', getR2);
					//.style('fill', 'url(#svgMemberFill)')
					//.style('stroke', function (d){return d.color;})
					//.style('stroke-width', 4);
				})
			.on('mouseout', function (d){
				//svg.selectAll('defs').remove();
				svg.select('.circles').selectAll('.gHover').remove();
				moveToBottom(this);
				d3.select(this)
					//.transition()
					//.ease('expo')
					//.duration(100)
					.attr('r', getR)
					.style('fill', function (d){return d.color;});
					//.style('stroke', '')
					//.style('stroke-width', '');
				}).on('click', function (d){memberHandler(d.label);});
	}

	function createAxiis(){
		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient('bottom')
			.ticks(isMobileDevice() ? 5 : 8)
			.tickFormat(d3.format('d'))
			.tickFormat(function (d, i){
				date = new Date(d);
				var a = String(date).split(' ');
				return a[1] + ' ' + a[3];
			});

		var yTickCount = isMobileDevice() ? 2 : 4;
		var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient('right')
			.ticks(yTickCount)
			.tickFormat(function (d, i){
				return i === 0 ? '' : i - 1 === yTickCount ? Math.ceil(data.length * d) + ' Members' : Math.ceil(data.length * d);
			});

		svg.append('g')
			.attr('class', 'axis')
			.attr('transform', 'translate(0,' + (h - padding) + ')')
			.call(xAxis);

		svg.append('g')
			.attr('class', 'axis')
			//.attr('transform', 'translate(' + (w - getR2()) + ', 0)')
			.call(yAxis);
	}

	var k;
	var data = [];
	var other = {label: 'Other', value: 0};
	var others;
	var getR = function(d){
		var v = 3;
		if(d.rank === 'Soldier'){
			v += 1;
		}else if(d.rank === 'Officer'){
			v += 2;
		}else if(d.rank === 'Founder'){
			v += 3;
		}

		//return v;
		return getR2();
	};

	var getR2 = function(){
		return 6;
	};

	for(k in dataSet.compiled.roster){
		if(dataSet.compiled.roster[k].joindate !== null){
			data.push({label: k, genre: dataSet.compiled.roster[k].genresPlayed.length > 1 ? 'many' : dataSet.compiled.roster[k].genresPlayed[0].toLowerCase().split(' ').join(''), rank: dataSet.compiled.roster[k].rank, value: dataSet.compiled.roster[k].joindate});
		}
	}

	data = data.sort(sortValue);

	for(k = 0; k < data.length; k++){
		data[k].i = k;
	}

	var w = el.offsetWidth;
	var h = isMobileDevice() ? w / 2 : w / 4; //make it rectangular;
	var padding = 20;
	var date;

	var xScale = d3.scale.linear()
		.domain([d3.min(data, function (d){return d.value;}), d3.max(data, function (d){return d.value;})])
		.range([0 + getR2(), w - getR2()]);

	var yScale = d3.scale.linear()
		.domain([0, 1])
		.range([h - padding, padding / 2]);

	var svg = d3.select(el)
		.append('svg')
		.attr('width', w)
		.attr('height', h);

	var last = 0;
	
	
	createLine();
	createArea();
	//createColumns();
	createAxiis();
	createCircles();
}

function createColumnChart(el, data){
	var colorPercent = d3.scale.linear().domain([-0.1, 1]).range(['#2d3137', '#428DCE']); //#2d3137, #E9E9E9, #428DCE
	var w = el.offsetWidth;
	var h = 200; //make it rectangular;
	var padding = 30;

	var max = d3.max(data, function (d){return d.value;});
	var svg = d3.select(el).append('svg')
		.attr('class', 'column')
		.attr('width', w - 1) //-1 for the 1px subtracted from the width of each column
		.attr('height', h + 10);
	
	var xScale = d3.scale.ordinal().rangeRoundBands([0, w], 0, 0).domain(data.map(function (d){return d.label;}));
	var yScale = d3.scale.linear().domain([0, max]).range([h, padding]);
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.tickSize(5)
		.tickSubdivide(true);

	svg.append('g')
		.attr('class', 'cols')
		.selectAll('rect')
		.data(data).enter()
		.append('rect')
		.attr('int', function (d, i){return i + 1;})
		.attr('x', function (d){
			return xScale(d.label);
		})
		.attr('y', function (d){
			return yScale(d.value) - padding / 2;
		})
		.attr('width', xScale.rangeBand() - 1) //shrink columns by 1px to allow for 1px of space between them
		.attr('height', function (d){
			return h - yScale(d.value);
		})
		.style('fill', function (d, i){
			return colorPercent(d.value / max);
		}).on('mouseover', function (d){
			d3.select(this.parentNode).selectAll('rect').transition() //alpha out all columns
				.ease('expo')
				.duration(100)
				.style('opacity', 0.25);

			d3.select(this.parentNode.parentNode).selectAll('.labels text').transition() //alpha out all top labels
				.ease('expo')
				.duration(100)
				.style('opacity', 0);

			d3.select(this).transition() //alpha in and change to bright blue for column on hover
				.ease('expo')
				.duration(100)
				.style('opacity', 1)
				.style('fill', colorPercent(1));

			d3.select(this.parentNode.parentNode).selectAll('.labels text').transition() //alpha out all top labels
				.ease('expo')
				.duration(100)
				.style('opacity', 0)
				.style('fill', function (d2){
					return colorPercent(d2.value / max);
				});

			d3.select(this.parentNode.parentNode).selectAll('.labels text:nth-child(' + this.getAttribute('int') + ')').transition() //alpha and bright color corresponding label
				.ease('expo')
				.duration(100)
				.style('opacity', 1)
				.style('fill', colorPercent(1));
		}).on('mouseout', function (d){
			d3.select(this.parentNode).selectAll('rect').transition()
				.ease('expo')
				.duration(100)
				.style('opacity', 1)
				.style('fill', function (d2){
					return colorPercent(d2.value / max);
				});

			d3.select(this.parentNode.parentNode).selectAll('.labels text').transition() //alpha in all top labels
				.ease('expo')
				.duration(750)
				.style('opacity', 1)
				.style('fill', function (d2){
					return colorPercent(d2.value / max);
				});
		});

	svg.append('g')
		.attr('class', 'labels')
		.selectAll('text')
		.data(data).enter()
		.append('text')
		.attr('class', 'val')
		.attr('int', function (d, i){return i + 1;})
		.attr('text-anchor', 'middle')
		.attr('x', function (d){
			return xScale(d.label) + (xScale.rangeBand() / 2);
		})
		.attr('y', function (d){
			return yScale(d.value) - padding / 2 - 5;
		})
		.text(function (d){
			return d.value;
		})
		.style('fill', function (d){
			return colorPercent(d.value / max);
		});

	svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + (h - padding / 2) + ')')
		.call(xAxis);

	svg.attr('width', window.innerWidth / 2 - 20); //this gets rid of 2px of padding on the sides
}

function createStackedColumnChart(el, data){
	var newData = [];
	var color = d3.scale.ordinal().range(['#98abc5', '#8a89a6']);
	var width = el.offsetWidth, height = 200 - 30;
	var x = d3.scale.ordinal().rangeRoundBands([0, width], 0, 0);
	var y = d3.scale.linear().rangeRound([height, 0]);
	var xAxis = d3.svg.axis().scale(x).orient('bottom');
	var svg = d3.select(el).append('svg')
		.attr('class', 'column')
		.attr('width', width - 1) //-1 for the 1px subtracted from the width of each column
		.attr('height', height + 30 + 10) //need 10 more pixels for text above
		.append('g');

	for(var k in data){
		data[k].label = k;
		newData.push(data[k]);
	}

	data = newData;
	newData = null;

	color.domain(d3.keys(data[0]).filter(function (key){ return key !== 'label';}));

	data.forEach(function (d){
		var y0 = 0;
		d._stacks = color.domain().map(function (label){return {label: label, y0: y0, y1: y0 += +d[label]};});
		d.total = d._stacks[d._stacks.length - 1].y1;
	});

	data.sort(function (a, b){return a.total - b.total;});

	x.domain(data.map(function (d){return d.label;}));
	y.domain([0, d3.max(data, function (d){return d.total;})]);

	svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + (height + 3 + 10) + ')') //need 10 more pixels for text above
		.call(xAxis);

	var label = svg.selectAll('.label')
		.data(data)
		.enter().append('g')
		.attr('class', 'stack')
		.attr('int', function (d, i){return i + 1;})
		.attr('transform', function (d){return 'translate(' + x(d.label) + ',5)';})
		.on('mouseover', function (d){
			d3.select(this.parentNode).selectAll('.stack').transition() //alpha out all columns
				.ease('expo')
				.duration(100)
				.style('opacity', 0.25);

			d3.select(this.parentNode).selectAll('.labels text').transition() //alpha out all top labels
				.ease('expo')
				.duration(100)
				.style('opacity', 0);

			d3.select(this).transition() //alpha in column
				.ease('expo')
				.duration(100)
				.style('opacity', 1);

			d3.select(this.parentNode).selectAll('.labels text:nth-child(' + this.getAttribute('int') + ')').transition() //alpha in corresponding label
				.ease('expo')
				.duration(100)
				.style('opacity', 1);
		}).on('mouseout', function (d){
			d3.select(this.parentNode).selectAll('.stack').transition()
				.ease('expo')
				.duration(100)
				.style('opacity', 1);

			d3.select(this.parentNode.parentNode).selectAll('.labels text').transition() //alpha in all top labels
				.ease('expo')
				.duration(750)
				.style('opacity', 1);
		});

	label.selectAll('rect')
		.data(function (d){return d._stacks;})
		.enter().append('rect')
		.attr('class', function (d){return d.label.toLowerCase().split(' ').join('');})
		.attr('width', x.rangeBand() - 1) //shrink columns by 1px to allow for 1px of space between them
		.attr('y', function (d){return y(d.y1) + 10 + 1;}) //need 10 more pixels for text above
		.attr('height', function (d) {return y(d.y0) - y(d.y1) - 1 > -0.5 ? y(d.y0) - y(d.y1) - 1 : 0;})
		.style('opacity', function (d){
			return 1;
		});

	svg.append('g')
		.attr('class', 'labels')
		.selectAll('text')
		.data(data).enter().append('text')
		.attr('class', 'val')
		.attr('text-anchor', 'middle')
		.attr('x', function (d){
			return (x(d.label) - 1) + (x.rangeBand() / 2);
		})
		.attr('y', function (d){
			return y(d._stacks[d._stacks.length - 1].y1) + 10; //need 10 more pixels for text above
		})
		.text(function (d){
			var t = 0;

			for(var k in d){
				k !== 'total' && k !== 'label' && k !== '_stacks' && d[k] > 0 ? t++ : 0;
			}

			return t;
		})
		.style('fill', function (d){
			return '#428DCE';
			//return colorPercent(d.value / max);
		});
}

function createBarChart(el, data, prepend){
	var max = 0; //max is maximum value
	var colorPercent = d3.scale.linear().domain([-0.1, 1]).range(['#2d3137', '#428DCE']); //#2d3137, #E9E9E9, #428DCE

	data = data.sort(sortValueThenLabel);
	max = d3.max(data, function (d){return d.value;});

	var minBarWidth = 95; //praetorian is currently the longest title
	var width = el.offsetWidth, barHeight = 18;

	var x = d3.scale.linear()
		.domain([d3.min(data, function (d){return d.value;}), max])
		.range([0, width - minBarWidth]);

	var chart = d3.select(el).append('svg')
		.attr('width', width)
		.attr('height', barHeight * data.length);

	var bar = chart.selectAll('g')
		.data(data)
		.enter().append('g')
		.attr('transform', function (d, i){return 'translate(0,' + i * barHeight + ')';})
		.on('mouseover', function (d){
			d3.select(this.parentNode).selectAll('g').transition() //alpha out all bars
				.ease('expo')
				.duration(100)
				.style('opacity', 0.25);

			d3.select(this).transition() //alpha in bar
				.ease('expo')
				.duration(100)
				.style('opacity', 1);

			d3.select(this).select('rect').transition() //alpha in bar
				.ease('expo')
				.duration(100)
				.style('fill', colorPercent(1));

		}).on('mouseout', function (d){
			d3.select(this.parentNode).selectAll('g').transition()
				.ease('expo')
				.duration(100)
				.style('opacity', 1);

			d3.select(this).select('rect').transition() //alpha in bar
				.ease('expo')
				.duration(100)
				.style('fill', function (d2){
					return colorPercent(d2.value / Number(this.getAttribute('max')));
				});
		});

	bar.append('rect')
		.attr('class', 'hbar')
		.attr('max', max)
		.style('fill', function (d, i){
			return colorPercent(d.value / Number(this.getAttribute('max'))); //this will give you the int order of the data
		})
		.attr('width', function (d){return minBarWidth + x(d.value);})
		.attr('height', barHeight - 1);

	bar.append('text')
		.attr('x', function (d){return 5;})
		.attr('y', barHeight / 2)
		.attr('dy', '.25em')
		.text(function (d){return d.label;});

	bar.append('text')
		.attr('x', function (d){return minBarWidth + x(d.value) - 5;})
		.attr('y', barHeight / 2)
		.attr('dy', '.25em')
		.attr('text-anchor', 'end')
		.text(function (d){return d.value;});

	prepend ? moveToBottom(chart[0][0]) : 0; //needs to be move to bottom
}

function createStackedBarChart(el, data, val, useDataColor){
	var w = el.offsetWidth;
	var h = 17;
	var padding = 20;


	//console.log(data);

	var dataset = data.map(function (d){
		return d.data.map(function (d2){
			return{
				color: d2.color,
				label: d2.label,
				y: d2.value,
			};
		});
	}),
	stack = d3.layout.stack();
	stack(dataset);

	//console.log('before', dataset);

	dataset = dataset.map(function (g){ //g for group
		return g.map(function (d, i){ //Invert the x and y values, and y0 becomes x0
			return{
				color: d.color,
				label: d.label,
				x: d.y0,
				value: d.y
			};
		});
	});

	//console.log('after', dataset);

	svg = d3.select(el)
		.append('svg')
		.attr('width', w)
		.attr('height', h)
		.append('g'),
		xMax = d3.max(dataset, function (g){
			return d3.max(g, function (d){
				return d.value + d.x;
			});
		});

	xScale = d3.scale.linear().domain([0, xMax]).range([0, w]);
	groups = svg.selectAll('g').data(dataset).enter().append('g')
		.style('fill', function (d){
			//return colorPercent(d.data.value / totalValue); //this will give you the fraction of the data

			return useDataColor ? d[0].color : '#e9e9e9'; //this will give you the int order of the data
		});

	groups.append('rect')
		.attr('class', 'hbar')
		.attr('x', function (d){
			return xScale(d[0].x);
		})
		.attr('height', h)
		.attr('width', function (d, i){
			return xScale(d[0].value) - 1.5;
		});

	groups.append('text')
		.attr('x', function (d){return xScale(d[0].x) + xScale(d[0].value) - 6.5;})
		.attr('y', Math.floor(h / 2))
		.attr('dy', '.25em')
		.attr('text-anchor', 'end')
		.text(function (d){console.log(d);return d[0].label + ': ' + d[0].value;});
}