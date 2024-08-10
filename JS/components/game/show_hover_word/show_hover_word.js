import { PubSub } from "../../../logic/pubsub.js";

function show_mark_hover_word(parent, hovered_word){
    /*let hovered_word = "";


    if(){
        items.forEach(item => {
            item.classList.add("make_green");
            hovered_word += item.textContent; 
        });
    }
    else{
        items.classList.add("make_green");
        hovered_word = items.textContent;
    } */

    parent.textContent = ">" + hovered_word;
}

PubSub.subscribe({
    event:"show_mark_hover_word",
    listener: (details) => {
        const {parent, hovered_word} = details;

        show_mark_hover_word(parent, hovered_word)
    }
})