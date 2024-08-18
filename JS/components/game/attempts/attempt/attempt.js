import { PubSub } from "../../../../logic/pubsub.js";

function render_attempt(parent, attempts){
    const cube = document.createElement("div");
    cube.classList.add("attempt");
    parent.appendChild(cube);
}

PubSub.subscribe({
    event: "render_attempt",
    listener: (details) => {

        const {parent, attempts} = details;
        render_attempt(parent, attempts);
    }
});

PubSub.subscribe({
    event: "delete_attempt",
    listener: () => {
        document.querySelector(".attempt").remove();
    }
})