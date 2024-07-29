import { PubSub } from "./JS/logic/pubsub.js";
import * as state from "./JS/state.js";

function render_start_screen(){
    PubSub.publish({
        event: "render_start_screen",
        details: null
    });
}

PubSub.publish({
    event: "get_game_data",
    details: null
})

render_start_screen();