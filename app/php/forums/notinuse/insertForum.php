<?PHP
	include '../sql.php';
	$d = $_POST['forum'] or die('no forum name was given');
	$e = $_POST['rank'] or die('no forum name was given');
	$f = $_POST['about'] or die('no forum name was given');
	$g = $_POST['author'] or die('no forum name was given');
	$c = mysql_connect('localhost', $user, $pw) or die('Unable to connect to MySQL');
	$s = mysql_select_db('winterclan') or die('Could not select database');

	$result = mysql_query("SELECT `forum` FROM `forumlist` WHERE `forum` = '$d'");
	$tableExists = mysql_num_rows($result) > 0;

	if(!$tableExists){
		mysql_query("INSERT INTO forumlist (`id`, `forum`, `rank`, `about`, `author`) VALUES('NULL', '$d', '$e', '$f', '$g')") or die(mysql_error());
		echo('record was successfully entered into db');
	}else{
		echo('exists');
	}

	mysql_close($c);
?>