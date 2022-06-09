import { Component, onMount } from "solid-js";
import { createEditorView } from "./editor-view";
import { createEditorState } from "./editor-state";

export const Editor: Component = () => {
  let editorEL;

  onMount(() => {
    const view = createEditorView(editorEL, createEditorState());
  });

  // return (
  //   <div class="space-y-4 max-w-3xl mx-auto">
  //     <article class="relative p-6 rounded-lg bg-base-100 transition-all ease-in-out duration-200 outline outline-1 outline-base-200 hover:outline-secondary-focus">
  //       <header>
  //         <h2 class="mb-4 text-2xl font-serif font-semibold text-primary">
  //           Workshop Title
  //         </h2>
  //         <p class="absolute top-4 right-4 text-xs opacity-50">
  //           31.12.2022 12:00
  //         </p>
  //         <div class="absolute flex items-center justify-center block top-1/2 -mt-4 -right-4 w-8 h-8 bg-base-100 border-0 border-base-200 rounded-full text-secondary">
  //           <svg
  //             xmlns="http://www.w3.org/2000/svg"
  //             class="h-5 w-5"
  //             viewBox="0 0 20 20"
  //             fill="currentColor"
  //           >
  //             <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
  //           </svg>
  //         </div>
  //       </header>
  //       <section class="space-y-2 font-light">
  //         <p>
  //           A{" "}
  //           <span class="text-accent-focus bg-base-100 px-1.5 rounded">
  //             #react
  //           </span>{" "}
  //           component that will be{" "}
  //           <span class="font-semibold italic">wrapped</span> around items that
  //           have an optional tooltip. You can use this to inject your own
  //           tooltip library into the editor – the component will be passed the
  //           following props:
  //         </p>
  //         <ul class="list-inside list-disc space-y-1">
  //           <li class="list-item">
  //             tooltip: A React node with the tooltip content
  //           </li>
  //           <li>placement: Enum top, bottom, left, right</li>
  //           <li>
  //             children: The component that the tooltip wraps, must be rendered
  //           </li>
  //         </ul>
  //       </section>
  //     </article>
  //     <article class="relative p-6 rounded-lg bg-base-100 transition-all ease-in-out duration-200 outline outline-1 outline-accent">
  //       <header>
  //         <div class="absolute flex items-center justify-center block top-1/2 -mt-4 -right-4 w-8 h-8 bg-base-100 rounded-full text-secondary">
  //           <svg
  //             xmlns="http://www.w3.org/2000/svg"
  //             class="h-5 w-5"
  //             viewBox="0 0 20 20"
  //             fill="currentColor"
  //           >
  //             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  //           </svg>
  //         </div>
  //         <p class="absolute top-4 right-4 text-xs opacity-50">
  //           31.12.2022 12:00
  //         </p>
  //       </header>
  //       <section class="space-y-2 outline-0" contenteditable>
  //         <ul class="list-inside list-disc space-y-1">
  //           <li class="list-item">
  //             tooltip: A React node with the tooltip content
  //           </li>
  //           <li>placement: Enum top, bottom, left, right</li>
  //           <li>
  //             children: The component that the tooltip wraps, must be rendered
  //           </li>
  //         </ul>
  //       </section>
  //       <menu class="flex space-x-3 justify-end bg-base-100 border-t border-base-200 -m-6 mt-3 p-6 py-3">
  //         <li>
  //           <button class="btn btn-xs btn-ghost text-base-content opacity-75 gap-1.5">
  //             <svg
  //               xmlns="http://www.w3.org/2000/svg"
  //               class="h-3 w-3"
  //               viewBox="0 0 20 20"
  //               fill="currentColor"
  //             >
  //               <path
  //                 fill-rule="evenodd"
  //                 d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
  //                 clip-rule="evenodd"
  //               />
  //             </svg>
  //             <span>Cancel</span>
  //           </button>
  //         </li>
  //         <li>
  //           <button class="btn btn-xs btn-accent text-base-100 gap-1.5">
  //             <svg
  //               xmlns="http://www.w3.org/2000/svg"
  //               class="h-3 w-3"
  //               viewBox="0 0 20 20"
  //               fill="currentColor"
  //             >
  //               <path
  //                 fill-rule="evenodd"
  //                 d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
  //                 clip-rule="evenodd"
  //               />
  //             </svg>
  //             <span>Save</span>
  //           </button>
  //         </li>
  //       </menu>
  //     </article>
  //     <article class="relative p-6 rounded-lg bg-base-100 transition-all ease-in-out duration-200 outline outline-1 outline-base-200 hover:outline-secondary-focus">
  //       <header>
  //         <div class="absolute flex items-center justify-center block top-1/2 -mt-4 -right-4 w-8 h-8 bg-base-100 border-0 border-base-200 rounded-full text-secondary">
  //           <svg
  //             xmlns="http://www.w3.org/2000/svg"
  //             class="h-5 w-5"
  //             viewBox="0 0 20 20"
  //             fill="currentColor"
  //           >
  //             <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  //           </svg>
  //         </div>
  //         <p class="absolute top-4 right-4 text-xs opacity-50">
  //           31.12.2022 12:00
  //         </p>
  //       </header>
  //       <section class="space-y-2">
  //         <p>
  //           A{" "}
  //           <span class="text-accent-focus bg-base-100 px-1.5 rounded">
  //             #react
  //           </span>{" "}
  //           component that will be wrapped around items that have an optional
  //           tooltip. You can use this to inject your own tooltip library into
  //           the editor – the component will be passed the following props:
  //         </p>
  //       </section>
  //     </article>
  //   </div>
  // );

  return <div ref={editorEL} />;
};
