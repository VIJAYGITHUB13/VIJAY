<?php
include "../../../../script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "view":
		$query = mysql_query("SELECT ts.`id` AS ts_id, p.`id` AS pid, p.`display_name` AS pdname, s.`id` AS sid, s.`display_name` AS sdname, f.`id` AS fid, f.`display_name` AS fdname, pf.`id` AS pfid, pf.`display_name` AS pfdname FROM `jos_tariff_struct` ts, `jos_plans` p, `jos_speed` s, `jos_fups` f, `jos_post_fups` pf WHERE ts.`plan_id` = p.`id` AND ts.`speed_id` = s.`id` AND ts.`fup_id` = f.`id` AND ts.`post_fup_id` = pf.`id` GROUP BY p.`id` ORDER BY p.`id`");
		$plans = mysql_query("SELECT `id`, `name`, `display_name` FROM `jos_plans` ORDER BY `id`");
		$speed = mysql_query("SELECT `id`, `name`, `display_name` FROM `jos_speed` ORDER BY `id`");
		$fups = mysql_query("SELECT `id`, `name`, `display_name` FROM `jos_fups` ORDER BY `id`");
		$post_fups = mysql_query("SELECT `id`, `name`, `display_name` FROM `jos_post_fups` ORDER BY `id`");
		
		print json_encode([
			json_decode(jsonEncode($query)),
			json_decode(jsonEncode($plans)),
			json_decode(jsonEncode($speed)),
			json_decode(jsonEncode($fups)),
			json_decode(jsonEncode($post_fups))
		]);
	break;

	case "updatenadd":
		$data = json_decode(file_get_contents("php://input"));
		
		if($data->ts_id) {
			$query = mysql_query("UPDATE `jos_tariff_struct` SET `plan_id` = ".$data->pid.", `speed_id` = ".$data->sid.", `fup_id` = ".$data->fid.", `post_fup_id` = ".$data->pfid." WHERE `id` = ".$data->ts_id);
		} else {
			$query = mysql_query("INSERT INTO `jos_tariff_struct`(`id`, `plan_id`, `speed_id`, `fup_id`, `post_fup_id`) VALUES (NULL, ".$data->pid.", ".$data->sid.", ".$data->fid.", ".$data->pfid.")");
		}
		
		print $query;
	break;

	case "remove":
		$data = json_decode(file_get_contents("php://input"));
		
		$query_tariff = mysql_query("DELETE FROM `jos_tariff` WHERE `tariff_struct_id` = ".$data->tsid);
		$query_tariff_struct = mysql_query("DELETE FROM `jos_tariff_struct` WHERE `id` = ".$data->tsid);
		
		print ($query_tariff && $query_tariff_struct);
	break;
}
?>