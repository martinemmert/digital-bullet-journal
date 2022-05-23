-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE TABLE IF NOT EXISTS public.bullets
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    "user" uuid,
    content text COLLATE pg_catalog."default",
    type character varying COLLATE pg_catalog."default",
    CONSTRAINT bullets_pkey PRIMARY KEY (id),
    CONSTRAINT bullets_user_fkey FOREIGN KEY ("user")
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.bullets
    OWNER to postgres;

GRANT ALL ON TABLE public.bullets TO anon;

GRANT ALL ON TABLE public.bullets TO authenticated;

GRANT ALL ON TABLE public.bullets TO postgres;

GRANT ALL ON TABLE public.bullets TO service_role;