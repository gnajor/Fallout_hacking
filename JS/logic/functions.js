export function get_item_and_mark(item){
    let hovered_word = "";

    if(item.className.includes("word")){
        const word = document.querySelectorAll("." + item.className);

        word.forEach(item => {
            item.classList.add("make_green");
            hovered_word += item.textContent; 
        });
    }
    else{
        item.classList.add("make_green");
        hovered_word = item.textContent;
    }

    return hovered_word;
}

export function remove_items_marked(class_name){
    const marked_green_array = document.querySelectorAll("." + class_name)

    marked_green_array.forEach(element => {
        element.classList.remove("make_green")
    });
}

export function get_full_word(class_name){
    const word = document.querySelectorAll("." + class_name);

    let hovered_word = "";

    word.forEach(letter => {
        hovered_word += letter.textContent; 
    });

    return hovered_word;
}

