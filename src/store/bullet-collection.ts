import { createStore } from "solid-js/store";
import { session, supabase } from "../lib/supabase-client";
import { definitions } from "../../@types/supabase";
import { Accessor, createEffect, createSignal } from "solid-js";
import { PostgrestError, RealtimeSubscription } from "@supabase/supabase-js";
import { JSONContent } from "@tiptap/core";

export type Bullet = Omit<definitions["bullets"], "content"> & {
  content: JSONContent;
};

interface UpdateMutator<
  D = Partial<Pick<Bullet, "content" | "tags" | "type">>
> {
  (id: string, data: D): Promise<void>;
}

interface DeleteMutator {
  (id: string): Promise<void>;
}

const updateMutations = new Map<string, [Accessor<boolean>, UpdateMutator]>();
const deleteMutations = new Map<string, [Accessor<boolean>, DeleteMutator]>();

let bulletSubscription: RealtimeSubscription;

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

  function mutate(data: Pick<Bullet, "content" | "tags" | "type">) {
    setLoading(true);
    return fromBullets()
      .insert({ ...data })
      .then(() => setLoading(false));
  }

  return [loading, mutate] as [typeof loading, typeof mutate];
}

function createUpdateBulletMutation(cacheId?: string) {
  if (cacheId && updateMutations.has(cacheId))
    return updateMutations.get(cacheId);

  const [loading, setLoading] = createSignal(false);

  async function mutate(
    id: string,
    data: Partial<Pick<Bullet, "content" | "tags" | "type">>
  ) {
    setLoading(true);
    await fromBullets()
      .update({ ...data })
      .match({ id });
    setLoading(false);
  }

  if (cacheId) updateMutations.set(cacheId, [loading, mutate]);

  return [loading, mutate] as [typeof loading, typeof mutate];
}

function createDeleteBulletMutation(cacheId?: string) {
  if (cacheId && deleteMutations.has(cacheId))
    return deleteMutations.get(cacheId);

  const [loading, setLoading] = createSignal(false);

  async function mutate(id: string) {
    setLoading(true);
    await fromBullets().delete().match({ id });
    setLoading(false);
  }

  if (cacheId) deleteMutations.set(cacheId, [loading, mutate]);

  return [loading, mutate] as [typeof loading, typeof mutate];
}

// subscribe to events and update the store
const subscribeToBulletUpdates = async () => {
  if (bulletSubscription) return bulletSubscription;

  const client = fromBullets().on(
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
        deleteMutations.delete(oldItem.id);
        newCollection.splice(index, 1);
        setBulletCollection(newCollection);
      }
    }
  );

  bulletSubscription = client.subscribe();
  console.log("subscribed to bullets");
  return bulletSubscription;
};

const unsubscribeFromBulletUpdates = async () => {
  if (!bulletSubscription) return;
  await supabase.removeSubscription(bulletSubscription);
  console.log("unsubscribed from bullets");
};

export {
  bulletCollection,
  createLoadBulletCollectionQuery,
  createAddBulletMutation,
  createUpdateBulletMutation,
  createDeleteBulletMutation,
  subscribeToBulletUpdates,
  unsubscribeFromBulletUpdates,
};
