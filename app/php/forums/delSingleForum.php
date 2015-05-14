<?PHP
	include '../sql.php';
	
	$f = $_POST['forum'] or die('no forum name was given');
	$p = new PDO('mysql:host=localhost; dbname=winterclan; charset=utf8', $user, $pw);

	try{
		$exists = $p -> query('SELECT 1 FROM `_' . $f . '` LIMIT 1');
	}catch(Exception $e){
		$exists = false;
	}

	if($exists != false){
		$exists = true;
		$s = $p -> query('DROP TABLE IF EXISTS `_' . $f . '`');
		echo('Dropped table. ');
	}else{
		echo('Table not found. ');
	}

	try{
		$q = $p -> query("SELECT 1 FROM `forumlist` WHERE forum = '$f' LIMIT 1");
		$exists2 = $q -> fetch(PDO::FETCH_ASSOC);
	}catch(Exception $e){
		$exists2 = false;
	}

	if($exists2 != false){
		$exists2 = true;
		$s = $p -> query("DELETE FROM `forumlist` WHERE forum = '$f' LIMIT 1");
		echo('Removed forum from forumlist.');
	}else{
		echo('Forum not found in forumlist.');
	}
?>