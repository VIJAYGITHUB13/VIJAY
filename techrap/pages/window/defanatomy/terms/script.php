<?php
include "../../../../script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "view":
		$data = json_decode(file_get_contents("php://input"));

		$query = mysql_query("SELECT jt.`id`, jt.`name`, jt.`display_name`, jts.`term_id` AS freezed FROM `jos_terms` jt LEFT JOIN (SELECT `term_id` FROM `jos_tariff` WHERE `fare` != 0) AS jts ON jt.`id` = jts.`term_id` GROUP BY jt.`id` ORDER BY jts.`term_id` DESC, jt.`id`");

		print jsonEncode($query);
	break;

	case "update":
		$data = json_decode(file_get_contents("php://input"));

		$tdisplayname = trim($data->tdisplayname);
		$tname = str_replace([" ", "-"], ["_", "_"], strtolower($tdisplayname));

		$query = mysql_query("UPDATE `jos_terms` SET `name` = '".$tname."', `display_name` = '".$tdisplayname."' WHERE `id` = ".$data->tid);

		print $query;
	break;

	case "add":
		$data = json_decode(file_get_contents("php://input"));

		$tdisplayname = trim($data->tdisplayname);
		$tname = str_replace([" ", "-"], ["_", "_"], strtolower($tdisplayname));

		$query_jt = mysql_query("INSERT INTO `jos_terms`(`id`, `name`, `display_name`) VALUES (NULL, '".$tname."', '".$tdisplayname."')");
		$query_jtf = mysql_query("INSERT INTO `jos_tariff` (SELECT NULL, `tariff_struct_id`, ".mysql_insert_id().", 0 FROM `jos_tariff` WHERE 1 GROUP BY `tariff_struct_id` ORDER BY `tariff_struct_id` ASC)");

		print ($query_jt && $query_jtf);
	break;

	case "remove":
		$data = json_decode(file_get_contents("php://input"));
		
		$query_jtf = mysql_query("DELETE FROM `jos_tariff` WHERE `term_id` = ".$data->tid);
		$query_jt = mysql_query("DELETE FROM `jos_terms` WHERE `id` = ".$data->tid);
		
		print ($query_jt && $query_jtf);
	break;
}
?>