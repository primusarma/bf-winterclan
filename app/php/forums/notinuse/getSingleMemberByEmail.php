<?PHP
	include '../sql.php';
	$d = $_POST['email'] or die('no forum email was given');
	$p = new PDO('mysql:host=localhost; dbname=winterclan; charset=utf8', $user, $pw);
	$s = $p -> prepare("SELECT * FROM forummembers WHERE email = '$d' LIMIT 1"); 
	$s -> execute();
	$r = $s -> fetch(PDO::FETCH_ASSOC); 

	echo json_encode($r);
?>