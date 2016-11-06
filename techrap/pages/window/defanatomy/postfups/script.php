<?php
include "../../../../script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "view":
		$data = json_decode(file_get_contents("php://input"));

		$query = mysql_query("SELECT jpf.`id`, jpf.`name`, jpf.`display_name`, jts.`post_fup_id` AS freezed FROM `jos_post_fups` jpf LEFT JOIN (SELECT `post_fup_id` FROM `jos_tariff_struct`) AS jts ON jpf.`id` = jts.`post_fup_id` GROUP BY jpf.`id` ORDER BY jts.`post_fup_id` DESC, jpf.`id`");

		print jsonEncode($query);
	break;

	case "update":
		$data = json_decode(file_get_contents("php://input"));

		$pfdisplayname = trim($data->pfdisplayname);
		$pfname = str_replace([" ", "-"], ["_", "_"], strtolower($pfdisplayname));

		$query = mysql_query("UPDATE `jos_post_fups` SET `name` = '".$pfname."', `display_name` = '".$pfdisplayname."' WHERE `id` = ".$data->pfid);

		print $query;
	break;

	case "add":
		$data = json_decode(file_get_contents("php://input"));

		$pfdisplayname = trim($data->pfdisplayname);
		$pfname = str_replace([" ", "-"], ["_", "_"], strtolower($pfdisplayname));
		
		$query = mysql_query("INSERT INTO `jos_post_fups`(`id`, `name`, `display_name`) VALUES (NULL, '".$pfname."', '".$pfdisplayname."')");

		print $query;
	break;

	case "remove":
		$data = json_decode(file_get_contents("php://input"));

		$query = mysql_query("DELETE FROM `jos_post_fups` WHERE `id` = ".$data->pfid);

		print "DELETE FROM `jos_post_fups` WHERE `id` = ".$data->pfid;
	break;
}
?>