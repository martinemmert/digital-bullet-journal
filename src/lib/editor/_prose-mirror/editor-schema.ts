import { Schema } from "prosemirror-model";
import { marks } from "prosemirror-schema-basic";

export const editorSchema = new Schema({
  nodes: {
    doc: {
      content: "bullet_list",
    },

    text: {
      group: "inline",
    },

    hard_break: {
      inline: true,
      group: "inline",
      selectable: false,
      parseDOM: [{ tag: "br" }],
      toDOM() {
        return ["br"];
      },
    },

    paragraph: {
      content: "(text|hard_break)*",
      parseDOM: [{ tag: "p" }],
      toDOM() {
        return ["p", 0];
      },
    },

    bullet_list: {
      content: "bullet_list_item+",
      parseDOM: [{ tag: "ul" }],
      toDOM() {
        return ["ul", 0];
      },
    },

    bullet_list_item: {
      content: "paragraph+ bullet_list?",
      defining: false,
      toDOM() {
        return ["li", 0];
      },
      parseDOM: [{ tag: "li" }],
    },
  },
  marks,
});
