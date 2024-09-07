import { PubSub } from "../../logic/pubsub.js";
import * as interactable_item from "./game_items/interactable_item/interactable_item.js";
import * as non_interactable_item from "./game_items/non_interactable_item/non_interactable_item.js";
import * as arrow_controls from "./arrow_controls/arrow_controls.js";
import * as attempt from "./attempts/attempt/attempt.js";
import * as attempts from "./attempts/attempts.js";
import * as animation from "./typewriter_animation/typewriter_animation.js";
import * as game_info from "./game_info/game_Info.js";


function render_game(parent, game){
    const {score, level, correct_word, game_data, attempts_remaining, game_rows, game_columns} = game;

    parent.innerHTML = `<div id="game">
                            <div id = "left_container"> 
                                <div id="game_info"></div>
                                <div id="game_grid">    
                                    <div id="non_interactable_column_1"></div>
                                    <div id="interactable_column_1"></div>
                                    <div id="non_interactable_column_2"></div>
                                    <div id="interactable_column_2"></div>
                                </div>
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
    const game_info = parent.querySelector("#game_info");

    const rows = game_rows/2
    const game_grid = rows * game_columns; 

    for(let i = 0; i < game_grid; i++){
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
    }

    for(let i = 0; i < rows; i++){
        PubSub.publish({
            event: "render_non_interactable_item",
            details:{"item": game_data["column_1"][i], "parent": non_interactable_column_1} 
        });

        PubSub.publish({
            event: "render_non_interactable_item",
            details:{"item": game_data["column_3"][i], "parent": non_interactable_column_2} 
        });
    }

    PubSub.publish({
        event: "render_game_info",
        details: {"parent": game_info, "attempts": attempts_remaining}
    })

    PubSub.publish({
        event: "activate_animation",
        details: {
            "non_interact_parent_1": non_interactable_column_1,
            "non_interact_parent_2": non_interactable_column_2,
            "interact_parent_1": interactable_column_1,
            "interact_parent_2": interactable_column_2,
            "game_info": game_info,
            "game_rows": game_rows,
            "game_columns": game_columns
        }
    });

    PubSub.subscribe({
        event: "enable_arrow_controls_after_animation",
        listener: () => {
            
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
    })
}


PubSub.subscribe({
    event: "render_game",
    listener: (details) => {
        const {parent, data} = details;
        render_game(parent, data);
    }
})