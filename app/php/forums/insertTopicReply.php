<?PHP
	include '../sql.php';

	$d = $_POST['author'] or die('no author was given');
	$e = $_POST['dated'] or die('no date was given');
	$f = $_POST['titletext'] or die('no titlename was given');
	$g = $_POST['bodytext'] or die('no bodytext was given');
	$h = '_' . $_POST['into'] or die('no into was given');

	$c = mysql_connect('localhost', $user, $pw) or die('Unable to connect to MySQL');
	$s = mysql_select_db('winterclan') or die('Could not select database');

	//Insert Reply
	mysql_query("INSERT INTO `$h` (`id`, `author`, `dated`, `titletext`, `bodytext`) VALUES('NULL', '$d', '$e', '$f', '$g')") or die(mysql_error());

	//Update Member	
	mysql_query("UPDATE forummembers SET postcount = postcount + 1, lastpost = '$f', lastpostdate = $e WHERE member = '$d'");
	$n = mysql_query("SELECT postcount, lastpost, lastpostdate FROM forummembers WHERE member = '$d'");
	$v = mysql_fetch_object($n);

	$i = substr($h, 1);

	$a = explode('_', $i, 2);
	$i = '_' . $a[0];

	//Update lastpost date of parent
	mysql_query("UPDATE `$i` SET lastpost = '$e' WHERE topic = '$h'");

	//Update unread column so members can see that they haven't read this new topic reply
	$sql = mysql_query("SELECT * FROM `forummembers`");

	while($row = mysql_fetch_array($sql)){
		//$i = $i+1;
		$id = $row['id'];
		$member = $row['member'];
		$unread = $row['unreadtopics'];

		$unread = str_replace($h . ',','', $unread);
		$unread .= $h . ',';

		// update data
		if($d !== $member){ //if it's not the poster, add the topic name
			$sqlupdate = mysql_query("UPDATE `forummembers` SET `unreadtopics` = '" . $unread . "' WHERE id='" . $id . "'");
			if(!$sqlupdate) die('Error:' . mysql_error()); //show error message if there is one
		}
	}
	
	mysql_close($c);
	echo json_encode($v);
?>