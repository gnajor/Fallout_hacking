import { PubSub } from "./logic/pubsub.js";
import * as game from "./components/game/game.js";

const _state = {
    "game": {
        "score": 1,
        "level": 1,
        "words": [],
        "correct_word": undefined, 
        "special_chars": [],
        "non_interactive": [],
        "attempts_remaining": 4,
    },
    "user_based": {
        "highscore": 0,
        "username": null,
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

        _state.game.special_chars = resource.special_chars;
        _state.game.correct_word = resource.correct_word;
        _state.game.non_interactive = resource.non_interactive;
        _state.game.words = resource.words;

        PubSub.publish({
            event: "render_game",
            details: {
                "parent": document.querySelector("#wrapper"),
                "data": State.get("game")
            }
        });
    }
})



