<?php
include "../../../../script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "view":
		$data = json_decode(file_get_contents("php://input"));
		
		$query = mysql_query("SELECT jp.`id`, jp.`name`, jp.`display_name`, jts.`plan_id` AS freezed FROM `jos_plans` jp LEFT JOIN (SELECT `plan_id` FROM `jos_tariff_struct`) AS jts ON jp.`id` = jts.`plan_id` GROUP BY jp.`id` ORDER BY jts.`plan_id` DESC, jp.`id`");

		print jsonEncode($query);
	break;

	case "update":
		$data = json_decode(file_get_contents("php://input"));

		$pdisplayname = trim($data->pdisplayname);
		$pname = str_replace([" ", "-"], ["_", "_"], strtolower($pdisplayname));
		
		$query = mysql_query("UPDATE `jos_plans` SET `name` = '".$pname."', `display_name` = '".$pdisplayname."' WHERE `id` = ".$data->pid);

		print $query;
	break;

	case "add":
		$data = json_decode(file_get_contents("php://input"));

		$pdisplayname = trim($data->pdisplayname);
		$pname = str_replace([" ", "-"], ["_", "_"], strtolower($pdisplayname));
		
		$query = mysql_query("INSERT INTO `jos_plans`(`id`, `name`, `display_name`) VALUES (NULL, '".$pname."', '".$pdisplayname."')");

		print $query;
	break;

	case "remove":
		$data = json_decode(file_get_contents("php://input"));

		$query = mysql_query("DELETE FROM `jos_plans` WHERE `id` = ".$data->pid);

		print $query;
	break;
}
?>