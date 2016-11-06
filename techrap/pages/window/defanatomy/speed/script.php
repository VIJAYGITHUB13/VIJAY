<?php
include "../../../../script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "view":
		$data = json_decode(file_get_contents("php://input"));
		
		$query = mysql_query("SELECT js.`id`, js.`name`, js.`display_name`, jts.`speed_id` AS freezed FROM `jos_speed` js LEFT JOIN (SELECT `speed_id` FROM `jos_tariff_struct`) AS jts ON js.`id` = jts.`speed_id` GROUP BY js.`id` ORDER BY jts.`speed_id` DESC, js.`id`");

		print jsonEncode($query);
	break;

	case "update":
		$data = json_decode(file_get_contents("php://input"));

		$sdisplayname = trim($data->sdisplayname);
		$sname = str_replace([" ", "-"], ["_", "_"], strtolower($sdisplayname));
		
		$query = mysql_query("UPDATE `jos_speed` SET `name` = '".$sname."', `display_name` = '".$sdisplayname."' WHERE `id` = ".$data->sid);

		print $query;
	break;

	case "add":
		$data = json_decode(file_get_contents("php://input"));

		$sdisplayname = trim($data->sdisplayname);
		$sname = str_replace([" ", "-"], ["_", "_"], strtolower($sdisplayname));

		$query = mysql_query("INSERT INTO `jos_speed`(`id`, `name`, `display_name`) VALUES (NULL, '".$sname."', '".$sdisplayname."')");

		print $query;
	break;

	case "remove":
		$data = json_decode(file_get_contents("php://input"));

		$query = mysql_query("DELETE FROM `jos_speed` WHERE `id` = ".$data->sid);

		print $query;
	break;
}
?>