<?PHP
	include '../sql.php';
	$d = $_POST['forum'] or die('missing info');
	$e = $_POST['rank'] or die('missing info');
	$f = $_POST['about'] or die('missing info');
	$g = $_POST['author'] or die('missing info');
	$h = $_POST['type'] or die('missing info');
	$c = mysql_connect('localhost', $user, $pw) or die('Unable to connect to MySQL');
	$s = mysql_select_db('winterclan') or die('Could not select database');

	//echo($d . ', ' . $e . ', ' . $f . ', ' . $g . ', ' . $h);

	function flattenArray(&$arr, &$dst){
		if(!isset($dst) || !is_array($dst)){
			$dst = array();
		}

		if(!is_array($arr)){
			$dst[] = $arr;
		}else{
			foreach($arr as &$subject){
				flattenArray($subject, $dst);
			}
		}
	}

	$result = mysql_query("SELECT `forum` FROM `forumlist` WHERE `forum` = '$d'");
	$tableExists = mysql_num_rows($result) > 0;

	if(!$tableExists){
		mysql_query("INSERT INTO forumlist (`forum`, `type`, `rank`, `about`, `author`) VALUES('$d', '$h', '$e', '$f', '$g')") or die(mysql_error());
		
		$db = new PDO('mysql:host=localhost; dbname=winterclan; charset=utf8', $user, $pw);
		$db -> setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );//Error Handling
		$sql = 'CREATE TABLE ' . '`_' . $d . '`' . ' (
		id INT( 11 ) AUTO_INCREMENT PRIMARY KEY,
		author VARCHAR( 50 ) NOT NULL,
		dated BIGINT( 20 ) NOT NULL, 
		lastpost BIGINT( 20 ) NOT NULL,
		topic VARCHAR( 150 ) NOT NULL, 
		subforumname VARCHAR( 50 ) NOT NULL);';
		$db -> exec($sql);
		//echo 'success';

		//forumlist
		//$a = new PDO('mysql:host=localhost; dbname=winterclan; charset=utf8', $user, $pw);
		$b = $db -> query('SELECT * FROM `forumlist`');
		$c = $b -> fetchAll(PDO::FETCH_ASSOC);

		//members
		$d = [];
		$b = $db -> query('SELECT `member`, `lastactive`, `postcount`, `lastpost`, `lastpostdate`, `logincount` FROM `forummembers`');
		$d = $b -> fetchAll(PDO::FETCH_ASSOC);
		$forumData = array('forumlist' => $c, 'members' => $d);

		//echo json_encode($forumData);



		//get everything out of all the tables
		$a = [];
		$c = [];
		//$p = new PDO('mysql:host=localhost; dbname=winterclan; charset=utf8', $user, $pw);
		$s = $db -> query("SHOW TABLES LIKE '\_%'"); //anything that starts with an underscore - use \ to escape the wildcard "_"

		while($r = $s -> fetchAll(PDO::FETCH_NUM)){
			$c = $r;
		}

		flattenArray($c, $a);

		//second part

		$c = [];
		//$p = new PDO('mysql:host=localhost; dbname=winterclan; charset=utf8', $user, $pw);

		foreach ($a as $t){
			$u = $db -> query('SELECT * FROM `' . $t . '`');
			$c[$t] = $u -> fetchAll(PDO::FETCH_ASSOC);
		}

		//echo json_encode($c);

		$finalData = array('forumData' => $forumData, 'underscoreData' => $c);
		$db = null;
		echo json_encode($finalData);
	}else{
		echo('exists');
	}

	mysql_close($c);
?>