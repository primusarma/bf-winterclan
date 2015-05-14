<?PHP
	include 'sql.php';
	$c = mysql_connect('localhost', $user, $pw) or die('Unable to connect to MySQL');
	$s = mysql_select_db('winterclan') or die('Could not select database');
	$d = mysql_query('SELECT data FROM psnmembers ORDER BY id DESC LIMIT 1') or die(mysql_error());
	
	while($r = mysql_fetch_assoc($d)){echo json_encode($r{'data'});}
	mysql_close($c);
?>