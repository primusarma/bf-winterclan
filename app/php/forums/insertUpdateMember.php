<?PHP
	include '../sql.php';
	$d = $_POST['name'] or die('fail');
	$e = $_POST['email'] or $d = 'null';
	$t = $_POST['ms'] or die('fail');
	$p = $_POST['ip'] or die('fail');

	$c = mysql_connect('localhost', $user, $pw) or die('Unable to connect to MySQL');
	$s = mysql_select_db('winterclan') or die('Could not select database');

	$result = mysql_query("SELECT `member` FROM `forummembers` WHERE `member` = '$d'");
	$tableExists = mysql_num_rows($result) > 0;

	if(!$tableExists){
		mysql_query("INSERT INTO forummembers (id, member, email, ipaddress, lastactive, logincount, lastlogin, postcount, lastpost, lastpostdate) VALUES('NULL', '$d', '$e', '$p', '$t', '1', '$t', '0', 'null', 'null')") or die(mysql_error());
		echo('record was successfully entered into db');
	}else{
		mysql_query("UPDATE forummembers SET logincount = logincount + 1, ipaddress = '$p', lastactive = '$t', lastlogin = '$t' WHERE member = '$d'");
		echo('updated login count');
	}

	mysql_close($c);
?>