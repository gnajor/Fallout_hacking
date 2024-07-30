import { PubSub } from "../../logic/pubsub.js";
import * as game_item from "./game_item/game_item.js";

function render_game(parent, game){
    const {score, level, correct_word, game_data, attempts_remaining} = game;

    const parent_names = [
        "non_interactive_container_1",
        "interactive_container_1",
        "non_interactive_container_2",
        "interactive_container_2"
    ];

    const game_grid = document.createElement("div");
    game_grid.id = "game_grid";
    parent.appendChild(game_grid);

    for(let name of parent_names){
        const parent = document.createElement("div");
        parent.id = name;
        game_grid.appendChild(parent);
    }

    let counter = 0;
    for(let key in game_data){
        let game_key = game_data[key]; 

        for(let y = 0; y < game_key.length; y++){
            const item = game_key[y];

            PubSub.publish({
                event: "render_game_item",
                details: {"correct_word": correct_word, "item": item, "parent": document.querySelector("#" + parent_names[counter])}
            });
        }
        counter++;
    }
    
}


PubSub.subscribe({
    event: "render_game",
    listener: (details) => {
        const {parent, data} = details;
        render_game(parent, data);
    }
})