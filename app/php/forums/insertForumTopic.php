<?PHP
	include '../sql.php';

	$d = '_' . $_POST['topic'] or die('no forum name was given');
	$e = $_POST['dated'] or die('no forum name was given');
	$f = $_POST['author'] or die('no forum name was given');
	$g = $_POST['subforumname'] or die('no lock status was given');
	$h = '_' . $_POST['into'] or die('no into was given');

	$c = mysql_connect('localhost', $user, $pw) or die('Unable to connect to MySQL');
	$s = mysql_select_db('winterclan') or die('Could not select database');

	$result = mysql_query("SELECT `topic` FROM `$h` WHERE `topic` = '$d'");
	$tableExists = mysql_num_rows($result) > 0;

	echo($h);

	if(!$tableExists){
		mysql_query("INSERT INTO `$h` (`id`, `topic`, `dated`, `lastpost`, `author`, `subforumname`) VALUES('NULL', '$d', '$e', '$e', '$f', '$g')") or die(mysql_error());
		//echo('record was successfully entered into db');
	}else{
		//echo('exists');
	}

	mysql_close($c);
?>