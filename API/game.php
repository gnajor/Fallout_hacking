<?php
require_once ("help_functions.php");
$allowed_method = "GET";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
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
    $user_input_difficulty = $request_data["difficulty"];

    if(isset($user_input_difficulty)){
        $difficulties = get_database("difficulty");

        foreach($difficulties as $difficulty){
            if(isset($difficulty[$user_input_difficulty])){
                $words_amount = $difficulty[$user_input_difficulty]["words_amount"];
                $letter_amount = $difficulty[$user_input_difficulty]["letter_amount"];

                $game_array = get_interactive_data(32, 12, $words_amount, $letter_amount);

                $game_array["non_interactive"] = get_non_interactive_data(32);

                $structured_game_array = set_data_structure($game_array, 32, 12);

                send_as_json(200, [
                    "game_data" => $structured_game_array, 
                    "correct_word" => $game_array["correct_word"], 
                    "game_structure" => [
                        "rows" => 32,
                        "columns" => 12
                        ]
                    ]); 
            }
        }
    }
}

function set_data_structure($game_array, $rows, $columns){
    $loop_amount = $rows * $columns;

    //echo var_dump($total_special_chars);

    $interactive_data = get_word_char_order(30, $loop_amount, $game_array["words"], $game_array["special_chars"]);

    $interactive_data_split = array_chunk($interactive_data, count($interactive_data)/2);

    $non_interactive_data = $game_array["non_interactive"];
    $non_interactive_data_split = array_chunk($non_interactive_data, count($non_interactive_data)/2);

    $refined_data_structure = [];

    $refined_data_structure["column_1"] = $non_interactive_data_split[0];
    $refined_data_structure["column_2"] = $interactive_data_split[0];
    $refined_data_structure["column_3"] = $non_interactive_data_split[1];
    $refined_data_structure["column_4"] = $interactive_data_split[1];

    return $refined_data_structure;
}

function get_word_char_order($chance, $loop_amount, $words, $special_chars){
    $words_chars = [];

    while(count($words_chars) != $loop_amount){
        $words_last = count($words) - 1;
        $spec_chars_last = count($special_chars) - 1;


        $random_num = rand(1, $chance);

        if($random_num === 1 && $words_last != -1){
            $chosen_word = $words[$words_last];
            array_pop($words);
            $char_array = str_split($chosen_word);
            $word_length = count($char_array);

            for($char_index = 0; $char_index < $word_length; $char_index++){
                $words_chars[] = $char_array[$char_index] . "_word" . $words_last + 1;
            } 
        }
        elseif($random_num > 1 && $spec_chars_last != -1 ){
            $chosen_char = $special_chars[$spec_chars_last];
            array_pop($special_chars);
            $words_chars[] = $chosen_char;
        }
    }

/*     echo "<pre>";
    echo var_dump($words_chars);
    echo "</pre>"; */
    
    return $words_chars;
}

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

    $random_index = rand(0, count($words) - 1);
    $correct_word = $words[$random_index];

    $chars = [];
    for($i = 0; $i < $char_amount_with_words; $i++){
        $random_index = rand(0, count($special_chars) - 1);
        $random_char = $special_chars[$random_index];
        $chars[] = $random_char;
    }

    return ["correct_word" => $correct_word, "words" => $words, "special_chars" => $chars];
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
    $random_char_2 = $letters_nums_array[$random_index_2]; //error? undefined key -2
    
    $non_interactive_chars = [];
    $random_row = rand(6, 20);

    for($row_index = 0; $row_index < $data_amount; $row_index++){
        $random_index_3 = rand(0, count($letters_nums_array) - 1);
        $random_index_4 = rand(0, count($letters_nums_array) - 1);

        $random_char_3 = $letters_nums_array[$random_index_3];
        $random_char_4 = $letters_nums_array[$random_index_4];

        if($row_index > $random_row){
            $new_index = $random_index_2 + 1;
            $new_char = $letters_nums_array[$new_index];    //error undefined key -a

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
?>