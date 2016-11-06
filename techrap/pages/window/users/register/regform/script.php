<?php
include "../../../../../script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "addressinputs":
		$query_countries = mysql_query("SELECT `id`, `display_name` AS name FROM `jos_countries` ORDER BY `id`");
		$query_states = mysql_query("SELECT `id`, `country_id`, `display_name` AS name FROM `jos_states` ORDER BY `id`");
		$query_districts = mysql_query("SELECT `id`, `state_id`, `display_name` AS name FROM `jos_districts` ORDER BY `id`");
		
		print json_encode([json_decode(jsonEncode($query_countries)), json_decode(jsonEncode($query_states)), json_decode(jsonEncode($query_districts))]);
	break;
}
?>