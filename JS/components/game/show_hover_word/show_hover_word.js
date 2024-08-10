import { PubSub } from "../../../logic/pubsub.js";

function show_hover_word(parent, hovered_word){
    parent.textContent = ">" + hovered_word;
}

PubSub.subscribe({
    event:"show_hover_word",
    listener: (details) => {
        const {parent, hovered_word} = details;

        show_hover_word(parent, hovered_word)
    }
})