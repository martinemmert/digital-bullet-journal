import { Component, createSignal } from "solid-js";
import { JournalEntryContentWrapper } from "./journal-entry/journal-entry-content-wrapper";
import { JournalEntryEditorActions } from "./journal-entry/journal-entry-editor-actions";
import { JournalEntryCard } from "./journal-entry/journal-entry-card";
import { Editor as TipTapEditor } from "@tiptap/core";
import { Editor } from "../editor/editor";
import { createAddBulletMutation } from "../../store/bullet-collection";
import { HashtagPluginKey } from "../editor/extensions/hashtags";

export const NewJournalEntry: Component = () => {
  const [editor, setEditor] = createSignal<TipTapEditor>(null);
  const [adding, addBullet] = createAddBulletMutation();
  const [empty, setEmpty] = createSignal(true);

  async function onSave() {
    if (!editor() || editor().isEmpty) return null;

    await addBullet({
      content: editor().getJSON(),
      tags: HashtagPluginKey.getState(editor().state),
    });

    editor().commands.clearContent(true);
  }

  function onUpdate() {
    setEmpty(editor()?.isEmpty);
  }

  return (
    <JournalEntryCard onClick={() => editor().commands.focus()}>
      <JournalEntryContentWrapper>
        <Editor
          editorRef={setEditor}
          disabled={adding()}
          onUpdate={onUpdate}
          onSubmit={onSave}
        />
      </JournalEntryContentWrapper>
      <JournalEntryEditorActions
        saveLabel="add"
        onSave={onSave}
        saveLoading={adding()}
        saveDisabled={empty() || adding()}
      />
    </JournalEntryCard>
  );
};
