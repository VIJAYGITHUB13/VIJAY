<?php
include "../../script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "app_details":
		$query = mysql_query("SELECT `display_name` AS app_name, `acronym`, `version` AS app_version FROM `jos_app` WHERE `id` = 1");
		
		print jsonEncode($query);
	break;

	case "menus":
		$data = json_decode(file_get_contents("php://input"));

		$query = mysql_query("SELECT jm.`id`, jm.`parent_id`, jm.`display_name`, jm.`path`, jm.`rwd` FROM `jos_menus` jm, `jos_menus_ucategories` jmc WHERE jm.`envi` = 1 AND jmc.`user_cat_id` = ".$data->ucategory." AND jm.`id` = jmc.`menu_id` GROUP BY jm.`id` ORDER BY jm.`display_order` ASC");

		// Ref: http://stackoverflow.com/questions/4452472/category-hierarchy-php-mysql
		// Ref: http://blog.ideashower.com/post/15147134343/create-a-parent-child-array-structure-in-one-pass
		$refs = array();
		$list = array();

		while($data = @mysql_fetch_assoc($query)) {
			$thisref = &$refs[ $data["id"] ];

			$thisref["parent_id"] = $data["parent_id"];
			$thisref["display_name"] = $data["display_name"];
			$thisref["path"] = $data["path"];
			$thisref["rwd"] = $data["rwd"];

			if($data["parent_id"] == 0) {
				$list[] = &$thisref;
			} else {
				$refs[ $data["parent_id"] ]["subMenusAr"][] = &$thisref;
			}
		}

		print json_encode($list);
	break;

	case "myprofile":
		$data = json_decode(file_get_contents("php://input"));

		$myid = trim($data->myid);

		$query = mysql_query("SELECT ju.`user_cat_id` AS ngUCategoryMdl, jupd.`first_name` AS ngFNameMdl, jupd.`last_name` AS ngLNameMdl, jupd.`gender` AS ngGenderMdl, jupd.`dob` AS ngDOBMdl, jupd.`place_of_birth` AS ngPOBMdl, jupd.`marital_status` AS ngMaritalStatusMdl, juc.`mobile_no` AS ngMobileNoMdl, juc.`alt_mobile_no` AS ngAltMobileNoMdl, juc.`email_id` AS ngEmailIDMdl, juc.`alt_email_id` AS ngAltEmailIDMdl, juc.`present_add_line1` AS ngPresentAddLine1Mdl, juc.`present_add_line2` AS ngPresentAddLine2Mdl, juc.`present_add_landmark` AS ngPresentAddLandmarkMdl, juc.`present_add_country_id` AS ngPresentAddCountryMdl, juc.`present_add_state_id` AS ngPresentAddStateMdl, juc.`present_add_district_id` AS ngPresentAddDistrictMdl, juc.`present_add_pincode` AS ngPresentAddPincodeMdl, juc.`permanent_add_line1` AS ngPermanentAddLine1Mdl, juc.`permanent_add_line2` AS ngPermanentAddLine2Mdl, juc.`permanent_add_landmark` AS ngPermanentAddLandmarkMdl, juc.`permanent_add_country_id` AS ngPermanentAddCountryMdl, juc.`permanent_add_state_id` AS ngPermanentAddStateMdl, juc.`permanent_add_district_id` AS ngPermanentAddDistrictMdl, juc.`permanent_add_pincode` AS ngPermanentAddPincodeMdl FROM `jos_users` ju LEFT JOIN (SELECT `user_id`, `first_name`, `last_name`, `gender`, `dob`, `place_of_birth`, `marital_status`, `photo_id_proof_name`, `photo_id_proof_id`, `address_id_proof_name`, `address_id_proof_id` FROM `jos_user_personal_details`) jupd ON ju.`id` = jupd.`user_id`, `jos_user_contact` juc WHERE ju.`id` = ".$myid." AND ju.`id` = juc.`user_id`");

			print jsonEncode($query);
	break;
}
?>