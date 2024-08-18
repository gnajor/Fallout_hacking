import { PubSub } from "../../../logic/pubsub.js";
import {State} from "../../../state.js";

function render_word_likeness(parent, word_data){
    const {correct_word, chosen_string} = word_data;
    const correct_string = correct_word.toUpperCase();
    const likeness = check_likeness(correct_string, chosen_string);

    parent.innerHTML += `<div class="guess">
                            <div class="show_word">>${chosen_string}</div>
                            <div class="lock">>Entry denied</div>
                            <div class="show_likeness">>Likeness=${likeness}</div>
                        <div>`;

    State.delete_attempt();

    if(correct_string.length === likeness){
        console.log("you win");   
    }
}

function check_likeness(correct_string, chosen_string){
    const correct_letters = correct_string.split("");
    const chosen_letters = chosen_string.split("");
    let likeness = 0;

    for(let i = 0; i < correct_letters.length; i++){
        const correct_letter = correct_letters[i];
        const chosen_letter = chosen_letters[i];

        if(correct_letter === chosen_letter){
            likeness++;
        }
    }
    return likeness;
}

PubSub.subscribe({
    event: "lockout",
    listener: (details) => {
        const show_likeness = document.querySelectorAll(".show_likeness");
        const last_likeness = show_likeness[show_likeness.length - 1];

        last_likeness.textContent = "Init Lockout";
    }
});


PubSub.subscribe({
    event:"render_word_likeness",
    listener: (details) => {
        const {parent, correct_word, chosen_string} = details;
        const word_data = {correct_word, chosen_string};

        render_word_likeness(parent, word_data);
    }
});