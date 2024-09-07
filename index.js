import { PubSub } from "./JS/logic/pubsub.js";
import * as start_screen from "./JS/components/start_screen/start_screen.js";
import * as state from "./JS/state.js";
import * as login_screen from "./JS/components/login_screen/login_screen.js";

/* function render_start_screen(){
    PubSub.publish({
        event: "render_start_screen",
        details: document.querySelector("#terminal_screen")
    });
}

render_start_screen(); */

PubSub.publish({
    event: "render_login_screen",
    details: document.querySelector("#terminal_screen")
})