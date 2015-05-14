<?PHP
	include '../sql.php';
	$d = $_POST['name'] or die('no forum name was given');
	$p = new PDO('mysql:host=localhost; dbname=winterclan; charset=utf8', $user, $pw);
	$s = $p -> prepare("SELECT * FROM forummembers WHERE member = '$d' LIMIT 1"); 
	$s -> execute();
	$r = $s -> fetch(PDO::FETCH_ASSOC); 

	echo json_encode($r);
?>