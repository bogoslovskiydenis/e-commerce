--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Homebrew)
-- Dumped by pg_dump version 15.13 (Homebrew)

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: denisbogoslovskiy
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO denisbogoslovskiy;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: denisbogoslovskiy
--

COMMENT ON SCHEMA public IS '';


--
-- Name: NavigationType; Type: TYPE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TYPE public."NavigationType" AS ENUM (
    'LINK',
    'CATEGORY',
    'DROPDOWN',
    'EXTERNAL'
);


ALTER TYPE public."NavigationType" OWNER TO denisbogoslovskiy;

--
-- Name: banner_position; Type: TYPE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TYPE public.banner_position AS ENUM (
    'MAIN',
    'CATEGORY',
    'SIDEBAR',
    'FOOTER',
    'POPUP'
);


ALTER TYPE public.banner_position OWNER TO denisbogoslovskiy;

--
-- Name: callback_priority; Type: TYPE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TYPE public.callback_priority AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'URGENT'
);


ALTER TYPE public.callback_priority OWNER TO denisbogoslovskiy;

--
-- Name: callback_status; Type: TYPE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TYPE public.callback_status AS ENUM (
    'NEW',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public.callback_status OWNER TO denisbogoslovskiy;

--
-- Name: category_type; Type: TYPE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TYPE public.category_type AS ENUM (
    'PRODUCTS',
    'BALLOONS',
    'GIFTS',
    'EVENTS',
    'COLORS',
    'MATERIALS',
    'OCCASIONS'
);


ALTER TYPE public.category_type OWNER TO denisbogoslovskiy;

--
-- Name: log_level; Type: TYPE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TYPE public.log_level AS ENUM (
    'DEBUG',
    'INFO',
    'WARN',
    'ERROR'
);


ALTER TYPE public.log_level OWNER TO denisbogoslovskiy;

--
-- Name: order_status; Type: TYPE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TYPE public.order_status AS ENUM (
    'NEW',
    'CONFIRMED',
    'PROCESSING',
    'READY',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED'
);


ALTER TYPE public.order_status OWNER TO denisbogoslovskiy;

--
-- Name: payment_status; Type: TYPE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TYPE public.payment_status AS ENUM (
    'PENDING',
    'PAID',
    'FAILED',
    'REFUNDED',
    'PARTIALLY_REFUNDED'
);


ALTER TYPE public.payment_status OWNER TO denisbogoslovskiy;

--
-- Name: promotion_type; Type: TYPE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TYPE public.promotion_type AS ENUM (
    'PERCENTAGE',
    'FIXED_AMOUNT',
    'FREE_SHIPPING',
    'BUY_ONE_GET_ONE'
);


ALTER TYPE public.promotion_type OWNER TO denisbogoslovskiy;

--
-- Name: review_status; Type: TYPE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TYPE public.review_status AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public.review_status OWNER TO denisbogoslovskiy;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TYPE public.user_role AS ENUM (
    'SUPER_ADMIN',
    'ADMINISTRATOR',
    'MANAGER',
    'CRM_MANAGER',
    'CUSTOMER'
);


ALTER TYPE public.user_role OWNER TO denisbogoslovskiy;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_logs; Type: TABLE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TABLE public.admin_logs (
    id text NOT NULL,
    user_id text NOT NULL,
    username text NOT NULL,
    action text NOT NULL,
    resource_type text NOT NULL,
    resource_id text,
    description text NOT NULL,
    ip text NOT NULL,
    user_agent text NOT NULL,
    metadata jsonb,
    level public.log_level DEFAULT 'INFO'::public.log_level NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.admin_logs OWNER TO denisbogoslovskiy;

--
-- Name: analytics; Type: TABLE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TABLE public.analytics (
    id text NOT NULL,
    event text NOT NULL,
    data jsonb NOT NULL,
    ip text,
    user_agent text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.analytics OWNER TO denisbogoslovskiy;

--
-- Name: banners; Type: TABLE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TABLE public.banners (
    id text NOT NULL,
    title text NOT NULL,
    subtitle text,
    description text,
    image_url text NOT NULL,
    mobile_image_url text,
    link text,
    button_text text,
    "position" public.banner_position DEFAULT 'MAIN'::public.banner_position NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    start_date timestamp(3) without time zone,
    end_date timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.banners OWNER TO denisbogoslovskiy;

--
-- Name: cache; Type: TABLE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TABLE public.cache (
    id text NOT NULL,
    key text NOT NULL,
    value jsonb NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.cache OWNER TO denisbogoslovskiy;

--
-- Name: callbacks; Type: TABLE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TABLE public.callbacks (
    id text NOT NULL,
    customer_id text,
    name text NOT NULL,
    phone text NOT NULL,
    email text,
    message text,
    status public.callback_status DEFAULT 'NEW'::public.callback_status NOT NULL,
    priority public.callback_priority DEFAULT 'MEDIUM'::public.callback_priority NOT NULL,
    source text DEFAULT 'website'::text,
    manager_id text,
    scheduled_at timestamp(3) without time zone,
    completed_at timestamp(3) without time zone,
    notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.callbacks OWNER TO denisbogoslovskiy;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TABLE public.categories (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    type public.category_type DEFAULT 'PRODUCTS'::public.category_type NOT NULL,
    parent_id text,
    image_url text,
    banner_url text,
    is_active boolean DEFAULT true NOT NULL,
    show_in_navigation boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    meta_title text,
    meta_description text,
    meta_keywords text,
    filters jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.categories OWNER TO denisbogoslovskiy;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TABLE public.comments (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    message text NOT NULL,
    is_approved boolean DEFAULT false NOT NULL,
    moderator_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.comments OWNER TO denisbogoslovskiy;

--
-- Name: customers; Type: TABLE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TABLE public.customers (
    id text NOT NULL,
    name text NOT NULL,
    email text,
    phone text NOT NULL,
    address text,
    notes text,
    tags text[],
    metadata jsonb,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.customers OWNER TO denisbogoslovskiy;

--
-- Name: navigation_items; Type: TABLE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TABLE public.navigation_items (
    id text NOT NULL,
    name text NOT NULL,
    url text,
    type public."NavigationType" DEFAULT 'LINK'::public."NavigationType" NOT NULL,
    "categoryId" text,
    "parentId" text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "openInNew" boolean DEFAULT false NOT NULL,
    icon text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.navigation_items OWNER TO denisbogoslovskiy;

--
-- Name: newsletter; Type: TABLE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TABLE public.newsletter (
    id text NOT NULL,
    email text NOT NULL,
    name text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.newsletter OWNER TO denisbogoslovskiy;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TABLE public.order_items (
    id text NOT NULL,
    order_id text NOT NULL,
    product_id text NOT NULL,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    total numeric(10,2) NOT NULL
);


ALTER TABLE public.order_items OWNER TO denisbogoslovskiy;

--
-- Name: order_status_history; Type: TABLE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TABLE public.order_status_history (
    id text NOT NULL,
    order_id text NOT NULL,
    status public.order_status NOT NULL,
    comment text,
    user_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.order_status_history OWNER TO denisbogoslovskiy;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TABLE public.orders (
    id text NOT NULL,
    order_number text NOT NULL,
    customer_id text NOT NULL,
    manager_id text,
    status public.order_status DEFAULT 'NEW'::public.order_status NOT NULL,
    payment_status public.payment_status DEFAULT 'PENDING'::public.payment_status NOT NULL,
    payment_method text,
    total_amount numeric(10,2) NOT NULL,
    discount_amount numeric(10,2) DEFAULT 0 NOT NULL,
    shipping_amount numeric(10,2) DEFAULT 0 NOT NULL,
    shipping_address jsonb,
    notes text,
    manager_notes text,
    source text DEFAULT 'website'::text,
    delivery_date timestamp(3) without time zone,
    completed_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.orders OWNER TO denisbogoslovskiy;

--
-- Name: pages; Type: TABLE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TABLE public.pages (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text NOT NULL,
    excerpt text,
    is_active boolean DEFAULT true NOT NULL,
    meta_title text,
    meta_description text,
    meta_keywords text,
    template text DEFAULT 'default'::text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.pages OWNER TO denisbogoslovskiy;

--
-- Name: products; Type: TABLE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TABLE public.products (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text,
    short_description text,
    price numeric(10,2) NOT NULL,
    old_price numeric(10,2),
    discount numeric(5,2),
    category_id text NOT NULL,
    brand text,
    sku text,
    images text[],
    attributes jsonb,
    tags text[],
    is_active boolean DEFAULT true NOT NULL,
    in_stock boolean DEFAULT true NOT NULL,
    stock_quantity integer DEFAULT 0 NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    weight numeric(8,3),
    dimensions jsonb,
    meta_title text,
    meta_description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.products OWNER TO denisbogoslovskiy;

--
-- Name: promotion_products; Type: TABLE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TABLE public.promotion_products (
    id text NOT NULL,
    promotion_id text NOT NULL,
    product_id text NOT NULL
);


ALTER TABLE public.promotion_products OWNER TO denisbogoslovskiy;

--
-- Name: promotions; Type: TABLE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TABLE public.promotions (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    code text,
    type public.promotion_type NOT NULL,
    value numeric(10,2) NOT NULL,
    min_order_amount numeric(10,2),
    max_usage integer,
    used_count integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    start_date timestamp(3) without time zone,
    end_date timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.promotions OWNER TO denisbogoslovskiy;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TABLE public.reviews (
    id text NOT NULL,
    product_id text NOT NULL,
    customer_id text,
    name text NOT NULL,
    email text,
    rating integer NOT NULL,
    comment text,
    status public.review_status DEFAULT 'PENDING'::public.review_status NOT NULL,
    moderator_id text,
    moderated_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.reviews OWNER TO denisbogoslovskiy;

--
-- Name: search_index; Type: TABLE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TABLE public.search_index (
    id text NOT NULL,
    type text NOT NULL,
    entity_id text NOT NULL,
    content text NOT NULL,
    tags text[],
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.search_index OWNER TO denisbogoslovskiy;

--
-- Name: settings; Type: TABLE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TABLE public.settings (
    id text NOT NULL,
    key text NOT NULL,
    value jsonb NOT NULL,
    type text DEFAULT 'string'::text NOT NULL,
    "group" text,
    description text,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.settings OWNER TO denisbogoslovskiy;

--
-- Name: users; Type: TABLE; Schema: public; Owner: denisbogoslovskiy
--

CREATE TABLE public.users (
    id text NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    full_name text NOT NULL,
    role public.user_role NOT NULL,
    permissions text[],
    custom_permissions text[],
    is_active boolean DEFAULT true NOT NULL,
    two_factor_enabled boolean DEFAULT false NOT NULL,
    two_factor_secret text,
    avatar_url text,
    last_login timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO denisbogoslovskiy;

--
-- Data for Name: admin_logs; Type: TABLE DATA; Schema: public; Owner: denisbogoslovskiy
--

COPY public.admin_logs (id, user_id, username, action, resource_type, resource_id, description, ip, user_agent, metadata, level, created_at) FROM stdin;
\.


--
-- Data for Name: analytics; Type: TABLE DATA; Schema: public; Owner: denisbogoslovskiy
--

COPY public.analytics (id, event, data, ip, user_agent, created_at) FROM stdin;
\.


--
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: denisbogoslovskiy
--

COPY public.banners (id, title, subtitle, description, image_url, mobile_image_url, link, button_text, "position", is_active, sort_order, start_date, end_date, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: cache; Type: TABLE DATA; Schema: public; Owner: denisbogoslovskiy
--

COPY public.cache (id, key, value, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: callbacks; Type: TABLE DATA; Schema: public; Owner: denisbogoslovskiy
--

COPY public.callbacks (id, customer_id, name, phone, email, message, status, priority, source, manager_id, scheduled_at, completed_at, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: denisbogoslovskiy
--

COPY public.categories (id, name, slug, description, type, parent_id, image_url, banner_url, is_active, show_in_navigation, sort_order, meta_title, meta_description, meta_keywords, filters, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: denisbogoslovskiy
--

COPY public.comments (id, name, email, message, is_approved, moderator_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: denisbogoslovskiy
--

COPY public.customers (id, name, email, phone, address, notes, tags, metadata, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: navigation_items; Type: TABLE DATA; Schema: public; Owner: denisbogoslovskiy
--

COPY public.navigation_items (id, name, url, type, "categoryId", "parentId", "sortOrder", "isActive", "openInNew", icon, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: newsletter; Type: TABLE DATA; Schema: public; Owner: denisbogoslovskiy
--

COPY public.newsletter (id, email, name, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: denisbogoslovskiy
--

COPY public.order_items (id, order_id, product_id, quantity, price, total) FROM stdin;
\.


--
-- Data for Name: order_status_history; Type: TABLE DATA; Schema: public; Owner: denisbogoslovskiy
--

COPY public.order_status_history (id, order_id, status, comment, user_id, created_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: denisbogoslovskiy
--

COPY public.orders (id, order_number, customer_id, manager_id, status, payment_status, payment_method, total_amount, discount_amount, shipping_amount, shipping_address, notes, manager_notes, source, delivery_date, completed_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: denisbogoslovskiy
--

COPY public.pages (id, title, slug, content, excerpt, is_active, meta_title, meta_description, meta_keywords, template, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: denisbogoslovskiy
--

COPY public.products (id, title, slug, description, short_description, price, old_price, discount, category_id, brand, sku, images, attributes, tags, is_active, in_stock, stock_quantity, featured, weight, dimensions, meta_title, meta_description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: promotion_products; Type: TABLE DATA; Schema: public; Owner: denisbogoslovskiy
--

COPY public.promotion_products (id, promotion_id, product_id) FROM stdin;
\.


--
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: denisbogoslovskiy
--

COPY public.promotions (id, name, description, code, type, value, min_order_amount, max_usage, used_count, is_active, start_date, end_date, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: denisbogoslovskiy
--

COPY public.reviews (id, product_id, customer_id, name, email, rating, comment, status, moderator_id, moderated_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: search_index; Type: TABLE DATA; Schema: public; Owner: denisbogoslovskiy
--

COPY public.search_index (id, type, entity_id, content, tags, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: denisbogoslovskiy
--

COPY public.settings (id, key, value, type, "group", description, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: denisbogoslovskiy
--

COPY public.users (id, username, email, password_hash, full_name, role, permissions, custom_permissions, is_active, two_factor_enabled, two_factor_secret, avatar_url, last_login, created_at, updated_at) FROM stdin;
\.


--
-- Name: admin_logs admin_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.admin_logs
    ADD CONSTRAINT admin_logs_pkey PRIMARY KEY (id);


--
-- Name: analytics analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.analytics
    ADD CONSTRAINT analytics_pkey PRIMARY KEY (id);


--
-- Name: banners banners_pkey; Type: CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_pkey PRIMARY KEY (id);


--
-- Name: cache cache_pkey; Type: CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (id);


--
-- Name: callbacks callbacks_pkey; Type: CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.callbacks
    ADD CONSTRAINT callbacks_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: navigation_items navigation_items_pkey; Type: CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.navigation_items
    ADD CONSTRAINT navigation_items_pkey PRIMARY KEY (id);


--
-- Name: newsletter newsletter_pkey; Type: CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.newsletter
    ADD CONSTRAINT newsletter_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: order_status_history order_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT order_status_history_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: promotion_products promotion_products_pkey; Type: CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.promotion_products
    ADD CONSTRAINT promotion_products_pkey PRIMARY KEY (id);


--
-- Name: promotions promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: search_index search_index_pkey; Type: CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.search_index
    ADD CONSTRAINT search_index_pkey PRIMARY KEY (id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: cache_expires_at_idx; Type: INDEX; Schema: public; Owner: denisbogoslovskiy
--

CREATE INDEX cache_expires_at_idx ON public.cache USING btree (expires_at);


--
-- Name: cache_key_key; Type: INDEX; Schema: public; Owner: denisbogoslovskiy
--

CREATE UNIQUE INDEX cache_key_key ON public.cache USING btree (key);


--
-- Name: categories_is_active_idx; Type: INDEX; Schema: public; Owner: denisbogoslovskiy
--

CREATE INDEX categories_is_active_idx ON public.categories USING btree (is_active);


--
-- Name: categories_parent_id_idx; Type: INDEX; Schema: public; Owner: denisbogoslovskiy
--

CREATE INDEX categories_parent_id_idx ON public.categories USING btree (parent_id);


--
-- Name: categories_show_in_navigation_idx; Type: INDEX; Schema: public; Owner: denisbogoslovskiy
--

CREATE INDEX categories_show_in_navigation_idx ON public.categories USING btree (show_in_navigation);


--
-- Name: categories_slug_key; Type: INDEX; Schema: public; Owner: denisbogoslovskiy
--

CREATE UNIQUE INDEX categories_slug_key ON public.categories USING btree (slug);


--
-- Name: categories_sort_order_idx; Type: INDEX; Schema: public; Owner: denisbogoslovskiy
--

CREATE INDEX categories_sort_order_idx ON public.categories USING btree (sort_order);


--
-- Name: categories_type_idx; Type: INDEX; Schema: public; Owner: denisbogoslovskiy
--

CREATE INDEX categories_type_idx ON public.categories USING btree (type);


--
-- Name: navigation_items_categoryId_idx; Type: INDEX; Schema: public; Owner: denisbogoslovskiy
--

CREATE INDEX "navigation_items_categoryId_idx" ON public.navigation_items USING btree ("categoryId");


--
-- Name: navigation_items_parentId_idx; Type: INDEX; Schema: public; Owner: denisbogoslovskiy
--

CREATE INDEX "navigation_items_parentId_idx" ON public.navigation_items USING btree ("parentId");


--
-- Name: navigation_items_sortOrder_idx; Type: INDEX; Schema: public; Owner: denisbogoslovskiy
--

CREATE INDEX "navigation_items_sortOrder_idx" ON public.navigation_items USING btree ("sortOrder");


--
-- Name: newsletter_email_key; Type: INDEX; Schema: public; Owner: denisbogoslovskiy
--

CREATE UNIQUE INDEX newsletter_email_key ON public.newsletter USING btree (email);


--
-- Name: orders_order_number_key; Type: INDEX; Schema: public; Owner: denisbogoslovskiy
--

CREATE UNIQUE INDEX orders_order_number_key ON public.orders USING btree (order_number);


--
-- Name: pages_slug_key; Type: INDEX; Schema: public; Owner: denisbogoslovskiy
--

CREATE UNIQUE INDEX pages_slug_key ON public.pages USING btree (slug);


--
-- Name: products_sku_key; Type: INDEX; Schema: public; Owner: denisbogoslovskiy
--

CREATE UNIQUE INDEX products_sku_key ON public.products USING btree (sku);


--
-- Name: products_slug_key; Type: INDEX; Schema: public; Owner: denisbogoslovskiy
--

CREATE UNIQUE INDEX products_slug_key ON public.products USING btree (slug);


--
-- Name: promotion_products_promotion_id_product_id_key; Type: INDEX; Schema: public; Owner: denisbogoslovskiy
--

CREATE UNIQUE INDEX promotion_products_promotion_id_product_id_key ON public.promotion_products USING btree (promotion_id, product_id);


--
-- Name: promotions_code_key; Type: INDEX; Schema: public; Owner: denisbogoslovskiy
--

CREATE UNIQUE INDEX promotions_code_key ON public.promotions USING btree (code);


--
-- Name: search_index_type_entity_id_idx; Type: INDEX; Schema: public; Owner: denisbogoslovskiy
--

CREATE INDEX search_index_type_entity_id_idx ON public.search_index USING btree (type, entity_id);


--
-- Name: settings_key_key; Type: INDEX; Schema: public; Owner: denisbogoslovskiy
--

CREATE UNIQUE INDEX settings_key_key ON public.settings USING btree (key);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: denisbogoslovskiy
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: denisbogoslovskiy
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- Name: admin_logs admin_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.admin_logs
    ADD CONSTRAINT admin_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: callbacks callbacks_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.callbacks
    ADD CONSTRAINT callbacks_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: callbacks callbacks_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.callbacks
    ADD CONSTRAINT callbacks_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: comments comments_moderator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_moderator_id_fkey FOREIGN KEY (moderator_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: navigation_items navigation_items_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.navigation_items
    ADD CONSTRAINT "navigation_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: navigation_items navigation_items_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.navigation_items
    ADD CONSTRAINT "navigation_items_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public.navigation_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: order_status_history order_status_history_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT order_status_history_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: orders orders_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: promotion_products promotion_products_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.promotion_products
    ADD CONSTRAINT promotion_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion_products promotion_products_promotion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.promotion_products
    ADD CONSTRAINT promotion_products_promotion_id_fkey FOREIGN KEY (promotion_id) REFERENCES public.promotions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: reviews reviews_moderator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_moderator_id_fkey FOREIGN KEY (moderator_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: reviews reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: denisbogoslovskiy
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: denisbogoslovskiy
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

