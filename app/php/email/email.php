<?PHP
	$m = 'New post by: Freeseus' . '\n' . 'This is a test message';
	$m = wordwrap($m, 70); //use wordwrap() if lines are longer than 70 characters

	mail('bfwinterland@gmail.com', 'Winter Forums', $m); //send
?>