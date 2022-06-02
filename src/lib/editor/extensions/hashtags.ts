import { InputRule, mergeAttributes, Node } from "@tiptap/core";
import { Node as ProsemirrorNode } from "prosemirror-model";
import { Plugin, PluginKey } from "prosemirror-state";

export type HashtagOptions = {
  HTMLAttributes: Record<string, any>;
  // renderLabel: (props: {
  //   options: HashtagOptions;
  //   node: ProseMirrorNode;
  // }) => string;
};

const REGEXP = /(?:^|\s)(#(\w+))$/;

export const HashtagPluginKey = new PluginKey("hashtag");

export const Hashtag = Node.create<HashtagOptions>({
  name: "hashtag",
  group: "inline",
  inline: true,
  content: "text*",
  selectable: false,
  marks: "",

  addKeyboardShortcuts() {
    return {
      // TODO: fix this via InputRule
      Space: () =>
        this.editor.commands.command(({ tr, state, chain }) => {
          console.log("SPACE");
          const { selection } = tr;
          const { $anchor } = selection;

          const nodeType = state.schema.nodes.hashtag;

          // BUG: sometimes pressing space does not exit the hashtag node
          if ($anchor.parent.type === nodeType) {
            console.log("we are in the hashtag");
            const start = $anchor.start($anchor.depth);
            const end = $anchor.end($anchor.depth);
            const textBefore = $anchor.nodeBefore?.textContent ?? "";
            const textAfter = $anchor.nodeAfter?.textContent;

            if (!textAfter) {
              chain().insertContentAt(end + 1, " ", { updateSelection: true });
              return true;
            }

            const match = textBefore.match(REGEXP);

            if (match) {
              const [, , tag] = match;
              tr.setNodeMarkup($anchor.before(), undefined, {
                "data-tag": tag,
              });
              tr.delete($anchor.pos, end);
              tr.insertText(` ${textAfter}`, tr.mapping.map(end) + 1);
            } else {
              tr.delete(start, end);
              tr.insertText(`# ${textAfter}`, tr.mapping.map(end) + 1);
            }

            return true;
          }

          return false;
        }),
    };
  },

  addOptions() {
    return {
      HTMLAttributes: {
        "data-type": this.name,
        class: "link link-accent",
      },
    };
  },

  addInputRules() {
    return [
      new InputRule({
        find: REGEXP,
        handler: ({ state, range, match }) => {
          let { tr } = state;
          const [matched, hashtag, tag] = match;
          const nodeType = state.schema.nodes.hashtag;
          const offset = matched.length - hashtag.length;
          const { from: start, to: end } = range;
          const $start = tr.doc.resolve(start);

          const isHashtag = $start.parent.type === nodeType;

          // input rules match only until the selections current position
          // so if we are in the middle of our hashtag, we have to add the slice
          // after the position, or it will be overwritten
          const prevContent = isHashtag ? $start.parent.textContent : "";
          const slice = prevContent.slice(tag.length);
          const newContent = `${tag}${slice}`;

          const from = isHashtag ? $start.before() : start + offset;
          const to = isHashtag ? $start.end() : end; // +1 because we add the #

          tr.replaceWith(
            from,
            to,
            nodeType.create(
              {
                tag: newContent,
                from,
                to: to + 1, // we want the outer borders,
              },
              state.schema.text(`#${newContent}`)
            )
          );
        },
      }),
    ];
  },

  addAttributes() {
    return {
      tag: {
        parseHTML: (element) => element.getAttribute("data-tag"),
        renderHTML: (attributes) => {
          if (!attributes.tag) return {};
          return { "data-tag": attributes.tag };
        },
      },

      from: {
        parseHTML: (element) => element.getAttribute("data-from"),
        renderHTML: (attributes) => {
          if (!attributes.from) return {};
          return { "data-from": attributes.from };
        },
      },

      to: {
        parseHTML: (element) => element.getAttribute("data-from"),
        renderHTML: (attributes) => {
          if (!attributes.to) return {};
          return { "data-to": attributes.to };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        // match tag with following CSS Selector
        tag: "a[data-type='tag'][data-tag]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "a",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addProseMirrorPlugins() {
    const plugin = new Plugin({
      key: HashtagPluginKey,
      state: {
        init(config, state) {
          return [];
        },
        apply(tr, value, oldState, newState) {
          const { doc } = newState;
          const tags = [];
          doc.forEach((node) => {
            recursiveNodeIteration(
              node,
              (node: ProsemirrorNode) => {
                tags.push({
                  tag: node.attrs.tag,
                  from: tr.mapping.map(node.attrs.from),
                  to: tr.mapping.map(node.attrs.to),
                });
              },
              (node: ProsemirrorNode) => {
                return node.type === newState.schema.nodes.hashtag;
              }
            );
          });

          return tags;
        },
        toJSON(value) {
          return value;
        },
      },
    });
    return [plugin];
  },
});

function recursiveNodeIteration(node: ProsemirrorNode, action, filter) {
  node.forEach((node, _offset, _index) => {
    if (filter && filter(node, _offset, _index)) {
      action?.(node, _offset, _index);
    }
    recursiveNodeIteration(node, action, filter);
  });
}
