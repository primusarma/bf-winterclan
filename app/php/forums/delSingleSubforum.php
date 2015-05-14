<?PHP
	include '../sql.php';
	$e = '_' . $_POST['forum'] or die('no forum name was given');
	$f = '_' . $_POST['subforum'] or die('no forum name was given');
	$p = new PDO('mysql:host=localhost; dbname=winterclan; charset=utf8', $user, $pw);

	$s = $p -> prepare('DELETE FROM `' . $e . '` WHERE `topic` = :subforum LIMIT 1');
	$s -> execute(array(':subforum' => $f));

	$s = $p -> prepare('DROP TABLE IF EXISTS `' . $f . '`');
	$s -> execute(array(':subforum' => $f));

	//delete from the unread members column
	$c = mysql_connect('localhost', $user, $pw) or die('Unable to connect to MySQL');
	$s = mysql_select_db('winterclan') or die('Could not select database');
	$sql = mysql_query("SELECT * FROM `forummembers`");
	
	while($row = mysql_fetch_array($sql)){
		$id = $row['id'];
		$member = $row['member'];
		$unread = $row['unreadtopics'];

		if(substr($unread, -1) != ','){
			$unread .= ',';
		}

		$unread = str_replace($f . ',','', $unread);

		// update data
		if($e !== $member){ //if it's not the poster, add the topic name
			$sqlupdate = mysql_query("UPDATE `forummembers` SET `unreadtopics` = '" . $unread . "' WHERE id='" . $id . "'");
			if(!$sqlupdate) die('Error:' . mysql_error()); //show error message if there is one
		}
	}

	echo json_encode('admin action');


	//$p = mysql_query('DROP TABLE IF EXISTS `dbName`.`tableName`');

	/*
	if($a === $b){
		$c = mysql_query("UPDATE forummembers SET postcount = postcount - 1 WHERE member = '$a'");
		$n = mysql_query("SELECT postcount, lastpost, lastpostdate FROM forummembers WHERE member = '$a'");
		$v = mysql_fetch_object($n);
		mysql_close($c);
		echo json_encode($v);
	}else{ //if the deletor is not the author - in case you don't want to modify the postcount
		echo json_encode('admin action');
	}
	*/
?>