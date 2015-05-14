<?PHP
	include '../sql.php';
	$p = new PDO('mysql:host=localhost; dbname=winterclan; charset=utf8', $user, $pw);
	$s = $p -> query('SELECT * FROM `forumrecentactions` ORDER BY id DESC LIMIT 1');
	echo json_encode($s -> fetchAll(PDO::FETCH_ASSOC));
?>