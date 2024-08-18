function render_typewriter_animation(){
    animate_top_text(company_text, company_chars);

    setTimeout(() => {
        animate_top_text(password_text, password_chars);
    }, time * company_chars.length);

    setTimeout(() => {
        animate_top_text(attempts_text, attempts_chars);
    }, (time * company_chars.length) + (time * password_chars.length));

    setTimeout(() => {
        for(let y = 0; y < game_rows/2; y++){ 
            let start = y * game_columns;
            let end = (y + 1) * game_columns;

            setTimeout(() => {
                PubSub.publish({
                    event: "render_non_interactable_item",
                    details:{"item": game_data["column_1"][y], "parent": non_interactable_column_1} 
                });
            }, time * start * 2); // 0 //2400

            setTimeout(() => {
                for(let i = start; i < end; i++){ 
                    setTimeout(() => {
                        PubSub.publish({
                            event: "render_interactable_item",
                            details:{
                                        "correct_word": correct_word,
                                        "item": game_data["column_2"][i], 
                                        "item_parent": interactable_column_1,
                                        "guesses_parent": guesses,
                                        "hovered_word_parent": hovered_word
                                    } 
                        });
                    }, time * i);
                }  
            }, time * start + time) // 100 // 1300 

            setTimeout(() => {
                PubSub.publish({
                    event: "render_non_interactable_item",
                    details:{"item": game_data["column_3"][y], "parent": non_interactable_column_2} 
                });
            }, time * end + start * time); // 1200 // 

            setTimeout(() => {
                for(let i = start; i < end; i++){ 
                    setTimeout(() => {
                        PubSub.publish({
                            event: "render_interactable_item",
                            details:{
                                        "correct_word": correct_word,
                                        "item": game_data["column_4"][i], 
                                        "item_parent": interactable_column_2,
                                        "guesses_parent": guesses,
                                        "hovered_word_parent": hovered_word
                                    } 
                        });

                        //when animation finished
                        if(i === (game_rows/2 * game_columns) - 1){

                            PubSub.publish({
                                event: "render_attempts",
                                details: {"parent": attempts_text, "attempts": attempts_remaining}
                            });

                            PubSub.publish({
                                event: "enable_arrow_controls",
                                details: {
                                    "parent": hovered_word,
                                    "guesses_parent":  guesses,
                                    "correct_word": correct_word,
                                    "game_rows": game_rows,
                                    "game_columns": game_columns,
                                    "interactable_column_1": interactable_column_1,
                                    "interactable_column_2": interactable_column_2
                                }
                            });
                        }
                    }, time * i);
                }  
            }, time * end + time) // 1300 //2500 
        }
    }, (time * company_chars.length) + (time * password_chars.length) + (time * attempts_chars.length));

    function animate_top_text(container, chars){
        for(let i = 0; i < chars.length; i++){
            setTimeout(() => {
                container.textContent += chars[i]
            }, time * i)
        }
    }
}