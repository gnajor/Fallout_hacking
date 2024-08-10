import { PubSub } from "../../../../logic/pubsub.js";
import * as word_likeness from "../../word_likeness/word_likeness.js";
import * as show_hover_word from "../../show_hover_word/show_hover_word.js";

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
            //resets the marked if keys were used
            const marked_green_array = document.querySelectorAll(".make_green");
            marked_green_array.forEach(element => {
                element.classList.remove("make_green");
            });

            const word_class = item.className;
            const word = document.querySelectorAll("." + word_class);
            let hovered_word = "";

            word.forEach(letter => {
                letter.classList.add("make_green");
                hovered_word += letter.textContent;
            });

            PubSub.publish({
                event: "show_mark_hover_word",
                details: {"parent": hovered_word_parent, "hovered_word": hovered_word}
            });
        });

        item.addEventListener("mouseout", (event) => {
            const word = document.querySelectorAll(".make_green");

            word.forEach(letter => {
                letter.classList.remove("make_green");
            });
        });

        item.addEventListener("click", (event) => {
            const word = document.querySelectorAll(".make_green");
            let chosen_string = "";

            word.forEach(letter => {
                chosen_string += letter.textContent;
            });
 
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
            const marked_green_array = document.querySelectorAll(".make_green");
            marked_green_array.forEach(element => {
                element.classList.remove("make_green")
            });

            item.classList.add("make_green");

            PubSub.publish({
                event: "show_mark_hover_word",
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