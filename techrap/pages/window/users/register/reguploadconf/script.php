<?php
include "../../../../../script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "register":
		$data = json_decode(file_get_contents("php://input"));

		$userdetails = $data->userdetails;

		$exist_ar = array();
		for($i=0;$i<count($userdetails);$i++) {
			$ngMobileNoMdl = trim($userdetails[$i]->mobile_no);
			$ngEmailIDMdl = trim($userdetails[$i]->email_id);

			$is_exists = mysql_result(mysql_query("SELECT COUNT(`id`) FROM `jos_user_contact` WHERE `mobile_no` LIKE '%".$ngMobileNoMdl."%' OR `email_id` LIKE '%".$ngEmailIDMdl."%'"), 0);

			if($is_exists) {
				array_push($exist_ar, $userdetails[$i]->ind);
			}
		}

		if(count($exist_ar)) {
			$res_type = "ALREADY_EXISTS";
			$res_msg = "Registration couldn't be processed, as the highlighted user details are already exist(s). Confirm being them unchecked or to retain them, modify their details in the template and upload again.";

			$response = array("type"=>$res_type, "exists_ar"=>$exist_ar, "response"=>$res_msg);
		} else {
			$myid = trim($data->myid);
			$ucategory = trim($data->ucategory);

			$success_count = 0;
			$error_db_count = 0;
			$registered_ar = array();
			for($i=0;$i<count($userdetails);$i++) {
				$ngMobileNoMdl = trim($userdetails[$i]->mobile_no);
				$ngEmailIDMdl = trim($userdetails[$i]->email_id);

				$ngFNameMdl = trim($userdetails[$i]->fname);
				$ngLNameMdl = trim($userdetails[$i]->lname);

				$uname = $ngFNameMdl." ".$ngLNameMdl;
				$block = 0;
				if($ucategory == 5) {
					$block = 1;
				}

				$ngAltMobileNoMdl = trim($userdetails[$i]->alt_mobile_no);
				$ngAltEmailIDMdl = trim($userdetails[$i]->alt_email_id);

				$insert_ju = mysql_query("INSERT INTO `jos_users`(`id`, `user_cat_id`, `name`, `display_name`, `created_by`, `created_on`, `block`) VALUES (NULL, ".$ucategory.", '".str_replace(" ", "_", strtolower($uname))."', '".$uname."', ".$myid.", NOW(), ".$block.")");
				$last_inserted_id_ju = mysql_insert_id();

				if($ucategory == 5) {
					$insert_juc = mysql_query("INSERT INTO `jos_user_contact`(`id`, `user_id`, `mobile_no`, `alt_mobile_no`, `email_id`, `alt_email_id`) VALUES (NULL, ".$last_inserted_id_ju.", '".$ngMobileNoMdl."', '".$ngAltMobileNoMdl."', '".$ngEmailIDMdl."', '".$ngAltEmailIDMdl."')");

					$insert_jupd = mysql_query("INSERT INTO `jos_user_personal_details` (`id`, `user_id`, `first_name`, `last_name`, `gender`, `dob`, `place_of_birth`, `marital_status`, `photo_id_proof_name`, `photo_id_proof_id`, `address_id_proof_name`, `address_id_proof_id`) VALUES (NULL, ".$last_inserted_id_ju.", '".$ngFNameMdl."', '".$ngLNameMdl."', '', '', '', '', '', '', '', '')");

					// SELECT CONCAT('TR', DATE_FORMAT(DATE(NOW()), '%Y%m%d'), LPAD((COUNT(`id`) + 1), 3, '0')) AS inc_id FROM `jos_users` WHERE  DATE(`last_logged_on`) = DATE(NOW())
					$insert_jr = mysql_query("INSERT INTO `jos_requests`(`id`, `name`, `status`, `user_id`, `created_by`, `created_on`) SELECT NULL, CONCAT('TR', DATE_FORMAT(DATE(NOW()), '%Y%m%d'), LPAD((COUNT(`id`) + 1), 3, '0')) AS request_name, 1, ".$last_inserted_id_ju.", ".$myid.", NOW() FROM `jos_requests` WHERE  DATE(`created_on`) = DATE(NOW())");
					$last_inserted_id_jr = mysql_insert_id();

					$comments = "Please initiate connection establishment";
					$insert_jrd = mysql_query("INSERT INTO `jos_request_details`(`id`, `request_id`, `status`, `user_id`, `comment`, `commented_on`) VALUES (NULL, ".$last_inserted_id_jr.", 1, ".$myid.", '".$comments."', NOW())");

					if($insert_ju && $insert_juc && $insert_jr && $insert_jrd) {
						array_push($registered_ar, $userdetails[$i]->ind);
						$success_count++;
					} else {
						$error_db_count++;
					}
				} else {
					$ngDOBMdl = trim($userdetails[$i]->dob);
					$ngPOBMdl = trim($userdetails[$i]->pob);
					$ngGenderMdl = trim($userdetails[$i]->gender);
					$ngMaritalStatusMdl = trim($userdetails[$i]->marital_status);
					$ngPresentAddLine1Mdl = trim($userdetails[$i]->present_add_line1);
					$ngPermanentAddLine1Mdl = trim($userdetails[$i]->permanent_add_line1);
					$ngPresentAddLine2Mdl = trim($userdetails[$i]->present_add_line2);
					$ngPermanentAddLine2Mdl = trim($userdetails[$i]->permanent_add_line2);
					$ngPresentAddLandmarkMdl = trim($userdetails[$i]->present_add_landmark);
					$ngPermanentAddLandmarkMdl = trim($userdetails[$i]->permanent_add_landmark);

					$ngPresentAddCountryMdl = getCountryID(formatDName(trim($userdetails[$i]->present_add_country)));
					$ngPermanentAddCountryMdl = getCountryID(formatDName(trim($userdetails[$i]->permanent_add_country)));

					$ngPresentAddStateMdl = getStateID($ngPresentAddCountryMdl, formatDName(trim($userdetails[$i]->present_add_state)));
					$ngPermanentAddStateMdl = getStateID($ngPermanentAddCountryMdl, formatDName(trim($userdetails[$i]->permanent_add_state)));

					$ngPresentAddDistrictMdl = getDistrictID($ngPresentAddStateMdl, formatDName(trim($userdetails[$i]->present_add_district)));
					$ngPermanentAddDistrictMdl = getDistrictID($ngPermanentAddStateMdl, formatDName(trim($userdetails[$i]->permanent_add_district)));

					$ngPresentAddPincodeMdl = trim($userdetails[$i]->present_add_pincode);
					$ngPermanentAddPincodeMdl = trim($userdetails[$i]->permanent_add_pincode);

					$insert_juc = mysql_query("INSERT INTO `jos_user_contact` (`id`, `user_id`, `mobile_no`, `alt_mobile_no`, `email_id`, `alt_email_id`, `present_add_line1`, `present_add_line2`, `present_add_landmark`, `present_add_country_id`, `present_add_state_id`, `present_add_district_id`, `present_add_pincode`, `permanent_add_line1`, `permanent_add_line2`, `permanent_add_landmark`, `permanent_add_country_id`, `permanent_add_state_id`, `permanent_add_district_id`, `permanent_add_pincode`, `company`) VALUES (NULL, ".$last_inserted_id_ju.", '".$ngMobileNoMdl."', '".$ngAltMobileNoMdl."', '".$ngEmailIDMdl."', '".$ngAltEmailIDMdl."', '".$ngPresentAddLine1Mdl."', '".$ngPresentAddLine2Mdl."', '".$ngPresentAddLandmarkMdl."', '".$ngPresentAddCountryMdl."', '".$ngPresentAddStateMdl."', '".$ngPresentAddDistrictMdl."', '".$ngPresentAddPincodeMdl."', '".$ngPermanentAddLine1Mdl."', '".$ngPermanentAddLine2Mdl."', '".$ngPermanentAddLandmarkMdl."', '".$ngPermanentAddCountryMdl."', '".$ngPermanentAddStateMdl."', '".$ngPermanentAddDistrictMdl."', '".$ngPermanentAddPincodeMdl."', '')");

					$insert_jupd = mysql_query("INSERT INTO `jos_user_personal_details` (`id`, `user_id`, `first_name`, `last_name`, `gender`, `dob`, `place_of_birth`, `marital_status`, `photo_id_proof_name`, `photo_id_proof_id`, `address_id_proof_name`, `address_id_proof_id`) VALUES (NULL, ".$last_inserted_id_ju.", '".$ngFNameMdl."', '".$ngLNameMdl."', '".$ngGenderMdl."', '".$ngDOBMdl."', '".$ngPOBMdl."', '".$ngMaritalStatusMdl."', '', '', '', '')");

					if($insert_ju && $insert_juc && $insert_jupd) {
						array_push($registered_ar, $userdetails[$i]->ind);
						$success_count++;
					} else {
						$error_db_count++;
					}
				}
			}

			if(count($userdetails) == $success_count) {
				$res_type = "SUCCESS";
				$res_msg = "Done with the registration.";
			} else if(count($userdetails) == $error_db_count) {
				$res_type = "ERROR_DB";
				$res_msg = "Server error.";
			} else {
				$res_type = "PARTIAL_SUCCESS";
				$res_msg = "Done with the partial registration of ".$success_count." user details out of ".count($userdetails).".";
			}

			$response = array("type"=>$res_type, "registered_ar"=>$registered_ar, "response"=>$res_msg);
		}

		print json_encode($response);
	break;
}

function formatDName($dname) {
	return str_replace(" ", "_", strtolower($dname));
}

function getCountryID($country_name) {
	return mysql_result(mysql_query("SELECT `id` FROM `jos_countries` WHERE `name` LIKE '".$country_name."'"), 0);
}

function getStateID($country_id, $state_name) {
	return mysql_result(mysql_query("SELECT js.`id` FROM `jos_countries` jc, `jos_states` js WHERE jc.`id` = '".$country_id."' AND js.`name` LIKE '".$state_name."'"), 0);
}

function getDistrictID($state_id, $district_name) {
	return mysql_result(mysql_query("SELECT jd.`id` FROM `jos_states` js, `jos_districts` jd WHERE js.`id` = '".$state_id."' AND jd.`name` LIKE '".$district_name."'"), 0);
}
?>