<?PHP
	include '../sql.php';
	$r = [];
	$p = new PDO('mysql:host=localhost; dbname=winterclan; charset=utf8', $user, $pw);

	$s = $p -> query('SELECT `member`, `postcount` FROM `forummembers`');
	$r[$t] = $s -> fetchAll(PDO::FETCH_ASSOC);
	echo json_encode($r);
?>