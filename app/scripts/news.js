function createNews(f){
	function getDateText(o){
		var d = new Date(o.date);
			d = String(d).split(' ');

		return '<div class="date"><span>' + d[1] + ' ' + d[2] + ', </span><span>' + d[3] + ' </span><span class="smallcaps">at </span><span>' + o.time + '</span></div>';
	}

	function getEvents(s){
		var m, t, i;

		for(i = 0; i < dataSet._news.data.length; i++){
			if(psnDataSet._memberData[dataSet._news.data[i].author]){
				t = dataSet._news.data[i].title;
				m = dataSet._news.data[i].message;
				s += '<div class="event"><div class="left ' + dataSet._news.data[i].author + '"><div class="avatar"><div class="cornerBigger"></div><div class="cornerBig"></div><div class="corner"></div><img src="' + getUserImage(dataSet._news.data[i].author) + '"></img></div><div class="name">' + dataSet._news.data[i].author + '</div></div><div class="right">' + getDateText(dataSet._news.data[i]) + '<div class="title"><span>' + t + '</span></div><div class="body">' + linkify(m) + '</div></div></div></div></div>';
			}
		}

		return s;
	}

	var psnFail = false;
	var $news = $('#news');

	$news.append(getEvents('')).find('.left').on('click', function (e){
		memberHandler(this.className.split('left ').join(''));
	});

	!psnFail ? f() : 0;
}