import { createSignal } from "solid-js";

const [selectedJournalEntry, setSelectedJournalEntry] = createSignal<
  string | null
>();

export { selectedJournalEntry, setSelectedJournalEntry };
