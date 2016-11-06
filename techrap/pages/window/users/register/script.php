<?php
include "../../../../script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "ucategories":
		$query = mysql_query("SELECT `id`, `display_name` AS name FROM `jos_user_categories` ORDER BY `id`");
		
		print jsonEncode($query);
	break;
}
?>