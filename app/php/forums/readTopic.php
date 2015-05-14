<?PHP
	include '../sql.php';
	$r = [];
	$n = $_POST['name'] or die('no name was given');
	$t = '_' . $_POST['subforum'] or die('no topic was given');
	$p = new PDO('mysql:host=localhost; dbname=winterclan; charset=utf8', $user, $pw);

	$s = $p -> query("SELECT `unreadtopics` FROM `forummembers` WHERE member='" . $n . "' LIMIT 1");
	$s = $s -> fetchAll(PDO::FETCH_ASSOC)[0]['unreadtopics'];

	$unread = str_replace($t . ',','', $s);

	$s = $p -> query("UPDATE `forummembers` SET `unreadtopics` = '" . $unread . "' WHERE member='" . $n . "'");

	echo 'success: ' . $t . ' ' . $n . ' ' . $unread;
?>