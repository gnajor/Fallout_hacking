import { PubSub } from "./logic/pubsub.js";
import * as game from "./components/game/game.js";

const _state = {
    "game": {
        "score": 0,
        "level": 1,
        "correct_word": undefined, 
        "game_data": [],
        "attempts_remaining": 4,
        "game_rows": null,
        "game_columns": null
    },
    "user_based": {
        "highscore": 0,
        "username": undefined,
    },
    "leaderboard": []
}

export const State = {
    get: (entity) => {
        const _state_clone = JSON.parse(JSON.stringify(_state));
        return _state_clone[entity];
    },

    post: (enity, body) => {
        
    },

    delete_attempt: () => {
        const new_attempts = _state.game.attempts_remaining - 1;

        _state.game.attempts_remaining = new_attempts;
        PubSub.publish({
            event: "delete_attempt",
            details: null
        });

        if(new_attempts === 0){
            
            PubSub.publish({
                event: "lockout",
                details: null
            });
        }
    }
}



PubSub.subscribe({
    event: "get_game_data",
    listener:async () => {
        const response = await fetch(`../API/game.php?difficulty=level_${_state.game.level}`)
        const resource = await response.json();
        const {game_data, correct_word, game_structure} = resource;

        _state.game.game_rows = game_structure["rows"];
        _state.game.game_columns = game_structure["columns"];
        _state.game.correct_word = correct_word;        
        _state.game.game_data = game_data;

        PubSub.publish({
            event: "render_game",
            details: {
                "parent": document.querySelector("#terminal_screen"),
                "data": State.get("game")
            }
        });
    }
})



