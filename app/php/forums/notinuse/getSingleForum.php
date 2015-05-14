<?PHP
	include '../sql.php';
	$d = $_POST['forum'] or die('no forum name was given');
	$p = new PDO('mysql:host=localhost; dbname=winterclan; charset=utf8', $user, $pw);
	$s = $p -> query('SELECT * FROM `_' . $d . '`');
	echo json_encode($s -> fetchAll(PDO::FETCH_ASSOC));
?>