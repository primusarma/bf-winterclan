<?PHP
	include '../sql.php';
	$a = new PDO('mysql:host=localhost; dbname=winterclan; charset=utf8', $user, $pw);

	$d = [];
	$b = $a -> query('SELECT `member`, `lastactive`, `logincount`, `postcount`, `unreadtopics` FROM `forummembers`');
	$d = $b -> fetchAll(PDO::FETCH_ASSOC);

	echo json_encode($d);
?>