<?PHP
	include '../sql.php';
	
	$d = $_POST['name'] or die('no member name was given');
	$p = new PDO('mysql:host=localhost; dbname=winterclan; charset=utf8', $user, $pw);
	
	$s = $p -> query('SELECT * FROM `forumrecentactions` ORDER BY id DESC LIMIT 1');
	$a['recent'] = $s -> fetchAll(PDO::FETCH_ASSOC)[0];

	$s = $p -> query("SELECT * FROM `forummembers` WHERE member = '$d' LIMIT 1"); 
	$a['update'] = $s -> fetch(PDO::FETCH_ASSOC); 

	echo json_encode($a);
?>