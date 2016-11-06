<?php
include "../../../../script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "view":
		$query = mysql_query("SELECT jp.`display_name` AS plan, GROUP_CONCAT(jtr.`display_name` SEPARATOR ', ') AS terms, GROUP_CONCAT(jt.`id` SEPARATOR ', ') AS tariff_ids, GROUP_CONCAT(jt.`fare` SEPARATOR ', ') AS fares FROM `jos_tariff` jt, `jos_terms` jtr, `jos_tariff_struct` jts, `jos_plans` jp WHERE jt.`term_id` = jtr.`id` AND jt.`tariff_struct_id` = jts.`id` AND jts.`plan_id` = jp.`id` GROUP BY jp.`id` ORDER BY jp.`id`");

		print jsonEncode($query);
	break;

	case "update":
		$data = json_decode(file_get_contents("php://input"));

		$q_update = 0;
		$counter = 0;
		foreach($data->fares as $key => $val) {
			$query = mysql_query("UPDATE `jos_tariff` SET `fare` = ".$val." WHERE `id` = ".$key);
			$counter++;

			if($query) {
				$q_update++;
			}
		}
		
		print ($counter == $q_update);
	break;
}
?>