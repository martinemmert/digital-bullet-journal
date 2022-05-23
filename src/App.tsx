import type { Component } from "solid-js";
import { createSignal, For, onMount, Show } from "solid-js";
import {
  bulletCollection,
  createAddBulletMutation,
  createLoadBulletCollectionQuery,
} from "./store/bullet-collection";
import { BulletListItem } from "./components/bullet-list-item";

const App: Component = () => {
  let form;
  let textarea;

  const [inputValue, setInputValue] = createSignal("");
  const [typeValue, setTypeValue] = createSignal("note");
  const [, , loadBulletCollection] = createLoadBulletCollectionQuery();
  const [isSaving, addBullet] = createAddBulletMutation();

  onMount(() => loadBulletCollection());

  function onSubmit(event: SubmitEvent) {
    event.preventDefault();
    const data: { content?: string; type?: string } = Object.fromEntries(
      new FormData(form)
    );
    if (data.content && data.content?.trim() !== "") {
      addBullet(data).then(() => {
        textarea.focus();
        setInputValue("");
      });
    }
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && event.altKey) {
      form.dispatchEvent(new SubmitEvent("submit"));
    }
  }

  return (
    <article class="container max-w-4xl mx-auto p-4">
      <div class="card card-compact bg-base-200">
        <div class="card-body">
          <form ref={form} class="flex flex-col space-y-4" onSubmit={onSubmit}>
            <div>
              <textarea
                ref={textarea}
                name="content"
                class="textarea bg-base-300 w-full"
                placeholder="type something"
                value={inputValue()}
                onKeyDown={onKeyDown}
                disabled={isSaving()}
                onInput={(event) => setInputValue(event.currentTarget.value)}
              />
            </div>
            <div class="flex flex-row space-x-4">
              <div>
                <fieldset class="input-group">
                  <span>
                    <label for="bullet_type">Type</label>
                  </span>
                  <select
                    id="bullet_type"
                    name="type"
                    class="select"
                    value={typeValue()}
                    disabled={isSaving()}
                    onChange={(event) =>
                      setTypeValue(event.currentTarget.value)
                    }
                  >
                    <option value="note">Note</option>
                    <option value="todo">Todo</option>
                    <option value="event">Event</option>
                    <option value="idea">Idea</option>
                  </select>
                </fieldset>
              </div>
              <button
                type="submit"
                class="btn btn-primary no-animation flex-1 space-x-2"
                classList={{ loading: isSaving() }}
                disabled={isSaving()}
              >
                <Show when={isSaving()}>Saving</Show>
                <Show when={!isSaving()}>
                  <span>Add new {typeValue()}</span>
                  <span class="space-x-1 hidden md:inline">
                    (<kbd class="kbd kbd-xs">⌥</kbd>
                    <span>+</span>
                    <kbd class="kbd kbd-xs">Enter</kbd>)
                  </span>
                </Show>
              </button>
            </div>
          </form>
        </div>
      </div>

      <Show when={bulletCollection.length > 0}>
        <div class="divider" />
      </Show>

      <ol class="relative border-l border-base-300 ml-4">
        <For each={bulletCollection}>
          {(bullet) => <BulletListItem id={bullet.id} />}
        </For>
      </ol>
    </article>
  );
};

export default App;
