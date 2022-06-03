import { Component } from "solid-js";

type Props = {};

export const HashtagList: Component<Props> = (props) => {
  return (
    <div class="">
      <ul>
        <li>
          <a href="/tag/Hashtag" class="link link-accent link-hover">
            #Hashtag
          </a>
        </li>
      </ul>
    </div>
  );
};
