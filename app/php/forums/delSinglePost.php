<?PHP
	include '../sql.php';
	$f = '_' . $_POST['forum'] or die('no forum name was given');
	$i = $_POST['id'] or die('no id was given');
	$a = $_POST['author'] or die('no author was given');
	$b = $_POST['deletor'] or die('no author was given');
	$p = new PDO('mysql:host=localhost; dbname=winterclan; charset=utf8', $user, $pw);
	
	$sql = 'DELETE FROM `' . $f . '` WHERE `id` = :id AND `author` = :au LIMIT 1';
	$s = $p -> prepare($sql);

	$s -> execute(array(':id' => $i, ':au' => $a));
	$p -> query('ALTER TABLE `' . $f . '` ADD INDEX (`id`)'); //this is needed to reset the insert order after a delete, otherwise if you delete a row in the middle of a table, all new posts will happen immediately after the deleted post, and not at the end of the table

	if($a === $b){
		$c = mysql_connect('localhost', $user, $pw) or die('Unable to connect to MySQL');
		$s = mysql_select_db('winterclan') or die('Could not select database');
		
		$c = mysql_query("UPDATE forummembers SET postcount = postcount - 1 WHERE member = '$a'");
		$n = mysql_query("SELECT postcount, lastpost, lastpostdate FROM forummembers WHERE member = '$a'");
		$v = mysql_fetch_object($n);
		mysql_close($c);
		echo json_encode($v);
	}else{ //if the deletor is not the author - in case you don't want to modify the postcount
		$c = mysql_connect('localhost', $user, $pw) or die('Unable to connect to MySQL');
		$s = mysql_select_db('winterclan') or die('Could not select database');
		
		$c = mysql_query("UPDATE forummembers SET postcount = postcount - 1 WHERE member = '$a'");
		$n = mysql_query("SELECT postcount, lastpost, lastpostdate FROM forummembers WHERE member = '$a'");
		$v = mysql_fetch_object($n);
		mysql_close($c);
		echo json_encode('admin action');
	}
?>