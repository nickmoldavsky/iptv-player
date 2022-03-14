<?php

    include_once('db.php'); 

    //http://stackoverflow.com/questions/18382740/cors-not-working-php
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }
 
    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
 
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         
 
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
 
        exit(0);
    }
 
 
    //http://stackoverflow.com/questions/15485354/angular-http-post-to-php-and-undefined
    $postdata = file_get_contents("php://input");
    if (isset($postdata)) {
        $request = json_decode($postdata);
        $id = $request->id;
		$q = $request->q;
 
        if ($id != '' || $q != '') {
			
			if($id) {
				if($id == 230780) {
					//$sql = "SELECT id, name, cmd FROM itv LIMIT 150";
                    $sql = "SELECT i.id, i.name, i.cmd, e.name AS epg_name, e.time, e.time_to, e.ch_id, e.duration
                    FROM itv as i
                    LEFT JOIN epg as e ON e.ch_id=i.id AND e.time<NOW() AND e.time_to>NOW()
                    ORDER BY i.id";
				}
				else {
                    //$sql = "SELECT ch_id, descr, duration, name, time, time_to FROM epg WHERE ch_id=".$id." AND time >= (NOW() - HOUR(NOW()-3)) GROUP BY time";
                    $sql = "SELECT * FROM epg WHERE ch_id=".$id." AND TIME BETWEEN DATE_SUB( NOW( ) , INTERVAL 60 MINUTE ) AND DATE_ADD( NOW( ) , INTERVAL 1 DAY ) GROUP BY time";
				
				}
			}
			
			if($q) {
				$sql = "SELECT * FROM itv WHERE name LIKE '".$q."%'";
			}
			
			
			
			//mysql_query("SET NAMES 'utf8'");
			$result = mysqli_query($conn, $sql);

			if (mysqli_num_rows($result) > 0) {
				$querydata = array();
				while($row = mysqli_fetch_assoc($result)) {
                    if($id != "230780") {
                        $timestamp = strtotime($row["time"]);
                        $querydata[$timestamp] = $row;
                    } else {
                        $querydata[] = $row;
                    }
				    
				}
				header("HTTP/1.1 200 OK");
				echo json_encode($querydata);
			} else {
				echo "[]";
			}
			
        }
        else {
			header("Status: 404 Not Found");
            echo false;
        }
    }
    else {
        echo "Not called properly with username parameter!";
    }
	
	mysqli_close($conn);
?>