import { PubSub } from "../../../../logic/pubsub.js";
import * as word_likeness from "../../word_likeness/word_likeness.js";
import * as show_hover_word from "../../show_hover_word/show_hover_word.js";
import { get_item_and_mark, remove_items_marked, get_full_word} from "../../../../logic/functions.js";

function render_interactable_item(parents, correct_word, item_data){
    const {item_parent, guesses_parent, hovered_word_parent} = parents;

    const item = document.createElement("span");
    item.textContent = item_data;
    item_parent.appendChild(item);

    if(item_data.includes("word")){
        const letter_data = item_data.split("_word");
        const letter = letter_data[0];
        const letter_id = letter_data[1];
        item.classList.add("word_" + letter_id);
        item.textContent = letter.toUpperCase();

        item.addEventListener("mouseover", (event) => {
            remove_items_marked("make_green");
            const hovered_word = get_item_and_mark(item);

            PubSub.publish({
                event: "show_hover_word",
                details: {"parent": hovered_word_parent, "hovered_word": hovered_word}
            });
        });

        item.addEventListener("mouseout", (event) => {
            remove_items_marked("make_green");
        });

        item.addEventListener("click", (event) => {
            const chosen_string = get_full_word("make_green");
 
            PubSub.publish({
                event: "render_word_likeness",
                details:{
                            "parent": guesses_parent, 
                            "chosen_string": chosen_string, 
                            "correct_word": correct_word
                        }
            });
        });
    }
    else{
        item.classList.add("char");
        item.addEventListener("mouseover", (event) => {
            //resets the marked if keys were used
            remove_items_marked("make_green");
            const hovered_word = get_item_and_mark(item);

            PubSub.publish({
                event: "show_hover_word",
                details: {"parent": hovered_word_parent, "hovered_word": item.textContent}
            });
        });
        item.addEventListener("mouseout", (event) => {
            item.classList.remove("make_green");
        });

        item.addEventListener("click", (event) => {
            PubSub.publish({
                event: "render_word_likeness",
                details:{
                            "parent": guesses_parent, 
                            "chosen_string": item.textContent, 
                            "correct_word": correct_word
                        }
            });
        });
    }

}


PubSub.subscribe({
    event:"render_interactable_item",
    listener: (details) => {
        const {correct_word, item, item_parent, guesses_parent, hovered_word_parent} = details;
        const parents = {item_parent, guesses_parent, hovered_word_parent};

        render_interactable_item(parents, correct_word, item);
    }
})