import { baseKeymap } from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";
import { history, redo, undo } from "prosemirror-history";
import { editorSchema } from "./editor-schema";
import {
  liftListItem,
  sinkListItem,
  splitListItem,
} from "prosemirror-schema-list";

export function getEditorPlugins(plugins = []) {
  const editorKeymap = keymap({
    ...baseKeymap,
    "Mod-z": undo,
    "Mod-y": redo,
    "Alt-Enter": splitListItem(editorSchema.nodes.bullet_list_item),
    Tab: sinkListItem(editorSchema.nodes.bullet_list_item),
    "Shift-Tab": liftListItem(editorSchema.nodes.bullet_list_item),
  });

  return plugins.concat([editorKeymap, history()]);
}
