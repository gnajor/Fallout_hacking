import { PubSub } from "../../logic/pubsub.js";
import * as typing_animation from "../login_screen/typing_animation/typing_animation.js";

function render_login_screen(parent){
    parent.innerHTML = `<div id="login_screen">
                            <div id="comp_text"></div>
                            <div id="log_reg_container" class="input_container">
                                <div></div>
                                <input type="text" autofocus>
                            </div>
                            <div id="username" class="input_container">
                                <div></div>
                                <input type="text" autofocus>
                            </div>
                            <div id="password" class="input_container">
                                <div></div>
                                <input type="password" autofocus>
                            </div>
                            <div id="register_status"></div>
                            <img alt="vault boy gif">
                        </div>`;

    const log_reg_input = parent.querySelector("#log_reg_container input");
    const username_input = parent.querySelector("#username input");
    const password_input = parent.querySelector("#password input");

    const comp_text = parent.querySelector("#comp_text");
    const log_reg_text = parent.querySelector("#log_reg_container div");
    const username_text = parent.querySelector("#username div");
    const password_text = parent.querySelector("#password div");

    const text_array = ["Welcome to Wayne Industries (TM) Termlink", "Login or Register:", "Username:", "Password:"];

    log_reg_input.addEventListener("keypress", (event) => {
        if(event.key === "Enter"){
            PubSub.publish({
                event: "render_typing_animation",
                details: {
                    "element_array": [username_text],
                    "text_array": [text_array[2]]
                } 
            });

            log_reg_input.removeAttribute("autofocus")
            log_reg_input.setAttribute("disabled", "")

            password_input.focus();
        }
    })

    password_input.addEventListener("keypress", (event) => {
        if(event.key === "Enter"){
            
        }
    });

    username_input.addEventListener("keypress", (event) => {
        if(event.key === "Enter"){

        }
    });

    PubSub.publish({
        event: "render_typing_animation",
        details: {
            "element_array": [comp_text, log_reg_text],
            "text_array": [text_array[0], text_array[1]]
        } 
    });
}

PubSub.subscribe({
    event: "render_login_screen",
    listener: (parent) => {
        console.log(parent)
        render_login_screen(parent);
    }
})