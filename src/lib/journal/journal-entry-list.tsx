import { Component, For, Show } from "solid-js";
import { JournalEntry } from "./journal-entry";
import { bulletCollection } from "../../store/bullet-collection";

export const JournalEntryList: Component = (props) => {
  return (
    <>
      <Show when={bulletCollection.length === 0}>Nothing here</Show>
      <Show when={bulletCollection.length > 0}>
        <div class="space-y-4">
          <For each={bulletCollection}>
            {(entry) => <JournalEntry id={entry.id} />}
          </For>
        </div>
      </Show>
    </>
  );
};
