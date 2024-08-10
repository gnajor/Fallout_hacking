import { PubSub } from "../../../../logic/pubsub.js";

function render_non_interactable_item(parent, item_data){
    const item = document.createElement("span");
    item.textContent = item_data;
    parent.appendChild(item);
}

PubSub.subscribe({
    event:"render_non_interactable_item",
    listener: (details) => {
        const {parent, item} = details;

        render_non_interactable_item(parent, item);
    }
})