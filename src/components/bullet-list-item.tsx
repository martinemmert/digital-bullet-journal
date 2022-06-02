import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  Show,
} from "solid-js";
import { formatTime } from "../lib/utils/format-time";
import {
  Bullet,
  bulletCollection,
  createDeleteBulletMutation,
  createUpdateBulletMutation,
} from "../store/bullet-collection";
import { generateHtml, TextEditor } from "./text-editor";
import { Editor } from "@tiptap/core";
import { HashtagPluginKey } from "../lib/editor/extensions/hashtags";

type Props = {
  id: string;
};

export const BulletListItem: Component<Props> = (props) => {
  const [editor, setEditor] = createSignal<Editor>();
  const [bullet, setBullet] = createSignal<Bullet>();
  const [editing, setEditing] = createSignal(false);
  const [updating, updateBullet] = createUpdateBulletMutation();
  const [deleting, deleteBullet] = createDeleteBulletMutation();

  const content = createMemo(() => {
    if (!bullet()) return null;
    return generateHtml(bullet().content);
  });

  createEffect(() => {
    const item = bulletCollection.find((item) => item.id === props.id);
    setBullet(item as Bullet);
  });

  createEffect(() => {
    editor()?.commands.focus();
  });

  function startEditing() {
    setEditing(true);
  }

  function submit() {
    if (editor().isEmpty) {
      void deleteBullet(props.id);
    } else {
      void updateBullet(props.id, {
        content: editor().getJSON(),
        tags: HashtagPluginKey.getState(editor().state),
      });
    }
    stopEditing();
  }

  function stopEditing() {
    setEditing(false);
  }

  return (
    <Show when={bullet()}>
      <li class="-ml-4">
        <header class="flex items-center space-x-2 mb-2">
          <span class="flex items-center justify-center w-8 h-8 bg-base-100 rounded-full">
            <span class="block w-4 h-4 ring-base-100 bg-base-300 rounded-full"></span>
          </span>
          <p class="block text-sm font-normal leading-none text-secondary-content">
            <time class="mr-2 opacity-50">
              {formatTime(bullet().created_at)}
            </time>
            <Show when={bullet().type === "note"}>
              <span class="text-sm">✏️</span>
            </Show>
            <Show when={bullet().type === "todo"}>
              <span class="text-sm">✅</span>
            </Show>
            <Show when={bullet().type === "event"}>
              <span class="text-sm">📅</span>
            </Show>
            <Show when={bullet().type === "idea"}>
              <span class="text-sm">💡</span>
            </Show>
          </p>
          <button
            onClick={() => deleteBullet(props.id)}
            type="button"
            class="btn btn-xs btn-outline btn-error"
          >
            Delete
          </button>
        </header>
        <div class="pb-2 ml-10">
          <Show when={editing() === false}>
            <p
              onClick={startEditing}
              innerHTML={content()}
              class="textarea text-sm prose"
            />
          </Show>
          <Show when={editing()}>
            {/*@ts-ignore */}
            <div class="bg-base-300 p-4 rounded-box -ml-4 flex flex-col space-y-4">
              <TextEditor
                editorRef={setEditor}
                initialContent={bullet().content}
                onSubmit={(editor) => {
                  stopEditing();
                  if (editor.isEmpty) {
                    void deleteBullet(props.id);
                  } else {
                    void updateBullet(props.id, {
                      content: editor.getJSON(),
                    });
                  }
                }}
                onCancel={() => {
                  stopEditing();
                }}
              />
              <div class="flex justify-end space-x-4">
                <button
                  class="btn btn-sm btn-outline"
                  classList={{ loading: updating() }}
                  disabled={updating()}
                  onClick={stopEditing}
                >
                  Cancel
                </button>
                <button
                  class="btn btn-sm btn-primary"
                  classList={{ loading: updating() }}
                  disabled={updating()}
                  onClick={submit}
                >
                  Save
                </button>
              </div>
            </div>
          </Show>
        </div>
      </li>
    </Show>
  );
};
