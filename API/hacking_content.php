<?php


function get_interactive_data($row_amount, $column_amount, $word_amount, $letter_amount){
    $chars_array = json_decode(file_get_contents("database/chars.json"), true);
    $words_array = json_decode(file_get_contents("database/words.json"), true);
    $filtererd_word_array = filter_words_by_letter_amount($letter_amount, $words_array);
    $special_chars = $chars_array[1]["specials"];

    $char_amount = $column_amount * $row_amount;
    $char_amount_with_words = $char_amount - ($word_amount * $letter_amount);

    $words = [];
    for($i = 0; $i < $word_amount; $i++){
        $random_index = rand(0, count($filtererd_word_array) - 1);
        $random_word = $filtererd_word_array[$random_index];
        $words[] = $random_word;
    }

    $chars = [];
    for($i = 0; $i < $char_amount_with_words; $i++){
        $random_index = rand(0, count($special_chars) - 1);
        $random_char = $special_chars[$random_index];
        $chars[] = $random_char;
    }

    return ["words" => $words, "special_chars" => $chars];
}

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
    $random_row = rand(6, 20);

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


function filter_words_by_letter_amount($letter_amount, $words){
    $result = [];

    foreach($words as $word){
        if(strlen($word) === $letter_amount){
            $result[] = $word;
        }
    }
    return $result;
}

$send_array = get_interactive_data(32, 12, 8, 4);
$send_array["non_interactive"] = get_non_interactive_data(32);

echo "<pre>";
echo var_dump($send_array);
echo "</pre>";

?>