<?php
include "../../../../script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "view":
		$data = json_decode(file_get_contents("php://input"));

		$query = mysql_query("SELECT jf.`id`, jf.`name`, jf.`display_name`, jts.`fup_id` AS freezed FROM `jos_fups` jf LEFT JOIN (SELECT `fup_id` FROM `jos_tariff_struct`) AS jts ON jf.`id` = jts.`fup_id` GROUP BY jf.`id` ORDER BY jts.`fup_id` DESC, jf.`id`");

		print jsonEncode($query);
	break;

	case "update":
		$data = json_decode(file_get_contents("php://input"));

		$fdisplayname = trim($data->fdisplayname);
		$fname = str_replace([" ", "-"], ["_", "_"], strtolower($fdisplayname));

		$query = mysql_query("UPDATE `jos_fups` SET `name` = '".$fname."', `display_name` = '".$fdisplayname."' WHERE `id` = ".$data->fid);

		print $query;
	break;

	case "add":
		$data = json_decode(file_get_contents("php://input"));

		$fdisplayname = trim($data->fdisplayname);
		$fname = str_replace([" ", "-"], ["_", "_"], strtolower($fdisplayname));

		$query = mysql_query("INSERT INTO `jos_fups`(`id`, `name`, `display_name`) VALUES (NULL, '".$fname."', '".$fdisplayname."')");

		print $query;
	break;

	case "remove":
		$data = json_decode(file_get_contents("php://input"));

		$query = mysql_query("DELETE FROM `jos_fups` WHERE `id` = ".$data->fid);

		print $query;
	break;
}
?>