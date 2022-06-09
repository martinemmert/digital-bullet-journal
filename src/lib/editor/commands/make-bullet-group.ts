import { findWrapping } from "prosemirror-transform";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { editorSchema } from "../_prose-mirror/editor-schema";

export function makeBulletGroup(
  state: EditorState,
  dispatch?: EditorView["dispatch"]
) {
  const range = state.selection.$from.blockRange(state.selection.$to);
  const wrapping = findWrapping(range, editorSchema.nodes.bulletGroup);
  if (!wrapping) return false;
  if (dispatch) dispatch(state.tr.wrap(range, wrapping).scrollIntoView());
  return true;
}
