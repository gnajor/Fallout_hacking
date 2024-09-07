<?php 
require_once ("help_functions.php");
$allowed_method = "POST";

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: *");
    header("Access-Control-Allow-Origin: *");
    exit();
} else {
    header("Access-Control-Allow-Origin: *");
}

$request_method = $_SERVER["REQUEST_METHOD"];

if($request_method === $allowed_method){
    $request_data = get_request_data();

    $allowed_keys = ["username", "password"];

    if(empty($request_data["username"]) || empty($request_data["password"])){
        send_as_json(400, ["error" => $request_data]);
    }

    if(isset($request_data["username"]) && isset($request_data["password"])){
        $token = sha1($request_data["username"] . $request_data["password"]);
        $users = get_database("users");
        $user_id = 0;

        foreach($users as $user){
            if($user["id"] > $user_id){
                $user_id = $user["id"] + 1;
            }

            if($user["username"] === $request_data["username"]){
                send_as_json(400, ["error" => "username already exists"]);
            }
        }
        $new_user = ["id" => $user_id, "username" => $request_data["username"], "token" => $token];
        $users[] = $new_user;
        file_put_contents("./database/users.json", json_encode($users, JSON_PRETTY_PRINT));

        send_as_json(200, ["Success" => "new user created"]);
    }
}



?>