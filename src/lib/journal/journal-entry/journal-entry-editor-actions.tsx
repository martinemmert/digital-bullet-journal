import { Component, Show } from "solid-js";

type Props = {
  saveLabel?: string;
  saveDisabled?: boolean;
  saveLoading?: boolean;
  cancelLabel?: string;
  cancelDisabled?: boolean;
  cancelLoading?: boolean;
  deleteLabel?: string;
  deleteDisabled?: boolean;
  deleteLoading?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
};

export const JournalEntryEditorActions: Component<Props> = (props) => {
  return (
    <menu class="flex flex-row-reverse bg-base-100 border-t border-base-200 -m-6 mt-10 p-6 py-3">
      <Show when={props.onSave}>
        <li class="block ml-3">
          <button
            class="btn btn-xs btn-accent text-base-100"
            classList={{
              "gap-1.5": !props.saveLoading,
              loading: props.saveLoading,
            }}
            onClick={props.onSave}
            disabled={props.saveDisabled}
          >
            <Show when={!props.saveLoading}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </Show>
            <span>{props.saveLabel ?? "Save"}</span>
          </button>
        </li>
      </Show>
      <Show when={props.onCancel}>
        <li class="block ml-auto">
          <button
            class="btn btn-xs btn-ghost text-base-content opacity-75 gap-1.5"
            onClick={props.onCancel}
            disabled={props.cancelLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3 w-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{props.cancelLabel ?? "Cancel"}</span>
          </button>
        </li>
      </Show>
      <Show when={props.onDelete}>
        <li class="block mr-auto">
          <button
            class="btn btn-xs btn-outline btn-error"
            onClick={props.onDelete}
            disabled={props.deleteDisabled}
          >
            <Show when={props.deleteLoading}>
              <svg
                class="animate-spin h-3 w-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </Show>
            <Show when={!props.deleteLoading}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                  clip-rule="evenodd"
                />
              </svg>
            </Show>
            <span class="sr-only">{props.deleteLabel ?? "Delete"}</span>
          </button>
        </li>
      </Show>
    </menu>
  );
};
