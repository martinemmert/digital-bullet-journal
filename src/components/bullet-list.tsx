import { Component, createSignal, For, Show } from "solid-js";
import { TextEditor } from "./text-editor";
import {
  bulletCollection,
  createAddBulletMutation,
} from "../store/bullet-collection";
import { BulletListItem } from "./bullet-list-item";
import { Editor } from "@tiptap/core";
import { HashtagPluginKey } from "../lib/editor/extensions/hashtags";
import { HashtagList } from "./hashtag-list";

export const BulletList: Component = () => {
  let form;
  const [editor, setEditor] = createSignal<Editor>();

  const [typeValue, setTypeValue] = createSignal("note");
  const [isSaving, addBullet] = createAddBulletMutation();

  function onSubmit(event: SubmitEvent) {
    event.preventDefault();

    const data: { type?: string } = Object.fromEntries(new FormData(form));
    const content = editor().getJSON();
    const tags = HashtagPluginKey.getState(editor().state);

    if (!editor().isEmpty) {
      addBullet({ content, tags, type: data.type }).then(() => {
        editor().commands.focus();
        editor().commands.setContent("");
      });
    }
  }

  return (
    <article class="container max-w-4xl mx-auto p-4">
      <div class="card card-compact bg-base-200">
        <div class="card-body">
          <form ref={form} class="flex flex-col space-y-4" onSubmit={onSubmit}>
            <TextEditor
              editorRef={setEditor}
              onSubmit={(editor) =>
                form.dispatchEvent(new SubmitEvent("submit"))
              }
            />
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

      <div class="flex space-x-8">
        <div class="w-full w-1/6">
          <HashtagList></HashtagList>
        </div>
        <ol class="relative w-full border-l border-base-300 ml-4">
          <For each={bulletCollection}>
            {(bullet) => <BulletListItem id={bullet.id} />}
          </For>
        </ol>
      </div>
    </article>
  );
};
