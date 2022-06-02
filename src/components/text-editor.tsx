import { Component, createEffect, onCleanup, onMount, Setter } from "solid-js";
import { Editor, Extension, generateHTML, JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Hashtag } from "../lib/editor/extensions/hashtags";

type Props = {
  editorRef?: Setter<Editor>;
  initialContent?: JSONContent;
  onFocus?: (editor: Editor) => void;
  onBlur?: (editor: Editor) => void;
  onSubmit?: (editor: Editor) => void;
  onCancel?: (editor: Editor) => void;
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

export const TextEditor: Component<Props> = (props) => {
  let editorElement;
  let editor: Editor;

  function onSubmit(editor: Editor) {
    props.onSubmit?.(editor);
  }

  function onCancel(editor: Editor) {
    props.onCancel?.(editor);
  }

  onMount(() => {
    editor = new Editor({
      element: editorElement,
      editorProps: {
        attributes: {
          class: "textarea transition-none text-sm prose max-w-none",
        },
      },
      extensions: [
        Shortcuts({
          "Alt-Enter": onSubmit,
          Escape: onCancel,
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

    props.editorRef(editor);
  });

  createEffect(() => {
    editor.setEditable(!props.disabled);
  });

  createEffect(() => {
    editor.commands.setContent(props.initialContent, false);
  });

  onCleanup(() => {
    if (!editor.isDestroyed) editor.destroy();
  });

  return <div ref={editorElement}></div>;
};
