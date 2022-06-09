import { Component, JSX, onCleanup, ParentProps } from "solid-js";

type Props = ParentProps<
  Pick<JSX.HTMLAttributes<HTMLDivElement>, "onClick">
> & {
  ref?: HTMLElement;
};

export const JournalEntryCard: Component<Props> = (props) => {
  return (
    <article
      ref={props.ref}
      class="relative p-6 rounded-lg bg-base-100 transition-all ease-in-out duration-200 outline outline-1 outline-base-200 hover:outline-secondary-focus"
      onClick={props.onClick}
    >
      {props.children}
    </article>
  );
};
