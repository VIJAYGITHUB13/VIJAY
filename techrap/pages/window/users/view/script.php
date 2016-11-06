<?php
include "../../../../script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "ucategories":
		$query = mysql_query("SELECT `id`, `display_name` AS name FROM `jos_user_categories` ORDER BY `id`");
		
		print jsonEncode($query);
	break;

	case "view":
		$data = json_decode(file_get_contents("php://input"));

		$ucategory = trim($data->ucategory);
		$uname = trim($data->uname);
		$fdate = trim($data->fdate) ? date("Y-m-d", strtotime(trim($data->fdate))) : "";
		$tdate = trim($data->tdate) ? date("Y-m-d", strtotime(trim($data->tdate))) : "";

		$ucategory_cond = "";
		$uname_cond = "";
		$date_cond = "";

		$ucategory ? $ucategory_cond = ("AND ju.`user_cat_id` = '".$ucategory."'") : $ucategory_cond = "";
		$uname ? $uname_cond = ("AND ju.`display_name` LIKE '%".$uname."%'") : $uname_cond = "";
		($fdate && $tdate) ? $date_cond = ("AND ju.`created_on` BETWEEN '".$fdate."' AND '".$tdate."'") : $date_cond = "";

		$cond = trim($ucategory_cond." ".$uname_cond." ".$date_cond);
		
		// MySQL: STR_TO_DATE: DD-MM-YYYY => YYYY-MM-DD
		// MySQL: DATE_FORMAT: YYYY-MM-DD => DD-MM-YYYY
		if($cond) {
			$query = mysql_query("SELECT ju.`id`, ju.`username`, ju_cat.`display_name` AS ucategory, ju.`display_name` as name, juc.`mobile_no`, juc.`email_id`, DATE_FORMAT(ju.`created_on`, '%d-%m-%Y %h:%i %p') AS created_on FROM `jos_users` ju, `jos_user_contact` juc, `jos_user_categories` ju_cat WHERE ju.`id` = juc.`user_id` ".$cond." AND ju.`user_cat_id` = ju_cat.`id` ORDER BY ju.`display_name`");

			print jsonEncode($query);
		}
	break;
}
?>