<?php
include "../../../script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "changepassword":
		$data = json_decode(file_get_contents("php://input"));
		
		$myid = trim($data->myid);
		$password = trim($data->password);

		$update_ju = mysql_query("UPDATE `jos_users` SET `tpassword` = '".$password."', `password` = '".md5($password)."' WHERE `id` = ".$myid);
		
		if($update_ju) {
			print "SUCCESS";
		} else {
			print "ERROR_DB";
		}
	break;
}
?>