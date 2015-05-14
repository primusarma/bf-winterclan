<?PHP
	include '../sql.php';
	//$d = $_POST['forums'] or die('no forum name was given'); //just so you know the website is requesting it
	
	function flattenArray(&$arr, &$dst){
		if(!isset($dst) || !is_array($dst)){
			$dst = array();
		}

		if(!is_array($arr)){
			$dst[] = $arr;
		}else{
			foreach($arr as &$subject){
				flattenArray($subject, $dst);
			}
		}
	}

	$a = [];
	$c = [];
	$p = new PDO('mysql:host=localhost; dbname=winterclan; charset=utf8', $user, $pw);
	$s = $p -> query("SHOW TABLES LIKE '\_%'"); //anything that starts with an underscore - use \ to escape the wildcard "_"

	while($r = $s -> fetchAll(PDO::FETCH_NUM)){
		$c = $r;
	}

	flattenArray($c, $a);

	//second part

	$c = [];
	$p = new PDO('mysql:host=localhost; dbname=winterclan; charset=utf8', $user, $pw);

	foreach ($a as $t){
		$u = $p -> query('SELECT * FROM `' . $t . '`');
		$c[$t] = $u -> fetchAll(PDO::FETCH_ASSOC);
	}

	echo json_encode($c);
?>