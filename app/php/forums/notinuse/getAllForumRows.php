<?PHP
	include '../sql.php';
	$d = $_POST['forums'] or die('no forum name was given');
	$r = [];
	$p = new PDO('mysql:host=localhost; dbname=winterclan; charset=utf8', $user, $pw);

	foreach ($d as $t){
		$s = $p -> query('SELECT * FROM `_' . $t . '`');
		$r[$t] = $s -> fetchAll(PDO::FETCH_ASSOC);
	}
	echo json_encode($r);
?>