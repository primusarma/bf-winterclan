<?PHP
	include '../sql.php';
	$d = $_POST['forum'] or die('no forum name was given');

	$result = mysql_query('SHOW TABLES LIKE ' . '`_' . $d . '`');
	$tableExists = mysql_num_rows($result) > 0;

	if(!$tableExists){
		try{
			$db = new PDO('mysql:host=localhost; dbname=winterclan; charset=utf8', $user, $pw);
			$db -> setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );//Error Handling
			$sql = 'CREATE TABLE ' . '`_' . $d . '`' . ' (
			id INT( 11 ) AUTO_INCREMENT PRIMARY KEY,
			author VARCHAR( 50 ) NOT NULL,
			dated BIGINT( 20 ) NOT NULL, 
			bodytext TEXT( 25000 ) NOT NULL, 
			titletext VARCHAR( 150 ) NOT NULL);';
			$db -> exec($sql);
			echo 'success';

		}catch(PDOException $e){
			echo $e -> getMessage();//Remove or change message in production code
		}
	}else{
		echo 'exists';
	}
?>