<?PHP
	include '../sql.php';

	$d = 'Freeseus' or die('no author was given');
	$e = '1060120620' or die('no date was given');
	$f = 'some title' or die('no titlename was given');
	$g = 'some body text' or die('no bodytext was given');
	$h = '_' . 'Off Topic_SLpUtVqGJAh7S4Ab35Is' or die('no into was given');

	//$c = mysql_connect('localhost', $user, $pw) or die('Unable to connect to MySQL');
	//$s = mysql_select_db('winterclan') or die('Could not select database');

	//Insert Reply
	//mysql_query("INSERT INTO `$h` (`id`, `author`, `dated`, `titletext`, `bodytext`) VALUES('NULL', '$d', '$e', '$f', '$g')") or die(mysql_error());

	//Update Member	
	//mysql_query("UPDATE forummembers SET postcount = postcount + 1, lastpost = '$f', lastpostdate = $e WHERE member = '$d'");
	//$n = mysql_query("SELECT postcount, lastpost, lastpostdate FROM forummembers WHERE member = '$d'");
	//$v = mysql_fetch_object($n);
	//mysql_close($c);
	//echo json_encode($v);

	$h = substr($h, 1);

	$a = explode('_', $h, 2);
	$h = '_' . $a[0];

	echo json_encode($h);
?>