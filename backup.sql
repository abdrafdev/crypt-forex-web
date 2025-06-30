--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: TradeStatus; Type: TYPE; Schema: public; Owner: hmzi67
--

CREATE TYPE public."TradeStatus" AS ENUM (
    'PENDING',
    'EXECUTED',
    'CANCELLED',
    'FAILED'
);


ALTER TYPE public."TradeStatus" OWNER TO hmzi67;

--
-- Name: TradeType; Type: TYPE; Schema: public; Owner: hmzi67
--

CREATE TYPE public."TradeType" AS ENUM (
    'BUY',
    'SELL'
);


ALTER TYPE public."TradeType" OWNER TO hmzi67;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: hmzi67
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO hmzi67;

--
-- Name: crypto_prices; Type: TABLE; Schema: public; Owner: hmzi67
--

CREATE TABLE public.crypto_prices (
    id text NOT NULL,
    symbol text NOT NULL,
    price numeric(18,8) NOT NULL,
    change24h numeric(10,4) NOT NULL,
    volume24h numeric(20,8) NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.crypto_prices OWNER TO hmzi67;

--
-- Name: trades; Type: TABLE; Schema: public; Owner: hmzi67
--

CREATE TABLE public.trades (
    id text NOT NULL,
    "userId" text NOT NULL,
    symbol text NOT NULL,
    type public."TradeType" NOT NULL,
    amount numeric(18,8) NOT NULL,
    price numeric(18,8) NOT NULL,
    total numeric(18,8) NOT NULL,
    status public."TradeStatus" DEFAULT 'PENDING'::public."TradeStatus" NOT NULL,
    "executedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.trades OWNER TO hmzi67;

--
-- Name: users; Type: TABLE; Schema: public; Owner: hmzi67
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    "firstName" text,
    "lastName" text,
    name text,
    avatar text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO hmzi67;

--
-- Name: watchlist_items; Type: TABLE; Schema: public; Owner: hmzi67
--

CREATE TABLE public.watchlist_items (
    id text NOT NULL,
    "userId" text NOT NULL,
    symbol text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.watchlist_items OWNER TO hmzi67;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: hmzi67
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
3cb6c7bd-b1dc-4180-87be-7f4219ec0f28	010ac29382d3cbd2808e341b9816b4b15b770c640871323257361bb541b8dcfa	2025-06-30 23:52:25.705809+05	20250630185225_add_first_last_name	\N	\N	2025-06-30 23:52:25.580226+05	1
6199d719-6a6d-4687-bada-8f82884c46d9	ec9480b637fc90789ab360c6388d98b787d5370a1834971410681420895d0e9e	2025-07-01 00:09:03.923314+05	20250630190903_add_first_last_name	\N	\N	2025-07-01 00:09:03.918928+05	1
89f27872-b117-4133-8799-f1a3d1495093	a1feec45f2effa3466d7986ed375e4e3a0938b098dc0001cbef8d01d0ac8da1b	2025-07-01 00:13:26.998096+05	20250630191326_add_username_unique_constraint	\N	\N	2025-07-01 00:13:26.994669+05	1
\.


--
-- Data for Name: crypto_prices; Type: TABLE DATA; Schema: public; Owner: hmzi67
--

COPY public.crypto_prices (id, symbol, price, change24h, volume24h, "updatedAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: trades; Type: TABLE DATA; Schema: public; Owner: hmzi67
--

COPY public.trades (id, "userId", symbol, type, amount, price, total, status, "executedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: hmzi67
--

COPY public.users (id, email, username, password, "firstName", "lastName", name, avatar, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: watchlist_items; Type: TABLE DATA; Schema: public; Owner: hmzi67
--

COPY public.watchlist_items (id, "userId", symbol, "createdAt") FROM stdin;
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: hmzi67
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: crypto_prices crypto_prices_pkey; Type: CONSTRAINT; Schema: public; Owner: hmzi67
--

ALTER TABLE ONLY public.crypto_prices
    ADD CONSTRAINT crypto_prices_pkey PRIMARY KEY (id);


--
-- Name: trades trades_pkey; Type: CONSTRAINT; Schema: public; Owner: hmzi67
--

ALTER TABLE ONLY public.trades
    ADD CONSTRAINT trades_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: hmzi67
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: watchlist_items watchlist_items_pkey; Type: CONSTRAINT; Schema: public; Owner: hmzi67
--

ALTER TABLE ONLY public.watchlist_items
    ADD CONSTRAINT watchlist_items_pkey PRIMARY KEY (id);


--
-- Name: crypto_prices_symbol_key; Type: INDEX; Schema: public; Owner: hmzi67
--

CREATE UNIQUE INDEX crypto_prices_symbol_key ON public.crypto_prices USING btree (symbol);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: hmzi67
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: hmzi67
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- Name: watchlist_items_userId_symbol_key; Type: INDEX; Schema: public; Owner: hmzi67
--

CREATE UNIQUE INDEX "watchlist_items_userId_symbol_key" ON public.watchlist_items USING btree ("userId", symbol);


--
-- Name: trades trades_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hmzi67
--

ALTER TABLE ONLY public.trades
    ADD CONSTRAINT "trades_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: watchlist_items watchlist_items_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hmzi67
--

ALTER TABLE ONLY public.watchlist_items
    ADD CONSTRAINT "watchlist_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

