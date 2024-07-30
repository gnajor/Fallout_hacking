import { PubSub } from "./logic/pubsub.js";
import * as game from "./components/game/game.js";

const _state = {
    "game": {
        "score": 1,
        "level": 1,
        "correct_word": undefined, 
        "game_data": [],
        "attempts_remaining": 4,
    },
    "user_based": {
        "highscore": 0,
        "username": undefined,
    },
    "leaderboard": []
}

const State = {
    get: (entity) => {
        const _state_clone = JSON.parse(JSON.stringify(_state));
        return _state_clone[entity];
    }
}

PubSub.subscribe({
    event: "get_game_data",
    listener:async () => {
        const response = await fetch(`../API/game.php?difficulty=level_${_state.game.level}`)
        const resource = await response.json();
        const {game_data, correct_word} = resource;

        _state.game.correct_word = correct_word;        
        _state.game.game_data = game_data;

        PubSub.publish({
            event: "render_game",
            details: {
                "parent": document.querySelector("#wrapper"),
                "data": State.get("game")
            }
        });
    }
})



