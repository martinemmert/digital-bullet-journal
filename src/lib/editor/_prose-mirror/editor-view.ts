import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";

export function createEditorView(
  editorElement: HTMLElement,
  state: EditorState
) {
  return new EditorView(editorElement, {
    state,
  });
}
