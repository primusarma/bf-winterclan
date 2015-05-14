<?PHP
	include 'sql.php';
	$p = $_POST['data'] or die('no spreadsheet data was given');
	$c = mysql_connect('localhost', $user, $pw) or die('Unable to connect to MySQL');
	$s = mysql_select_db('winterclan') or die('Could not select database');

	mysql_query("INSERT INTO googlespreadsheet (id, data) VALUES('NULL', '$p')") or die(mysql_error());
	mysql_query("DELETE FROM googlespreadsheet WHERE id < (select t.id FROM (SELECT * FROM googlespreadsheet) as t ORDER BY id DESC LIMIT 2,1);") or die(mysql_error());

	echo('record was successfully entered into db');
	mysql_close($c);
?>