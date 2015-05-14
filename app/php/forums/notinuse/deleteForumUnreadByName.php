<?PHP
	include '../sql.php';

	$c = mysql_connect('localhost', $user, $pw) or die('Unable to connect to MySQL');
	$s = mysql_select_db('winterclan') or die('Could not select database');
	$t = '_Off Topic_F8lG9JdlFHf';

	//$result = mysql_query("SELECT `member` FROM `forummembers` WHERE `member` = '$d'");

	//$sql = mysql_query("SELECT * FROM Price WHERE idCar='$idCar'");
	$sql = mysql_query("SELECT * FROM `forummembers`");
	
	while($row = mysql_fetch_array($sql)){
		//$i = $i+1;
		$id = $row['id'];
		$member = $row['member'];
		$unread = $row['unreadtopics'];

		if(substr($unread, -1) != ','){
			$unread .= ',';
		}

		$unread = str_replace($t . ',','', $unread);

		$sqlupdate = mysql_query("UPDATE `forummembers` SET `unreadtopics` = '" . $unread . "' WHERE id='" . $id . "'");
		if(!$sqlupdate) die('Error:' . mysql_error()); //show error message if there is one
	}

	echo json_encode('successfully removed ' . $t . ' from the unread column of all members');
?>