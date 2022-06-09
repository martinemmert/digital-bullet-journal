import { EditorState } from "prosemirror-state";
import { Node } from "prosemirror-model";
import { getEditorPlugins } from "./editor-plugins";
import { editorSchema } from "./editor-schema";

export function createEditorState(doc: Node = undefined) {
  return EditorState.create({
    // doc,
    plugins: getEditorPlugins(),
    schema: editorSchema,
  });
}
