<?PHP
	include '../sql.php';
	$d = $_POST['name'] or die('fail');
	$t = $_POST['ms'] or die('fail');

	$c = mysql_connect('localhost', $user, $pw) or die('Unable to connect to MySQL');
	$s = mysql_select_db('winterclan') or die('Could not select database');

	$result = mysql_query("SELECT `member` FROM `forummembers` WHERE `member` = '$d'");
	$tableExists = mysql_num_rows($result) > 0;

	if(!$tableExists){
		echo('member was not found!');
	}else{
		mysql_query("UPDATE forummembers SET lastactive = '$t' WHERE member = '$d'");
		echo('updated lastactive');
	}

	mysql_close($c);
?>