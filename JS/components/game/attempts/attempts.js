import { PubSub } from "../../../logic/pubsub.js";

function render_attempts(parent, attempts){
    const attempts_div = document.createElement("div");
    attempts_div.id = "attempts";
    parent.appendChild(attempts_div);
    
    for(let i = 0; i < attempts; i++){
        PubSub.publish({
            event: "render_attempt",
            details: {"parent": attempts_div, "attempts": attempts}
        });
    }
}

PubSub.subscribe({
    event: "render_attempts",
    listener: (details) => {
        const {parent, attempts} = details;
        render_attempts(parent, attempts);
    }
})