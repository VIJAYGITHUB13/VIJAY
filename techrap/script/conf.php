<?php
mysql_connect("localhost", "root", "") or die(mysql_error());
mysql_select_db("techrap") or die(mysql_error());

include "trigger.php";
?>