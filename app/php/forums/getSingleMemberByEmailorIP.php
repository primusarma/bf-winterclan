<?PHP
	include '../sql.php';
	$d = $_POST['val'] or die('no type value was given');
	$t = $_POST['type'] or die('no type was given');
	$p = new PDO('mysql:host=localhost; dbname=winterclan; charset=utf8', $user, $pw);
	$s = $p -> prepare("SELECT * FROM forummembers WHERE $t = '$d' LIMIT 1"); 
	$s -> execute();
	$r = $s -> fetch(PDO::FETCH_ASSOC); 

	echo json_encode($r);
?>