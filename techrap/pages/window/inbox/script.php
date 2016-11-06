<?php
include "../../../script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "request_stats":
		$data = json_decode(file_get_contents("php://input"));
		$mycategory = $data->mycategory;
		$myid = $data->myid;

		switch($mycategory) {
			case "1":
			case "2":
				$query = mysql_query("SELECT jrs.`id`, jrs.`display_name`, jbc.`type` AS `class_name`, COUNT(jr.`id`) AS status_count FROM `jos_request_statuses` jrs LEFT JOIN (SELECT `id`, `status` FROM `jos_requests`) jr ON jrs.`id` = jr.`status` LEFT JOIN (SELECT `id`, `type` FROM `jos_bootstrap_css`) jbc ON jrs.`css_id` = jbc.`id` WHERE jrs.`id` IN (1, 6, 7, 8) GROUP BY (jrs.`id`) ORDER BY (jrs.`id`)");

				$query_rep = mysql_query("SELECT '-1' AS id, 'Repository' AS display_name, jbc.`type` AS `class_name`, COUNT(jr.`id`) AS status_count FROM `jos_request_statuses` jrs LEFT JOIN (SELECT `id`, `status` FROM `jos_requests`) jr ON jrs.`id` = jr.`status`, (SELECT `id`, `type` FROM `jos_bootstrap_css` WHERE `id` = 2) jbc ORDER BY (jrs.`id`)");

				print json_encode([json_decode(jsonEncode($query)), json_decode(jsonEncode($query_rep))]);
			break;

			case "3":
				$query = mysql_query("SELECT jrs.`id`, jrs.`display_name`, jbc.`type` AS `class_name`, COUNT(jr.`id`) AS status_count FROM `jos_request_statuses` jrs LEFT JOIN (SELECT jr.`id`, jr.`status` FROM `jos_requests` jr, `jos_request_details` jrd WHERE jrd.`assigned_to` = ".$myid." AND jrd.`status` = 2 AND jrd.`request_id` = jr.`id`) jr ON jrs.`id` = jr.`status` LEFT JOIN (SELECT `id`, `type` FROM `jos_bootstrap_css`) jbc ON jrs.`css_id` = jbc.`id` WHERE jrs.`id` NOT IN (1, 6, 7, 8) GROUP BY (jrs.`id`) ORDER BY (jrs.`id`)");
				print json_encode([json_decode(jsonEncode($query))]);
			break;
		}
	break;

	case "user_details":
		$query = mysql_query("SELECT `id` AS userid, `display_name` AS name  FROM `jos_users` WHERE `user_cat_id` = 3 ORDER BY `display_name`");

		print jsonEncode($query);
	break;

	case "view":
		$data = json_decode(file_get_contents("php://input"));

		$actiontype = trim($data->actiontype);
		$input = $data->input;
		$mycategory = $data->mycategory;
		$myid = $data->myid;

		switch($actiontype) {
			case "inboxMenu":
				if($mycategory == "1" || $mycategory == "2") {
					if($input != "-1") {
						$query = mysql_query("SELECT jr.`status` AS sid, jrs.`display_name` AS status, jbc.`container_bgcolor` AS `color_entity`, jr.`id` AS rid, jr.`name` AS request_id, ju.`display_name` AS name, juc.`mobile_no`, juc.`email_id`, DATE_FORMAT(jr.`created_on`, '%d-%m-%Y %h:%i %p') AS created_on FROM `jos_requests` jr, `jos_request_statuses` jrs LEFT JOIN (SELECT `id`, `container_bgcolor` FROM `jos_bootstrap_css`) jbc ON jrs.`css_id` = jbc.`id`, `jos_users` ju, `jos_user_contact` juc WHERE jr.`status` = ".$input." AND jr.`status` = jrs.`id` AND jr.`user_id` = ju.`id` AND ju.`id` = juc.`user_id` ORDER BY jr.`created_on` DESC");
					} else {
						$query = mysql_query("SELECT jr.`status` AS sid, jrs.`display_name` AS status, jbc.`container_bgcolor` AS `color_entity`, jr.`id` AS rid, jr.`name` AS request_id, ju.`display_name` AS name, juc.`mobile_no`, juc.`email_id`, DATE_FORMAT(jr.`created_on`, '%d-%m-%Y %h:%i %p') AS created_on FROM `jos_requests` jr, `jos_request_statuses` jrs, (SELECT `id`, `container_bgcolor` FROM `jos_bootstrap_css` WHERE `id` = 2) jbc, `jos_users` ju, `jos_user_contact` juc WHERE jr.`status` = jrs.`id` AND jr.`user_id` = ju.`id` AND ju.`id` = juc.`user_id` ORDER BY jr.`created_on` DESC");
					}
				} else {
					$query = mysql_query("SELECT jr.`status` AS sid, jrs.`display_name` AS status, jbc.`container_bgcolor` AS `color_entity`, jr.`id` AS rid, jr.`name` AS request_id, ju.`display_name` AS name, juc.`mobile_no`, juc.`email_id`, DATE_FORMAT(jr.`created_on`, '%d-%m-%Y %h:%i %p') AS created_on FROM `jos_requests` jr, `jos_request_details` jrd, `jos_request_statuses` jrs LEFT JOIN (SELECT `id`, `container_bgcolor` FROM `jos_bootstrap_css`) jbc ON jrs.`css_id` = jbc.`id`, `jos_users` ju, `jos_user_contact` juc WHERE jrd.`status` = 2 AND jrd.`assigned_to` = ".$myid." AND jrd.`request_id` = jr.`id` AND jr.`status` = ".$input." AND jr.`status` = jrs.`id` AND jr.`user_id` = ju.`id` AND ju.`id` = juc.`user_id` ORDER BY jr.`created_on` DESC");
				}

				print jsonEncode($query);
			break;

			case "inboxRequest":
				$query = mysql_query("SELECT ju.`display_name` AS commented_by, juc.`id` AS ucat_id, juc.`display_name` AS ucat_name, jrd.`comment`, DATE_FORMAT(jrd.`commented_on`, '%d-%m-%Y %h:%i %p') AS commented_on FROM `jos_request_details` jrd LEFT JOIN (SELECT `id`, `display_name` FROM `jos_users`) ju_asnd ON ju_asnd.`id` = jrd.`assigned_to`, `jos_requests` jr, `jos_request_statuses` jrs, `jos_users` ju, `jos_user_categories` juc WHERE jrd.`request_id` = jr.`id` AND jr.`id` = ".$input." AND jrd.`status` = jrs.`id` AND jrd.`user_id` = ju.`id` AND ju.`user_cat_id` = juc.`id` ORDER BY jrd.`commented_on` ASC");

				print jsonEncode($query);
			break;
		}
	break;

	case "postcomment":
		$data = json_decode(file_get_contents("php://input"));

		$comment = trim($data->comment);
		$rid = $data->rid;
		$sid = $data->sid;
		$myid = $data->myid;

		$insert_jrd = mysql_query("INSERT INTO `jos_request_details`(`id`, `request_id`, `status`, `user_id`, `comment`, `commented_on`) VALUES (NULL, ".$rid.", ".$sid.", ".$myid.", '".$comment."', NOW())");

		if($insert_jrd) {
			print "SUCCESS";
		} else {
			print "ERROR_DB";
		}
	break;

	case "statuschange":
		$data = json_decode(file_get_contents("php://input"));

		$myid = $data->myid;
		$assigninputs = trim($data->assigninputs);
		$rid = $data->rid;
		$sid = $data->sid;
		$to_status = $data->to_status;

		$update_jr = mysql_query("UPDATE `jos_requests` SET `status` = ".$to_status." WHERE `id` = ".$rid);
		switch($sid) {
			case "1":
				$userid = $data->userid;
				$insert_jrd = mysql_query("INSERT INTO `jos_request_details`(`id`, `request_id`, `status`, `user_id`, `comment`, `commented_on`, `assigned_to`, `assigned_on`) VALUES (NULL, ".$rid.", ".$to_status.", ".$myid.", '".$assigninputs."', NOW(), ".$userid.", NOW())");
			break;

			case "2":
				$schedule_on = $data->schedule_on;
				$insert_jrd = mysql_query("INSERT INTO `jos_request_details`(`id`, `request_id`, `status`, `user_id`, `comment`, `commented_on`, `scheduled_on`) VALUES (NULL, ".$rid.", ".$to_status.", ".$myid.", '".$assigninputs."', NOW(), '".$schedule_on."')");
			break;

			case "4":
				$macaddress = $data->macaddress;
				$insert_jrd = mysql_query("INSERT INTO `jos_request_details`(`id`, `request_id`, `status`, `user_id`, `comment`, `commented_on`, `mac_address`) VALUES (NULL, ".$rid.", ".$to_status.", ".$myid.", '".$assigninputs."', NOW(), '".$macaddress."')");
			break;

			default:
				$insert_jrd = mysql_query("INSERT INTO `jos_request_details`(`id`, `request_id`, `status`, `user_id`, `comment`, `commented_on`) VALUES (NULL, ".$rid.", ".$to_status.", ".$myid.", '".$assigninputs."', NOW())");
			break;
		}

		if($update_jr && $insert_jrd) {
			print "SUCCESS";
		} else {
			print "ERROR_DB";
		}
	break;
}
?>