<?php


function get_non_interactive_data(){
    $chars_array = file_get_contents("database/chars.json");

    echo var_dump($chars_array);
}

get_non_interactive_data();



?>