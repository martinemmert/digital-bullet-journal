import { Component, createMemo } from "solid-js";

type Props = {
  date: string;
};

export const JournalEntryDate: Component<Props> = (props) => {
  const date = createMemo(() => new Date(props.date));

  const formattedDate = createMemo(() => {
    return date().toLocaleDateString("de", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  });

  return (
    <p class="absolute top-2 right-2 text-xs text-gray-300">
      {formattedDate()}
    </p>
  );
};
