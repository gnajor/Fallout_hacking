import { PubSub } from "../../logic/pubsub.js";

function render_start_screen(parent){
    
    parent.innerHTML = `<div id="start_screen">
                            <div id="video_container">
                                <video src="../../../media/videos/fallout_video_smaller.mp4" autoplay muted loop>
                                    Browser does not support this element
                                </video>

                                <div id="video_text">Press Enter to start</div>
                            </div>
                        </div>`;

    const video_dom = parent.querySelector("video");
    const small_screen = document.querySelector("#small_screen");
    const video_text = parent.querySelector("#video_text");

    small_screen.innerHTML = `<div id="sound_control"> 
                                  <img id="mute" class="show" src="../../../media/icons/mute.png" alt="mute icon">
                                  <img id="unmute" class="unshow" src="../../../media/icons/volume.png" alt="unmute icon">
                              </div>`;

    const mute_icon = small_screen.querySelector("#mute");
    const unmute_icon = small_screen.querySelector("#unmute");

    video_dom.addEventListener("timeupdate", function get_video_time(event){

        if(video_dom.currentTime > 3){
            video_text.classList.add("show");

            window.addEventListener("keydown", function press_enter_to_start(event){
                if(event.key === "Enter"){
                    PubSub.publish({
                        event: "get_game_data",
                        details: null
                    });
                    window.removeEventListener("keydown", press_enter_to_start);
                }
            });
            video_dom.removeEventListener("timeupdate", get_video_time);
        }
    });

    small_screen.addEventListener("click", (event) => {
        video_dom.volume = 0.3;

        if(mute_icon.classList[0] === "show"){
            mute_icon.classList = "unshow";
            unmute_icon.classList = "show";
            video_dom.muted = false;
        } 
        else{
            mute_icon.classList = "show";
            unmute_icon.classList = "unshow";
            video_dom.muted = true;
        }
    });
}



PubSub.subscribe({
    event: "render_start_screen",
    listener: (parent) => {
        render_start_screen(parent)
    }
})