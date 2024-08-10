import { PubSub } from "../../../logic/pubsub.js";

function render_word_likeness(parent, word_data){
    const {correct_word, chosen_string} = word_data;
    const correct_string = correct_word.toUpperCase();

    const likeness = check_likeness(correct_string, chosen_string);

    parent.innerHTML += `<div class="guess">
                            <div class="show_word">>${chosen_string}</div>
                            <div>>Entry denied</div>
                            <div class="show_likeness">>Likeness=${likeness}</div>
                         <div>`;
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
    event:"render_word_likeness",
    listener: (details) => {
        const {parent, correct_word, chosen_string} = details;
        const word_data = {correct_word, chosen_string};

        render_word_likeness(parent, word_data);
    }
});