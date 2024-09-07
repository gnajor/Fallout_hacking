import { PubSub } from "../../../logic/pubsub.js";

function render_typewriter_animation(interact_parents, non_interact_parents, text_parent, game_structure){
    const {interact_parent_1, interact_parent_2} = interact_parents; 
    const {non_interact_parent_1, non_interact_parent_2} = non_interact_parents;
    const {game_rows, game_columns} = game_structure;
    const company_chars = text_parent.children[0].children;
    const password_chars = text_parent.children[1].children;
    const attempts_chars = text_parent.children[2].children;
    const attempts = attempts_chars[attempts_chars.length - 1];

    const time = 15;

    document.body.classList.add("no_cursor_animation");
    //document.querySelector("make_green").classList.remove("make_green");

    animate_top_text(company_chars);

    setTimeout(() => {
        animate_top_text(password_chars);
    }, time * company_chars.length);

    setTimeout(() => {
        animate_top_text(attempts_chars);
    }, (time * company_chars.length) + (time * password_chars.length));

    setTimeout(() => {
        for(let y = 0; y < game_rows/2; y++){ 
            let start = y * game_columns;
            let end = (y + 1) * game_columns;

            setTimeout(() => {
                non_interact_parent_1.children[y].classList.add("show");
            }, time * start * 2); // 0 //2400

            setTimeout(() => {
                for(let i = start; i < end; i++){ 
                    setTimeout(() => {
                        interact_parent_1.children[i].classList.add("show");
                        interact_parent_1.children[i].classList.remove("make_green");
                    }, time * i);
                }  
            }, time * start + time) // 100 // 1300 

            setTimeout(() => {
                non_interact_parent_2.children[y].classList.add("show");

            }, time * end + start * time); // 1200 // 

            setTimeout(() => {
                for(let i = start; i < end; i++){ 
                    setTimeout(() => {
                        interact_parent_2.children[i].classList.add("show");

                        if(i === (game_rows/2 * game_columns) - 1){
                            attempts.classList.add("show");
                            document.body.classList.remove("no_cursor_animation");
                            interact_parent_1.children[0].classList.add("make_green");
                            document.querySelector("#wrapper").classList.add("events");

                            PubSub.publish({
                                event: "enable_arrow_controls_after_animation",
                                details: null
                            });
                        }
                    }, time * i);
                }  
            }, time * end + time) // 1300 //2500 
        }
    }, (time * company_chars.length) + (time * password_chars.length) + (time * attempts_chars.length));

    function animate_top_text(children){
        for(let i = 0; i < children.length; i++){
            if(children[i].id !== "attempts"){
                setTimeout(() => {
                    children[i].classList.add("show");
                }, time * i)
            }
        }
    }
}

PubSub.subscribe({
    event: "activate_animation",
    listener: (details) => {
        const {
            non_interact_parent_1, 
            non_interact_parent_2,
            interact_parent_1,
            interact_parent_2,
            game_info,
            game_columns,
            game_rows
        } = details;

        const non_interact = {non_interact_parent_1, non_interact_parent_2};
        const interact = {interact_parent_1, interact_parent_2} 
        const text = game_info
        const game_structure = {game_columns, game_rows}

        render_typewriter_animation(interact, non_interact, text, game_structure);
    }
})