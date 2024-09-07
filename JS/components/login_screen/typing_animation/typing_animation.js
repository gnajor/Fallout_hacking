import { PubSub } from "../../../logic/pubsub.js";


function render_typing_animation(element_array, text_array, counter = 0){
    const time = 15;
    const element = element_array[counter];
    const element_text = text_array[counter];
    const char_array = element_text.split("");
    
    for(let y = 0; y < char_array.length; y++){
        setTimeout(() => {
            element.innerHTML += `<span>${char_array[y]}</span>`;
            element.children[y].classList.add("show");

            if(y === char_array.length - 1){
                if(element.parentElement.classList[0]){
                    if(element.parentElement.classList[0].includes("input")){
                        element.nextElementSibling.classList.add("show")
                    }
                }

                if(counter !== text_array.length - 1){
                    counter++;
                    render_typing_animation(element_array, text_array, counter);
                }
            }
        }, time * y);
    }
}

PubSub.subscribe({
    event: "render_typing_animation",
    listener: (details) => {
        const {element_array, text_array} = details

        render_typing_animation(element_array, text_array);
    }
});

