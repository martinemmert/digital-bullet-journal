import { Component, createEffect, createSignal } from "solid-js";
import { session, supabase } from "../lib/supabase-client";
import { useNavigate } from "solid-app-router";

export const AuthPage: Component = () => {
  const navigate = useNavigate();

  createEffect(() => {
    if (session()) navigate("/", { replace: true });
  });

  const [loading, setLoading] = createSignal(false);
  const [email, setEmail] = createSignal("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email: email() });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex items-center min-h-full">
      <div
        class="card card-side max-w-3xl mx-auto bg-base-300 shadow-xl"
        aria-live="polite"
      >
        <figure class="overflow-hidden max-h-96 max-w-xs">
          <img
            src="/images/estee-janssens-hb00NH1JXh0-unsplash.jpeg"
            alt="flat lane photo of book and highlighters"
            title="Photo by Estée Janssens on Unsplash"
          />
        </figure>
        <form class="card-body" onSubmit={handleLogin}>
          <h1 class="card-title">Digital Bullet Journal</h1>
          <p class="text-sm">Sign in via magic link with your email below</p>
          <fieldset class="form-control">
            <input
              id="email"
              class="input input-bordered"
              type="email"
              placeholder="Your email"
              value={email()}
              disabled={loading()}
              onInput={(e) => setEmail(e.currentTarget.value)}
            />
          </fieldset>
          <button
            class="btn btn-primary"
            classList={{ loading: loading() }}
            disabled={loading()}
            aria-live="polite"
          >
            Send magic link
          </button>
        </form>
      </div>
    </div>
  );
};
