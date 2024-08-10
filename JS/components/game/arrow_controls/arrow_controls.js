import { PubSub } from "../../../logic/pubsub.js";

function enable_arrow_controls(parents, correct_word, game_structure, interactable_containers){
    const {game_columns, game_rows} = game_structure;
    const {interactable_column_1, interactable_column_2} = interactable_containers;
    const {parent, guesses_parent} = parents;
    const interactable_array_1 = interactable_column_1.children;
    const interactable_array_2 = interactable_column_2.children;

    for(let i = 0; i < interactable_array_1.length; i++){
        interactable_array_1[i].classList.remove("make_green");
        interactable_array_2[i].classList.remove("make_green");
    }

    //if first symbol is word
    let current_element_hover = interactable_array_1[0];
    let current_element_parent = interactable_column_1;
    let next_element_parent = interactable_column_2;

    current_element_hover.classList.add("make_green");
    document.body.classList.add("no_cursor");
    
    let next_movement = get_next_movement(current_element_hover, current_element_parent, next_element_parent , game_structure);

    PubSub.publish({
        event:"show_mark_hover_word",
        details: {"parent": parent, "hovered_word": interactable_array_1[0].textContent}
    }); 

    window.addEventListener("keydown", (event) => {
        for(let i = 0; i < interactable_array_1.length; i++){
            interactable_array_1[i].classList.remove("make_green");
            interactable_array_2[i].classList.remove("make_green");
        }

        function set_next_movement(move){
            current_element_hover = next_movement[move].movement;
            current_element_parent = next_movement[move].main_parent;
            next_element_parent = next_movement[move].secondary_parent;

            let hovered_word = "";

            if(current_element_hover.className.includes("word")){
                const word = document.querySelectorAll("." + current_element_hover.className);
                const index = get_index_from_collection(current_element_hover, current_element_hover.children);    

                word.forEach(letter => {
                    letter.classList.add("make_green");
                    hovered_word += letter.textContent;
                });  
            }
            else{
                current_element_hover.classList.add("make_green");
                hovered_word = current_element_hover.textContent;
            }

            PubSub.publish({
                event:"show_mark_hover_word",
                details: {"parent": parent, "hovered_word": hovered_word}
            }); 
        }
        
        switch(event.key){
            case "ArrowUp":
                set_next_movement("up");
                document.body.classList.add("no_cursor");
                break;
            case "w":
                set_next_movement("up");
                document.body.classList.add("no_cursor");
                break;

            case "ArrowDown":
                set_next_movement("down");
                document.body.classList.add("no_cursor");
                break;
            case "s":
                set_next_movement("down");
                document.body.classList.add("no_cursor");
                break;

            case "ArrowLeft":
                set_next_movement("left");
                document.body.classList.add("no_cursor");
                break;
            case "a":
                set_next_movement("left");
                document.body.classList.add("no_cursor");
                break;

            case "ArrowRight":
                set_next_movement("right");
                document.body.classList.add("no_cursor");
                break;
            case "d":
                set_next_movement("right");
                document.body.classList.add("no_cursor");
                break;

            case "Enter":

                PubSub.publish({
                    event: "render_word_likeness",
                    details:{
                                "parent": guesses_parent, 
                                "chosen_string": current_element_hover.textContent, 
                                "correct_word": correct_word
                            }
                });

        }
        next_movement = get_next_movement(current_element_hover, current_element_parent, next_element_parent , game_structure);
        
    });

    window.addEventListener("mousemove", (event) => {
        document.body.classList.remove("no_cursor");
    });
}

function get_next_movement(element, current_parent, next_parent, game_structure){
    const {game_columns, game_rows} = game_structure;
    const area = game_columns * game_rows/2;
    const primary = current_parent.children;
    const secondary = next_parent.children;
    const index = get_index_from_collection(element, primary);

    const top_left_corner = 0;
    const bottom_left_corner = area - game_columns;
    const top_right_corner = game_columns - 1;
    const bottom_right_corner = area - 1;

    const left_side = (index % game_columns === 0);
    const right_side = ((index + 1) % game_columns === 0);
    const up_side = (index < game_columns);
    const bottom_side = (index > area - game_columns - 1);


    const up = {
        "movement": primary[index - game_columns],
        "main_parent": current_parent,
        "secondary_parent": next_parent
    }

    const down = {
        "movement": primary[index + game_columns],
        "main_parent": current_parent,
        "secondary_parent": next_parent
    }
    
    let left = {
        "movement": primary[index - 1],
        "main_parent": current_parent,
        "secondary_parent": next_parent
    }
    
    let right = {
        "movement": primary[index + 1],
        "main_parent": current_parent,
        "secondary_parent": next_parent
    }

    if(element.className.includes("word")){
        const word = document.querySelectorAll("." + element.classList[0]);
        const row_indexes = [];
        const first_letter_index = get_index_from_collection(word[0], primary);

        //make array to show which row the letters are on
        let current_letter_index = 0;
        let last_letter_index = 0;

        for(let i = 0; i < word.length; i++){
            const letter = word[i];
            const letter_index = get_index_from_collection(letter, primary);
            const row = String(letter_index/game_columns)[0];
            last_letter_index = letter_index;
            row_indexes.push(row);

            if(letter_index === index){
                current_letter_index = i;
            }
        }

        //points out on which index the letters switch row
        let same_row = true;
        let latest_row_index = row_indexes[0];
        for(let row_index = 1; row_index < row_indexes.length; row_index++){
            if(row_indexes[row_index] !== latest_row_index){
                latest_row_index = row_index;
                same_row = false;
                break;
            }
        }

        const word_length = row_indexes.length; 
        const steps_move_right = word_length - current_letter_index;
        const steps_move_left = current_letter_index + 1;
        const column_switch = latest_row_index;
        right.movement = primary[index + steps_move_right];
        left.movement = primary[index - steps_move_left];

        const word_begin_left = first_letter_index % game_columns === 0
        const word_end_right = ((last_letter_index + 1) % game_columns === 0);
        const bottom_part_of_word_left = current_letter_index >= column_switch;
        const top_part_of_word_right = current_letter_index < column_switch
        
        if(same_row && word_begin_left){
            left.movement = secondary[index - current_letter_index + game_columns - 1];
            left.main_parent = next_parent;
            left.secondary_parent = current_parent;
        }

        else if(same_row && word_end_right){
            right.movement = secondary[index + word_length - current_letter_index - game_columns];
            right.main_parent = next_parent;
            right.secondary_parent = current_parent;
        }
        else if(!same_row && bottom_part_of_word_left){
            const words_on_other_row = word_length - column_switch - 1;
            left.movement = secondary[index - words_on_other_row + game_columns - 1];
            left.main_parent = next_parent;
            left.secondary_parent = current_parent; 
        }

        else if(!same_row && top_part_of_word_right){
            const words_on_same_row = word_length - (word_length - column_switch);
            right.movement = secondary[index + words_on_same_row - current_letter_index - game_columns];
            right.main_parent = next_parent;
            right.secondary_parent = current_parent; 
        }
    }

    if(index === top_left_corner){
        up.movement = primary[bottom_left_corner];
        left.movement = secondary[top_right_corner];
        left.main_parent = next_parent;
        left.secondary_parent = current_parent;
    }

    else if(index === bottom_left_corner){
        down.movement = primary[top_left_corner];
        left.movement = secondary[bottom_right_corner];
        left.main_parent = next_parent;
        left.secondary_parent = current_parent;
    }

     else if(index === top_right_corner){
        up.movement = primary[bottom_right_corner];
        right.movement = secondary[top_left_corner];
        right.main_parent = next_parent;
        right.secondary_parent = current_parent;
    }

    else if(index === bottom_right_corner){
        down.movement = primary[top_right_corner];
        right.movement = secondary[bottom_left_corner];
        right.main_parent = next_parent;
        right.secondary_parent = current_parent;
    }

    else if(left_side){ 
        left.movement = secondary[index + game_columns - 1];
        left.main_parent = next_parent;
        left.secondary_parent = current_parent;
    }

    else if(right_side){ 
        right.movement = secondary[index - game_columns + 1];
        right.main_parent = next_parent;
        right.secondary_parent = current_parent;
    }

    else if(up_side){
        up.movement = primary[area - game_columns + index];
    }

    else if(bottom_side){
        down.movement = primary[index - (area - game_columns)];
    }

    return {up, down, left, right};
}

function get_index_from_collection(element, collection){
    for(let i = 0; i < collection.length; i++){
        if(collection[i] === element){
            return i;
        }
    }
}

PubSub.subscribe({
    event: "enable_arrow_controls",
    listener: (details) => {
        const {parent, game_rows, game_columns, interactable_column_1, interactable_column_2, guesses_parent, correct_word} = details;
        const game_structure = {game_rows, game_columns};
        const parents = {parent, guesses_parent};
        const interactable_containers = {interactable_column_1, interactable_column_2}

        enable_arrow_controls(parents, correct_word, game_structure, interactable_containers);
    }
})