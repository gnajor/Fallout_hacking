import { PubSub } from "../../logic/pubsub.js";
import * as interactable_item from "./game_items/interactable_item/interactable_item.js";
import * as non_interactable_item from "./game_items/non_interactable_item/non_interactable_item.js";
import * as arrow_controls from "./arrow_controls/arrow_controls.js";

function render_game(parent, game){
    const {score, level, correct_word, game_data, attempts_remaining, game_rows, game_columns} = game;

    parent.innerHTML = `<div id="game">
                            <div id="game_grid">    
                                <div id="non_interactable_column_1"></div>
                                <div id="interactable_column_1"></div>
                                <div id="non_interactable_column_2"></div>
                                <div id="interactable_column_2"></div>
                            </div>
                            <div id="word_likeness_column">
                                <div id="guesses"></div>
                                <div id="hovered_word"></div>
                            </div>
                        </div>`;
                
    const non_interactable_column_1 = parent.querySelector("#non_interactable_column_1");
    const non_interactable_column_2 = parent.querySelector("#non_interactable_column_2");
    const interactable_column_1 = parent.querySelector("#interactable_column_1");
    const interactable_column_2 = parent.querySelector("#interactable_column_2");
    const guesses = parent.querySelector("#guesses");
    const hovered_word = parent.querySelector("#hovered_word");
    
    for(let y = 0; y < game_rows/2; y++){ 
        let start = y * game_columns;
        let end = (y + 1) * game_columns;
        let time = 10;

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
}


PubSub.subscribe({
    event: "render_game",
    listener: (details) => {
        const {parent, data} = details;
        render_game(parent, data);
    }
})