<?php

function get_request_data(){
    if($_SERVER["REQUEST_METHOD"] === "GET"){
        return $_GET;
    }
    else{
        $json = file_get_contents("php://input");
        return json_decode($json, true);
    }
}

function get_database($type){
    $database = file_get_contents("database/$type.json");
    return json_decode($database, true);
}

function send_as_json($status, $data = []){
    header("Content-Type: application/json");
    http_response_code($status);
    echo json_encode($data);
    exit();
}

?>