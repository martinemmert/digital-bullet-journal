import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  Show,
} from "solid-js";
import { JournalEntryContentWrapper } from "./journal-entry/journal-entry-content-wrapper";
import { JournalEntryEditorActions } from "./journal-entry/journal-entry-editor-actions";
import { JournalEntryType } from "./journal-entry/journal-entry-type";
import { JournalEntryDate } from "./journal-entry/journal-entry-date";
import { JournalEntryCard } from "./journal-entry/journal-entry-card";
import { Editor as TipTapEditor } from "@tiptap/core";
import { Editor, generateHtml } from "../editor/editor";
import {
  Bullet,
  bulletCollection,
  createDeleteBulletMutation,
  createUpdateBulletMutation,
} from "../../store/bullet-collection";
import { selectedJournalEntry, setSelectedJournalEntry } from "./journal-store";
import { HashtagPluginKey } from "../editor/extensions/hashtags";

type Props = {
  id?: string;
};

export const JournalEntry: Component<Props> = (props) => {
  let outerEl: HTMLElement;
  const [editor, setEditor] = createSignal<TipTapEditor>(null);
  const [editing, setEditing] = createSignal(false);
  const [journalEntry, setJournalEntry] = createSignal<Bullet>();
  const [updating, updateBullet] = createUpdateBulletMutation(props.id);
  const [deleting, deleteBullet] = createDeleteBulletMutation(props.id);

  createEffect(() => setEditing(selectedJournalEntry() === props.id));

  const content = createMemo(() => {
    if (!journalEntry()) return null;
    return generateHtml(journalEntry().content);
  });

  createEffect(() => {
    if (journalEntry()?.content && editor())
      editor().commands.setContent(journalEntry().content);
  });

  createEffect(() => {
    const item = bulletCollection.find((item) => item.id === props.id);
    setJournalEntry(item as Bullet);
  });

  async function onSave() {
    if (!editor()) return null;

    if (editor().isEmpty) {
      await deleteBullet(props.id);
      stopEditing();
    } else {
      await updateBullet(props.id, {
        content: editor().getJSON(),
        tags: HashtagPluginKey.getState(editor().state),
      });
      stopEditing();
    }
  }

  async function onDelete() {
    await deleteBullet(props.id);
    stopEditing();
  }

  function startEditing() {
    setSelectedJournalEntry(props.id);
    editor()?.commands.focus();
  }

  function stopEditing() {
    setSelectedJournalEntry(null);
    editor()?.commands.blur();
  }

  function isClickOutside(el: EventTarget) {
    return !outerEl.contains(el as HTMLElement);
  }

  function handleClickOutside(event: MouseEvent) {
    if (!isClickOutside(event.target)) {
      editor()?.commands.focus();
      return;
    }
    stopEditing();
  }

  createEffect(() => {
    if (editing()) {
      document.body.addEventListener("click", handleClickOutside);
    } else {
      document.body.removeEventListener("click", handleClickOutside);
    }
  });

  onCleanup(() => {
    document.body.removeEventListener("click", handleClickOutside);
  });

  return (
    <JournalEntryCard onClick={startEditing} ref={outerEl}>
      <JournalEntryType />
      <JournalEntryDate date={journalEntry()?.created_at} />
      {/*<Show when={!editing()}>*/}
      {/*  <JournalEntryContentWrapper>*/}
      {/*    <div innerHTML={content()} />*/}
      {/*  </JournalEntryContentWrapper>*/}
      {/*</Show>*/}
      <JournalEntryContentWrapper>
        <Editor
          editorRef={setEditor}
          initialContent={journalEntry()?.content}
          disabled={updating() || deleting()}
          onSubmit={onSave}
          onCancel={stopEditing}
        />
      </JournalEntryContentWrapper>
      <Show when={editing()}>
        <JournalEntryEditorActions
          onCancel={stopEditing}
          onSave={onSave}
          onDelete={onDelete}
          deleteLoading={deleting()}
          deleteDisabled={updating() || deleting()}
          saveLoading={updating() || deleting()}
          saveDisabled={updating() || deleting()}
          cancelDisabled={updating() || deleting()}
        />
      </Show>
    </JournalEntryCard>
  );
};
