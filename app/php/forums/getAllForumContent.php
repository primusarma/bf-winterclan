<?PHP
	include '../sql.php';
	$a = new PDO('mysql:host=localhost; dbname=winterclan; charset=utf8', $user, $pw);

	//forumlist
	$b = $a -> query('SELECT * FROM `forumlist` ORDER BY type DESC, id ASC'); //higher the type is, the higher the priority - type is set in the forums.js
	$c = $b -> fetchAll(PDO::FETCH_ASSOC);

	/*
	//subforums
	$h = [];
	$b = $a -> query("SHOW TABLES LIKE '\_%'"); //anything that starts with an underscore - use \ to escape the wildcard "_"

	
	while($i = $b -> fetchAll(PDO::FETCH_NUM)){
		array_push($h, $i);
	}

	$h = $h[0];
	$i = count($h) - 1;
	$j = json_decode('{}');

	for($k = 0; $k <= $i; $k++){
		$j -> $h[$k][0] = [];
	}

	//second part
	foreach($j as $key => $row){
		$n = $a -> query('SELECT * FROM `' . $key . '`');

		$asdf = $n -> fetchAll(PDO::FETCH_ASSOC);

		$j -> {$key} = json_encode($asdf);
	}


	//$h = json_encode($h);
	*/


	//members
	$d = [];
	$b = $a -> query('SELECT `member`, `lastactive`, `postcount`, `lastpost`, `lastpostdate`, `logincount` FROM `forummembers`');
	$d = $b -> fetchAll(PDO::FETCH_ASSOC);

	$e = [];
	$b = $a -> query('SELECT `member`, `action`, `forum`, `subforum`, `subforumname`, `timestamp` FROM `forumrecentactions` ORDER BY id DESC');
	$e = $b -> fetchAll(PDO::FETCH_ASSOC);
	$f = array('forumlist' => $c, 'members' => $d, 'recent' => $e);

	echo json_encode($f);
?>