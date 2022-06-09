import { Component, ParentProps } from "solid-js";

export const JournalEntryContentWrapper: Component<ParentProps> = (props) => {
  return (
    <section class="prose max-w-none font-light -my-5">
      {props.children}
    </section>
  );
};
