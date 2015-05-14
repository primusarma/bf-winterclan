<?PHP
	include '../sql.php';

	$d = $_POST['member'] or die('no author was given');
	$i = $_POST['ip'] or die('no author was given');

	$c = mysql_connect('localhost', $user, $pw) or die('Unable to connect to MySQL');
	$s = mysql_select_db('winterclan') or die('Could not select database');

	//Make lastactive smaller by one digit - you can see when they last logged in by multiplying by 10 and it will force them to log in again
	$v = mysql_query("UPDATE forummembers SET lastactive = lastactive - 1000000000000 WHERE member = '$d' AND ipaddress = '$i'");
	mysql_close($c);
	echo json_encode($v);
?>