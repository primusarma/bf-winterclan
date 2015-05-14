<?PHP
	include '../sql.php';

	$c = mysql_connect('localhost', $user, $pw) or die('Unable to connect to MySQL');
	$s = mysql_select_db('winterclan') or die('Could not select database');
	//$t = $_POST['topic'] or die('no topic name was given');
	//$e = $_POST['member'] or die('no member name was given'); //except for this member - the original poster
	$t = 'somethingelse';

	//$result = mysql_query("SELECT `member` FROM `forummembers` WHERE `member` = '$d'");

	//$sql = mysql_query("SELECT * FROM Price WHERE idCar='$idCar'");
	$sql = mysql_query("SELECT * FROM `forummembers`");
	
	while($row = mysql_fetch_array($sql)){
		//$i = $i+1;
		$id = $row['id'];
		$member = $row['member'];
		$unread = $row['unreadtopics'];

		if(substr($str, -1) != ','){
			$unread .= ',';
		}

		$unread = str_replace($t . ',','', $unread);
		$unread .= $t;
		//$unread = 'testthings,somethingelse,naonleose,sdfofga,hello';
		$unread = '';

		// update data
		if($e !== $member){ //if it's not the poster, add the topic name
			$sqlupdate = mysql_query("UPDATE `forummembers` SET `unreadtopics` = '" . $unread . "' WHERE id='" . $id . "'");
			if(!$sqlupdate) die('Error:' . mysql_error()); //show error message if there is one
		}
	}
?>