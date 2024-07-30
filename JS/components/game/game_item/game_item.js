import { PubSub } from "../../../logic/pubsub.js";

function render_game_item(parent, correct_word, item_data, id){
    const parent_name = parent.id;
    const item = document.createElement("span");
    item.textContent = item_data;
    parent.appendChild(item);

    if(parent_name.includes("non_interactive")){
        item.classList.add("non_char");
    }
    else if(correct_word === item_data){
        item.id = "correct_word";
    }
    else if(item_data.length > 1){
        item.classList.add("word");
    }
    else{
        item.classList.add("char");
    }
}


PubSub.subscribe({
    event:"render_game_item",
    listener: (details) => {

        const {correct_word, item, parent} = details;

        render_game_item(parent, correct_word, item);
    }
})