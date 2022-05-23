import {
  Component,
  createEffect,
  createSignal,
  onCleanup,
  Show,
} from "solid-js";
import { formatTime } from "../lib/utils/format-time";
import {
  Bullet,
  bulletCollection,
  createDeleteBulletMutation,
  createUpdateBulletMutation,
} from "../store/bullet-collection";

type Props = {
  id: string;
};

export const BulletListItem: Component<Props> = (props) => {
  let textarea;

  const [bullet, setBullet] = createSignal<Bullet>();
  const [inputValue, setInputValue] = createSignal("");
  const [editing, setEditing] = createSignal(false);
  const [updating, updateBullet] = createUpdateBulletMutation();
  const [deleting, deleteBullet] = createDeleteBulletMutation();

  createEffect(() => {
    const item = bulletCollection.find((item) => item.id === props.id);
    setBullet(item);
    setInputValue(item.content);
  });

  function startEditing() {
    setEditing(true);
    textarea.focus();
  }

  function stopEditing() {
    setEditing(false);
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && event.altKey) {
      stopEditing();
      void updateBullet(props.id, { content: inputValue() });
    }

    if (event.key === "Escape") {
      setInputValue(bullet().content);
      setEditing(false);
    }
  }

  function closeOnClickOutSide(el, callback) {
    const onClick = (event) => !el.contains(event.target) && callback()?.();
    document.body.addEventListener("click", onClick);
    onCleanup(() => document.body.removeEventListener("click", onClick));
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
        <div class="pb-2 ml-10 text-primary-content opacity-75 whitespace-pre-line">
          <Show when={editing() === false}>
            <p onClick={startEditing}>{bullet().content}</p>
          </Show>
          <Show when={editing()}>
            <textarea
              ref={textarea}
              name="content"
              class="textarea bg-base-300 w-full"
              placeholder="type something"
              value={inputValue()}
              onKeyDown={onKeyDown}
              onInput={(event) => setInputValue(event.currentTarget.value)}
              // @ts-ignore
              use:closeOnClickOutSide={() => stopEditing()}
            />
          </Show>
        </div>
      </li>
    </Show>
  );
};
