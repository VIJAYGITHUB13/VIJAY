<?php
include "../../../script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "view":
		$query = mysql_query("SELECT jp.`display_name` AS plan, js.`display_name` AS speed, jf.`display_name` AS fup, jpf.`display_name` AS post_fup, GROUP_CONCAT(jtr.`display_name` SEPARATOR ', ') AS terms, GROUP_CONCAT(jt.`fare` SEPARATOR ', ') AS fares FROM `jos_tariff` jt, `jos_terms` jtr, `jos_tariff_struct` jts, `jos_plans` jp, `jos_speed` js, `jos_fups` jf, `jos_post_fups` jpf WHERE jt.`tariff_struct_id` = jts.`id` AND jt.`term_id` = jtr.`id` AND jts.`plan_id` = jp.`id` AND jts.`speed_id` =js.`id` AND jts.`fup_id` = jf.`id` AND jts.`post_fup_id` = jpf.`id` GROUP BY jp.`id` ORDER BY jp.`id`");

		print jsonEncode($query);
	break;
}
?>