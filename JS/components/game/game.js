import { PubSub } from "../../logic/pubsub.js";

function render_game(parent, game_data){
    //game = "";

    console.log(game_data)

    parent.innerHTML = `<div class="non_interactive_container"></div>
                        <div class="interactive_container"></div>
                        <div class="non_interactive_container"></div>
                        <div class="interactive_container"></div>`; //16 12
}

function get_random_int(max){
    return Math.floor(Math.random() * max);
}



PubSub.subscribe({
    event: "render_game",
    listener: (details) => {
        const {parent, data} = details;
        render_game(parent, data);
    }
})