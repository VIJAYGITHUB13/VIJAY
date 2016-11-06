<?php
include "../../../../../script/conf.php";

$task = $_GET["task"];

switch($task) {
	case "register":
		$data = json_decode(file_get_contents("php://input"));

		$ngMobileNoMdl = trim($data->ngMobileNoMdl);
		$ngEmailIDMdl = trim($data->ngEmailIDMdl);

		$is_exists = mysql_result(mysql_query("SELECT COUNT(`id`) FROM `jos_user_contact` WHERE `mobile_no` LIKE '%".$ngMobileNoMdl."%' OR `email_id` LIKE '%".$ngEmailIDMdl."%'"), 0);

		if($is_exists) {
			print "ALREADY_EXISTS";
		} else {
			$myid = trim($data->myid);
			$ucategory = trim($data->ucategory);

			$ngFNameMdl = trim($data->ngFNameMdl);
			$ngLNameMdl = trim($data->ngLNameMdl);

			$uname = $ngFNameMdl." ".$ngLNameMdl;
			$block = 0;
			if($ucategory == 5) {
				$block = 1;
			}

			$ngAltMobileNoMdl = trim($data->ngAltMobileNoMdl);
			$ngAltEmailIDMdl = trim($data->ngAltEmailIDMdl);

			$insert_ju = mysql_query("INSERT INTO `jos_users`(`id`, `user_cat_id`, `name`, `display_name`, `created_by`, `created_on`, `block`) VALUES (NULL, ".$ucategory.", '".str_replace(" ", "_", strtolower($uname))."', '".$uname."', ".$myid.", NOW(), ".$block.")");
			$last_inserted_id_ju = mysql_insert_id();

			if($ucategory == 5) {
				$insert_juc = mysql_query("INSERT INTO `jos_user_contact`(`id`, `user_id`, `mobile_no`, `alt_mobile_no`, `email_id`, `alt_email_id`) VALUES (NULL, ".$last_inserted_id_ju.", ".$ngMobileNoMdl.", ".$ngAltMobileNoMdl.", '".$ngEmailIDMdl."', '".$ngAltEmailIDMdl."')");

				$insert_jupd = mysql_query("INSERT INTO `jos_user_personal_details` (`id`, `user_id`, `first_name`, `last_name`, `gender`, `dob`, `place_of_birth`, `marital_status`, `photo_id_proof_name`, `photo_id_proof_id`, `address_id_proof_name`, `address_id_proof_id`) VALUES (NULL, ".$last_inserted_id_ju.", '".$ngFNameMdl."', '".$ngLNameMdl."', '".$ngGenderMdl."', '', '', '', '', '', '', '')");

				// SELECT CONCAT('TR', DATE_FORMAT(DATE(NOW()), '%Y%m%d'), LPAD((COUNT(`id`) + 1), 3, '0')) AS inc_id FROM `jos_users` WHERE  DATE(`last_logged_on`) = DATE(NOW())
				$insert_jr = mysql_query("INSERT INTO `jos_requests`(`id`, `name`, `status`, `user_id`, `created_by`, `created_on`) SELECT NULL, CONCAT('TR', DATE_FORMAT(DATE(NOW()), '%Y%m%d'), LPAD((COUNT(`id`) + 1), 3, '0')) AS request_name, 1, ".$last_inserted_id_ju.", ".$myid.", NOW() FROM `jos_requests` WHERE  DATE(`created_on`) = DATE(NOW())");
				$last_inserted_id_jr = mysql_insert_id();

				$comments = "Please initiate connection establishment";
				$insert_jrd = mysql_query("INSERT INTO `jos_request_details`(`id`, `request_id`, `status`, `user_id`, `comment`, `commented_on`) VALUES (NULL, ".$last_inserted_id_jr.", 1, ".$myid.", '".$comments."', NOW())");

				if($insert_ju && $insert_juc && $insert_jupd && $insert_jr && $insert_jrd) {
					print "SUCCESS";
				} else {
					print "ERROR_DB";
				}
			} else {
				$ngDOBMdl = trim($data->ngDOBMdl);
				$ngPOBMdl = trim($data->ngPOBMdl);
				$ngGenderMdl = trim($data->ngGenderMdl);
				$ngMaritalStatusMdl = trim($data->ngMaritalStatusMdl);
				$ngPresentAddLine1Mdl = trim($data->ngPresentAddLine1Mdl);
				$ngPermanentAddLine1Mdl = trim($data->ngPermanentAddLine1Mdl);
				$ngPresentAddLine2Mdl = trim($data->ngPresentAddLine2Mdl);
				$ngPermanentAddLine2Mdl = trim($data->ngPermanentAddLine2Mdl);
				$ngPresentAddLandmarkMdl = trim($data->ngPresentAddLandmarkMdl);
				$ngPermanentAddLandmarkMdl = trim($data->ngPermanentAddLandmarkMdl);
				$ngPresentAddCountryMdl = trim($data->ngPresentAddCountryMdl);
				$ngPermanentAddCountryMdl = trim($data->ngPermanentAddCountryMdl);
				$ngPresentAddStateMdl = trim($data->ngPresentAddStateMdl);
				$ngPermanentAddStateMdl = trim($data->ngPermanentAddStateMdl);
				$ngPresentAddDistrictMdl = trim($data->ngPresentAddDistrictMdl);
				$ngPermanentAddDistrictMdl = trim($data->ngPermanentAddDistrictMdl);
				$ngPresentAddPincodeMdl = trim($data->ngPresentAddPincodeMdl);
				$ngPermanentAddPincodeMdl = trim($data->ngPermanentAddPincodeMdl);

				$insert_juc = mysql_query("INSERT INTO `jos_user_contact` (`id`, `user_id`, `mobile_no`, `alt_mobile_no`, `email_id`, `alt_email_id`, `present_add_line1`, `present_add_line2`, `present_add_landmark`, `present_add_country_id`, `present_add_state_id`, `present_add_district_id`, `present_add_pincode`, `permanent_add_line1`, `permanent_add_line2`, `permanent_add_landmark`, `permanent_add_country_id`, `permanent_add_state_id`, `permanent_add_district_id`, `permanent_add_pincode`, `company`) VALUES (NULL, ".$last_inserted_id_ju.", ".$ngMobileNoMdl.", ".$ngAltMobileNoMdl.", '".$ngEmailIDMdl."', '".$ngAltEmailIDMdl."', '".$ngPresentAddLine1Mdl."', '".$ngPresentAddLine2Mdl."', '".$ngPresentAddLandmarkMdl."', ".$ngPresentAddCountryMdl.", ".$ngPresentAddStateMdl.", ".$ngPresentAddDistrictMdl.", ".$ngPresentAddPincodeMdl.", '".$ngPermanentAddLine1Mdl."', '".$ngPermanentAddLine2Mdl."', '".$ngPermanentAddLandmarkMdl."', ".$ngPermanentAddCountryMdl.", ".$ngPermanentAddStateMdl.", ".$ngPermanentAddDistrictMdl.", ".$ngPermanentAddPincodeMdl.", '')");

				$insert_jupd = mysql_query("INSERT INTO `jos_user_personal_details` (`id`, `user_id`, `first_name`, `last_name`, `gender`, `dob`, `place_of_birth`, `marital_status`, `photo_id_proof_name`, `photo_id_proof_id`, `address_id_proof_name`, `address_id_proof_id`) VALUES (NULL, ".$last_inserted_id_ju.", '".$ngFNameMdl."', '".$ngLNameMdl."', ".$ngGenderMdl.", '".$ngDOBMdl."', '".$ngPOBMdl."', '".$ngMaritalStatusMdl."', '', '', '', '')");

				if($insert_ju && $insert_juc && $insert_jupd) {
					print "SUCCESS";
				} else {
					print "ERROR_DB";
				}
			}
		}

		// $str = "";
		// $str .= " ngFNameMdl=>".$ngFNameMdl;
		// $str .= " ngLNameMdl=>".$ngLNameMdl;
		// $str .= " ngDOBMdl=>".$ngDOBMdl;
		// $str .= " ngPOBMdl=>".$ngPOBMdl;
		// $str .= " ngGenderNameMdl=>".$ngGenderNameMdl;
		// $str .= " ngMaritalStatusNameMdl=>".$ngMaritalStatusNameMdl;
		// $str .= " ngMobileNoMdl=>".$ngMobileNoMdl;
		// $str .= " ngAltMobileNoMdl=>".$ngAltMobileNoMdl;
		// $str .= " ngEmailIDMdl=>".$ngEmailIDMdl;
		// $str .= " ngAltEmailIDMdl=>".$ngAltEmailIDMdl;
		// $str .= " ngPresentAddLine1Mdl=>".$ngPresentAddLine1Mdl;
		// $str .= " ngPermanentAddLine1Mdl=>".$ngPermanentAddLine1Mdl;
		// $str .= " ngPresentAddLine2Mdl=>".$ngPresentAddLine2Mdl;
		// $str .= " ngPermanentAddLine2Mdl=>".$ngPermanentAddLine2Mdl;
		// $str .= " ngPresentAddLandmarkMdl=>".$ngPresentAddLandmarkMdl;
		// $str .= " ngPermanentAddLandmarkMdl=>".$ngPermanentAddLandmarkMdl;
		// $str .= " ngPresentAddCountryNameMdl=>".$ngPresentAddCountryNameMdl;
		// $str .= " ngPermanentAddCountryNameMdl=>".$ngPermanentAddCountryNameMdl;
		// $str .= " ngPresentAddStateNameMdl=>".$ngPresentAddStateNameMdl;
		// $str .= " ngPermanentAddStateNameMdl=>".$ngPermanentAddStateNameMdl;
		// $str .= " ngPresentAddDistrictNameMdl=>".$ngPresentAddDistrictNameMdl;
		// $str .= " ngPermanentAddDistrictNameMdl=>".$ngPermanentAddDistrictNameMdl;
		// $str .= " ngPresentAddPincodeMdl=>".$ngPresentAddPincodeMdl;
		// $str .= " ngPermanentAddPincodeMdl=>".$ngPermanentAddPincodeMdl;
		// $str .= " ngFNameMdl=>".$ngFNameMdl;
		// $str .= " ngLNameMdl=>".$ngLNameMdl;
		// $str .= " ngMobileNoMdl=>".$ngMobileNoMdl;
		// $str .= " ngAltMobileNoMdl=>".$ngAltMobileNoMdl;
		// $str .= " ngEmailIDMdl=>".$ngEmailIDMdl;
		// $str .= " ngAltEmailIDMdl=>".$ngAltEmailIDMdl;

		// print($str);
	break;
}
?>