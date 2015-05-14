function createGames(f){
	function buildGames(){
		var a = [], i = 0, s = '<div class="group"><div class="heading"><div class="title">', t = false;
		//var c = {fpselite: 'rgba(107, 74, 42, 0.9)', fps:'rgba(62, 42, 39, 0.9)', rts:'rgba(66, 59, 81, 0.9)', mmo:'rgba(54, 67, 75, 0.9)', sports:'rgba(57, 59, 50, 0.9)', vehicle:'rgba(115, 107, 64, 0.9)'};

		for(var k in dataSet.compiled.gameData){
			a.push({g:dataSet.compiled.gameData[k], order:dataSet.compiled.gameData[k].order});
		}

		a.sort(function (a, b){return b.order - a.order;});

		for(i; i < a.length; i++){
			if(i === 0){
				s += (a[i].g.active > 0 ? 'Active' : 'Inactive') + '</div></div>';
			}

			if(a[0].g.active !== a[i].g.active && !t){
				s += '</div><div class="group"><div class="heading"><div class="title">' + (a[i].g.active > 0 ? 'Active' : 'Inactive') + '</div></div>';
				t = true;
			}

			if(a[i].g.active > 0){
				//s += '<div style="background-image: linear-gradient(to right, ' + c[a[i].g.genre.toLowerCase().split(' ').join('')] + ' 0%, rgba(45, 49, 55, 0) 100%), url(images/' + a[i].g.game.toLowerCase() + 'small.png)" class="game ' + a[i].g.genre.toLowerCase().split(' ').join('') + '"><div class="fill ' + a[i].g.genre.toLowerCase().split(' ').join('') + '"></div><span class="name">' + a[i].g.name + '</span><span class="type">' + a[i].g.genre.toLowerCase() + '</span><span class="count">' + a[i].g.activeMembers.length + '/' + a[i].g.members.length + ' members active</span></div>';
				s += '<div class="game ' + a[i].g.genre.toLowerCase().split(' ').join('') + '"><div class="fill ' + a[i].g.genre.toLowerCase().split(' ').join('') + '"></div><span class="name">' + a[i].g.name + '</span><span class="type">' + a[i].g.genre.toLowerCase() + '</span><span class="count">' + a[i].g.activeMembers.length + '/' + a[i].g.members.length + ' members active</span></div>';
			}else{
				//s += '<div style="background-image: linear-gradient(to right, ' + c[a[i].g.genre.toLowerCase().split(' ').join('')] + ' 0%, rgba(45, 49, 55, 0) 100%), url(images/' + a[i].g.game.toLowerCase() + 'small.png)" class="game ' + a[i].g.genre.toLowerCase().split(' ').join('') + '"><div class="fill ' + a[i].g.genre.toLowerCase().split(' ').join('') + '"></div><span class="name">' + a[i].g.name + '</span><span class="type">' + a[i].g.genre.toLowerCase() + '</span><span class="count">' + a[i].g.members.length + ' members</span></div>';
				s += '<div class="game ' + a[i].g.genre.toLowerCase().split(' ').join('') + '"><div class="fill ' + a[i].g.genre.toLowerCase().split(' ').join('') + '"></div><span class="name">' + a[i].g.name + '</span><span class="type">' + a[i].g.genre.toLowerCase() + '</span><span class="count">' + a[i].g.members.length + ' members</span></div>';
			}
		}

		s += '</div>';
		$games.append(s);
	}

	var $games = $('#games');

	buildGames();
	f();
}