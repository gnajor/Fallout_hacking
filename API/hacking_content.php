<?php


function get_non_interactive_data($data_amount){
    $chars_array = json_decode(file_get_contents("database/chars.json"), true);
    $letters_nums_array = $chars_array[0]["letters_nums"];
    $fixed_chars = $chars_array[2]["fixed_chars"];

    $random_index_1 = rand(0, count($letters_nums_array) - 1);
    $random_index_2 = rand(0, count($letters_nums_array) - 2);

    if($random_index_1 === $random_index_2){
        $random_index_2 = $random_index_2 - 2; 
    }


    $random_char_1 = $letters_nums_array[$random_index_1];
    $random_char_2 = $letters_nums_array[$random_index_2];
    
    $non_interactive_chars = [];
    $random_row = rand(6, 25);

    for($row_index = 0; $row_index < $data_amount; $row_index++){
        $random_index_3 = rand(0, count($letters_nums_array) - 1);
        $random_index_4 = rand(0, count($letters_nums_array) - 1);

        $random_char_3 = $letters_nums_array[$random_index_3];
        $random_char_4 = $letters_nums_array[$random_index_4];

        if($row_index > $random_row){
            $new_index = $random_index_2 + 1;
            $new_char = $letters_nums_array[$new_index];

            $row_data = $fixed_chars . $random_char_1 . $new_char;
        }
        else{
            $row_data = $fixed_chars . $random_char_1 . $random_char_2;
        }

        $row_data .= $random_char_3 . $random_char_4;
        $non_interactive_chars[] = $row_data; 
    }

    return $non_interactive_chars;
}
echo "<pre>";
echo var_dump(get_non_interactive_data(32));
echo "</pre>";

?>