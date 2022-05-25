import { createStore } from "solid-js/store";
import { session, supabase } from "../lib/supabase-client";
import { definitions } from "../../@types/supabase";
import { createEffect, createSignal } from "solid-js";
import { PostgrestError } from "@supabase/supabase-js";
import { JSONContent } from "@tiptap/core";

export type Bullet = Omit<definitions["bullets"], "content"> & {
  content: JSONContent;
};

const [bulletCollection, setBulletCollection] = createStore<Bullet[]>([]);

function fromBullets() {
  return supabase.from<Bullet>("bullets");
}

function createLoadBulletCollectionQuery() {
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<PostgrestError | null>(null);

  function query() {
    setLoading(true);
    fromBullets()
      .select()
      .order("created_at", { ascending: false })
      .then((result) => {
        setError(result.error);
        setBulletCollection(result.data);
        setLoading(false);
      });
  }

  return [loading, error, query] as [
    typeof loading,
    typeof error,
    typeof query
  ];
}

function createAddBulletMutation() {
  const [loading, setLoading] = createSignal(false);

  function mutate(data: Pick<Bullet, "content" | "type">) {
    setLoading(true);
    return fromBullets()
      .insert({ ...data })
      .then(() => setLoading(false));
  }

  return [loading, mutate] as [typeof loading, typeof mutate];
}

function createUpdateBulletMutation() {
  const [loading, setLoading] = createSignal(false);

  function mutate(id: string, data: Partial<Pick<Bullet, "content" | "type">>) {
    setLoading(true);
    return fromBullets()
      .update({ ...data })
      .match({ id })
      .then(() => setLoading(false));
  }

  return [loading, mutate] as [typeof loading, typeof mutate];
}

function createDeleteBulletMutation() {
  const [loading, setLoading] = createSignal(false);

  function mutate(id: string) {
    setLoading(true);
    return fromBullets()
      .delete()
      .match({ id })
      .then(() => setLoading(false));
  }

  return [loading, mutate] as [typeof loading, typeof mutate];
}

let subscription;

// subscribe to events and update the store
const subscribeToBulletUpdates = fromBullets().on(
  "*",
  ({ eventType, new: newItem, old: oldItem }) => {
    if (eventType === "INSERT") {
      setBulletCollection([newItem, ...bulletCollection]);
    }

    if (eventType === "UPDATE") {
      const newCollection = [...bulletCollection];
      const index = bulletCollection.findIndex(
        (item) => item.id === newItem.id
      );

      newCollection.splice(index, 1, newItem);
      setBulletCollection(newCollection);
    }

    if (eventType === "DELETE") {
      const newCollection = [...bulletCollection];
      const index = bulletCollection.findIndex(
        (item) => item.id === oldItem.id
      );
      newCollection.splice(index, 1);
      setBulletCollection(newCollection);
    }
  }
);

export {
  bulletCollection,
  createLoadBulletCollectionQuery,
  createAddBulletMutation,
  createUpdateBulletMutation,
  createDeleteBulletMutation,
  subscribeToBulletUpdates,
};
