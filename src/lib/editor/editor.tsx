import { Component, onCleanup, onMount } from "solid-js";
import {
  Editor as TipTapEditor,
  Extension,
  generateHTML,
  JSONContent,
} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Hashtag } from "./extensions/hashtags";
import { Transaction } from "prosemirror-state";

type Props = {
  editorRef?: (editor: TipTapEditor) => void;
  initialContent?: JSONContent;
  onUpdate?: (data: { editor: TipTapEditor; transaction: Transaction }) => void;
  onFocus?: (data: {
    editor: TipTapEditor;
    event: FocusEvent;
    transaction: Transaction;
  }) => void;
  onBlur?: (data: {
    editor: TipTapEditor;
    event: FocusEvent;
    transaction: Transaction;
  }) => void;
  onSubmit?: (editor?: TipTapEditor) => void;
  onCancel?: (editor?: TipTapEditor) => void;
  disabled?: boolean;
};

export function generateHtml(json: JSONContent) {
  return generateHTML(json, [
    StarterKit.configure({
      horizontalRule: false,
      heading: false,
    }),
    Hashtag,
  ]);
}

const Shortcuts = ({ ["Alt-Enter"]: altEnter, ["Escape"]: escape }) =>
  Extension.create({
    name: "shortcuts",
    addKeyboardShortcuts() {
      return {
        "Alt-Enter": () => {
          altEnter(this.editor);
          return true;
        },
        Escape: () => {
          escape(this.editor);
          return true;
        },
      };
    },
  });

export const Editor: Component<Props> = (props) => {
  let editorElement;
  let editor: TipTapEditor;

  onMount(() => {
    editor = new TipTapEditor({
      element: editorElement,
      editorProps: {
        attributes: {
          class: "outline-none",
        },
      },
      extensions: [
        Shortcuts({
          "Alt-Enter": (editor: TipTapEditor) =>
            props.onSubmit && props.onSubmit(editor),
          Escape: (editor: TipTapEditor) =>
            props.onCancel && props.onCancel(editor),
        }),
        StarterKit.configure({
          horizontalRule: false,
          heading: false,
        }),
        Hashtag,
      ],
      content: props.initialContent,
      editable: !props.disabled,
    });

    if (props.onUpdate) editor.on("update", props.onUpdate);
    if (props.onFocus) editor.on("focus", props.onFocus);
    if (props.onBlur) editor.on("blur", props.onBlur);

    props.editorRef?.(editor);
  });

  onCleanup(() => {
    if (!editor.isDestroyed) editor.destroy();
  });

  return <div ref={editorElement}></div>;
};
