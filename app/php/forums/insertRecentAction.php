<?PHP
	include '../sql.php';
	$m = $_POST['member'] or die('no member given');
	$a = $_POST['action'] or die('no action given');
	$f = $_POST['forum'] or die('no forum given');
	$g = $_POST['subforum'] or die('no subforum given');
	$n = $_POST['subforumname'] or die('no subforumname given');
	$t = $_POST['timestamp'] or die('no timestamp given');
	$p = new PDO('mysql:host=localhost; dbname=winterclan; charset=utf8', $user, $pw);
	
	$sql = 'INSERT INTO `forumrecentactions` (`member`, `action`, `forum`, `subforum`, `subforumname`, `timestamp`) VALUES (:member, :action, :forum, :subforum, :subforumname, :timestamp)';
	$q = $p -> prepare($sql);
	$q -> execute(array(':member' => $m, ':action' => $a, ':forum' => $f, ':subforum' => $g, ':subforumname' => $n, ':timestamp' => $t));
	
	$s = $p -> query('DELETE FROM `forumrecentactions` WHERE `id` < (select t.id FROM (SELECT * FROM `forumrecentactions`) as t ORDER BY id DESC LIMIT 2,1);') or die(mysql_error());

	//echo json_encode($s -> fetchAll(PDO::FETCH_ASSOC));

	echo 'inserted recent action';
?>