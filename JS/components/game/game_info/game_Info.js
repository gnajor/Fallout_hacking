import { PubSub } from "../../../logic/pubsub.js";

function render_game_info(parent, attempts){
    const text_array = ["Welcome to WAYNE Industries (TM) Termlink", "Password Required", "Attempts Remaining:"];

    parent.innerHTML = `<div id="company_text"></div>
                        <div id="password_text"></div>
                        <div id="attempts_remaining"></div>`;

    const company_text = parent.querySelector("#company_text");
    const password_text = parent.querySelector("#password_text");
    const attempts_remaining = parent.querySelector("#attempts_remaining");

    make_string_into_elements(text_array[0], company_text);
    make_string_into_elements(text_array[1], password_text);
    make_string_into_elements(text_array[2], attempts_remaining);

    PubSub.publish({
        event: "render_attempts",
        details: {"parent": attempts_remaining, "attempts": attempts}
    }); 
}

function make_string_into_elements(string, parent){
    const split_string = string.split("");

    for(let i = 0; i < split_string.length; i++){
        parent.innerHTML += `<span><pre>${split_string[i]}</pre></span>`;
    }
}


PubSub.subscribe({
    event: "render_game_info",
    listener: (details) => {
        const {parent, attempts} = details;
 
        render_game_info(parent, attempts)
    }
})