--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-06-01 00:31:48

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 237 (class 1255 OID 57872)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 49633)
-- Name: bom_entries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bom_entries (
    id integer NOT NULL,
    job_no integer,
    date date,
    day character varying(20),
    raw_material character varying(255),
    unit character varying(50),
    qty numeric(10,2),
    amount numeric(10,2),
    density_conversion numeric(10,2)
);


ALTER TABLE public.bom_entries OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 49632)
-- Name: bom_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bom_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bom_entries_id_seq OWNER TO postgres;

--
-- TOC entry 4975 (class 0 OID 0)
-- Dependencies: 217
-- Name: bom_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bom_entries_id_seq OWNED BY public.bom_entries.id;


--
-- TOC entry 219 (class 1259 OID 49640)
-- Name: bom_headers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bom_headers (
    job_no integer NOT NULL,
    machine_no integer,
    finished_good character varying(255),
    unit character varying(50),
    total_qty numeric(10,2),
    status character varying(20) DEFAULT 'Processing'::character varying,
    created_at timestamp without time zone,
    CONSTRAINT bom_headers_status_check CHECK (((status)::text = ANY ((ARRAY['Processing'::character varying, 'Completed'::character varying, 'Cancelled'::character varying])::text[])))
);


ALTER TABLE public.bom_headers OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 49669)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    category_price numeric(10,2) NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 49668)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- TOC entry 4976 (class 0 OID 0)
-- Dependencies: 224
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 236 (class 1259 OID 66042)
-- Name: extractions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.extractions (
    id integer NOT NULL,
    date date NOT NULL,
    job_id character varying(255) NOT NULL,
    machine_no character varying(50) NOT NULL,
    finished_good character varying(255) NOT NULL,
    wastage_percent numeric(10,2) DEFAULT 0,
    wastage_qty numeric(10,2) DEFAULT 0,
    available_qty numeric(10,2) NOT NULL,
    extraction_qty numeric(10,2) NOT NULL,
    final_qty numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.extractions OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 66041)
-- Name: extractions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.extractions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.extractions_id_seq OWNER TO postgres;

--
-- TOC entry 4977 (class 0 OID 0)
-- Dependencies: 235
-- Name: extractions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.extractions_id_seq OWNED BY public.extractions.id;


--
-- TOC entry 221 (class 1259 OID 49648)
-- Name: machine_entries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.machine_entries (
    id integer NOT NULL,
    date date NOT NULL,
    machine_name character varying(100) NOT NULL,
    machine_type character varying(50) NOT NULL,
    other character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.machine_entries OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 49647)
-- Name: machine_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.machine_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.machine_entries_id_seq OWNER TO postgres;

--
-- TOC entry 4978 (class 0 OID 0)
-- Dependencies: 220
-- Name: machine_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.machine_entries_id_seq OWNED BY public.machine_entries.id;


--
-- TOC entry 223 (class 1259 OID 49658)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    unit character varying(50),
    packing integer,
    description character varying(800),
    category character varying(255),
    sub_category character varying(255),
    company character varying(255),
    ctn character varying(255),
    barcode character varying(255),
    qrcode character varying(255),
    image character varying(255),
    active character varying(255),
    purchase integer,
    pprice numeric(10,2),
    opprice numeric(10,2),
    tp numeric(10,2),
    wholesaleprice numeric(10,2),
    openingqty integer,
    required_qty integer DEFAULT 0,
    discount integer,
    tax character varying(255),
    saletax integer,
    furthertax integer,
    ati integer,
    costingtype character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 49657)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 4979 (class 0 OID 0)
-- Dependencies: 222
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 234 (class 1259 OID 57875)
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    id integer NOT NULL,
    role_id integer NOT NULL,
    category character varying(20),
    form_name character varying(100) NOT NULL,
    sub_permission character varying(20),
    allowed boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT role_permissions_category_check CHECK (((category)::text = ANY ((ARRAY['Setup'::character varying, 'Entry'::character varying, 'Reports'::character varying])::text[]))),
    CONSTRAINT role_permissions_sub_permission_check CHECK (((sub_permission)::text = ANY ((ARRAY['add_record'::character varying, 'edit'::character varying, 'delete'::character varying])::text[])))
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 57874)
-- Name: role_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_permissions_id_seq OWNER TO postgres;

--
-- TOC entry 4980 (class 0 OID 0)
-- Dependencies: 233
-- Name: role_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_permissions_id_seq OWNED BY public.role_permissions.id;


--
-- TOC entry 232 (class 1259 OID 57862)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    role_name character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 57861)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 4981 (class 0 OID 0)
-- Dependencies: 231
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 227 (class 1259 OID 49676)
-- Name: subcategories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subcategories (
    id integer NOT NULL,
    subcategory character varying(255) NOT NULL,
    category character varying(255) NOT NULL
);


ALTER TABLE public.subcategories OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 49675)
-- Name: subcategories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subcategories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subcategories_id_seq OWNER TO postgres;

--
-- TOC entry 4982 (class 0 OID 0)
-- Dependencies: 226
-- Name: subcategories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subcategories_id_seq OWNED BY public.subcategories.id;


--
-- TOC entry 229 (class 1259 OID 49685)
-- Name: unit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unit (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.unit OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 49684)
-- Name: unit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.unit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.unit_id_seq OWNER TO postgres;

--
-- TOC entry 4983 (class 0 OID 0)
-- Dependencies: 228
-- Name: unit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.unit_id_seq OWNED BY public.unit.id;


--
-- TOC entry 230 (class 1259 OID 57849)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    privileges text,
    blocked boolean DEFAULT false,
    last_activity timestamp without time zone,
    email character varying(255) NOT NULL,
    is_active boolean DEFAULT true,
    first_name character varying(255),
    last_name character varying(255),
    role_id integer,
    is_admin boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 4745 (class 2604 OID 49636)
-- Name: bom_entries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bom_entries ALTER COLUMN id SET DEFAULT nextval('public.bom_entries_id_seq'::regclass);


--
-- TOC entry 4752 (class 2604 OID 49672)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 4767 (class 2604 OID 66045)
-- Name: extractions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.extractions ALTER COLUMN id SET DEFAULT nextval('public.extractions_id_seq'::regclass);


--
-- TOC entry 4747 (class 2604 OID 49651)
-- Name: machine_entries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.machine_entries ALTER COLUMN id SET DEFAULT nextval('public.machine_entries_id_seq'::regclass);


--
-- TOC entry 4749 (class 2604 OID 49661)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 4763 (class 2604 OID 57878)
-- Name: role_permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions ALTER COLUMN id SET DEFAULT nextval('public.role_permissions_id_seq'::regclass);


--
-- TOC entry 4760 (class 2604 OID 57865)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 4753 (class 2604 OID 49679)
-- Name: subcategories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategories ALTER COLUMN id SET DEFAULT nextval('public.subcategories_id_seq'::regclass);


--
-- TOC entry 4754 (class 2604 OID 49688)
-- Name: unit id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit ALTER COLUMN id SET DEFAULT nextval('public.unit_id_seq'::regclass);


--
-- TOC entry 4951 (class 0 OID 49633)
-- Dependencies: 218
-- Data for Name: bom_entries; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.bom_entries (id, job_no, date, day, raw_material, unit, qty, amount, density_conversion) VALUES
(1, 1, '2025-05-27', 'Tuesday', 'mobile', 'Grams', 500.00, 0.00, 0.50),
(2, 1, '2025-05-28', 'Wednesday', 'mobile', 'Liters', 0.80, 0.00, 0.80),
(3, 2, '2025-05-31', 'Saturday', 'T-Shirt 1532', 'Gram', 2000.00, 480600.00, 2.00);


--
-- TOC entry 4952 (class 0 OID 49640)
-- Dependencies: 219
-- Data for Name: bom_headers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.bom_headers (job_no, machine_no, finished_good, unit, total_qty, status, created_at) VALUES
(1, 2, 'T-Shirt 143', 'Gram', 0.00, 'Completed', '2025-05-28 16:59:33'),
(2, 1, 'T-Shirt 143', 'Kilogram', 2.00, 'Processing', '2025-05-31 21:13:04.712584');


--
-- TOC entry 4958 (class 0 OID 49669)
-- Dependencies: 225
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categories (id, name, category_price) VALUES
(1, 'Finished Good', 0.00),
(2, 'Raw Material', 0.00);


--
-- TOC entry 4969 (class 0 OID 66042)
-- Dependencies: 236
-- Data for Name: extractions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.extractions (id, date, job_id, machine_no, finished_good, wastage_percent, wastage_qty, available_qty, extraction_qty, final_qty, created_at) VALUES
(1, '2025-05-31', '1', '2', 'T-Shirt 143', 10.00, 0.13, 1.17, 1.00, 0.17, '2025-05-31 20:27:12.381796'),
(2, '2025-05-31', '1', '2', 'T-Shirt 143', 0.00, 0.00, 0.17, 0.17, 0.00, '2025-05-31 20:34:27.550475');


--
-- TOC entry 4954 (class 0 OID 49648)
-- Dependencies: 221
-- Data for Name: machine_entries; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.machine_entries (id, date, machine_name, machine_type, other, created_at) VALUES
(1, '2025-05-29', 'Meri Machine', 'Production Machine', NULL, '2025-05-30 03:22:20.120199');


--
-- TOC entry 4956 (class 0 OID 49658)
-- Dependencies: 223
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.products (id, name, unit, packing, description, category, sub_category, company, ctn, barcode, qrcode, image, active, purchase, pprice, opprice, tp, wholesaleprice, openingqty, required_qty, discount, tax, saletax, furthertax, ati, costingtype, created_at) VALUES
(1, 'T-Shirt 143', '4', 48, '', 'Finished Good', '1', 'Olivia', NULL, '2995223654740152', 'QRmagb271qAVS', NULL, '0', NULL, 200.00, 0.00, 400.00, 300.00, 0, 0, 0, NULL, 0, 0, 0, '', '2025-05-09 04:43:19'),
(3, 'T-Shirt 1532', '4', 12, '', 'Raw Material', '1', 'Olivia', NULL, '', '', NULL, '0', NULL, 240.30, 240.30, 600.35, 550.45, 15, 16, 0, NULL, 0, 0, 0, NULL, '2025-05-09 06:02:57'),
(4, 'Samsung 12', '4', 1, '', 'Raw Material', '3', 'Rose Petal', NULL, '', '', NULL, '0', NULL, 5000.00, 5000.00, 8000.00, 7700.00, 50, 40, 0, NULL, 0, 0, 0, '', '2025-05-09 06:05:15');


--
-- TOC entry 4967 (class 0 OID 57875)
-- Dependencies: 234
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.role_permissions (id, role_id, category, form_name, sub_permission, allowed, created_at, updated_at) 
VALUES (1, 1, 'Setup', 'Default', 'add_record', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


--
-- TOC entry 4965 (class 0 OID 57862)
-- Dependencies: 232
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.roles (id, role_name, created_at, updated_at) VALUES
(1, 'Administrator', '2025-04-29 15:05:01', '2025-04-29 15:05:01'),
(2, 'Manager', '2025-04-29 15:05:01', '2025-04-29 15:05:01'),
(3, 'User', '2025-04-29 15:05:01', '2025-04-29 15:05:01');


--
-- TOC entry 4960 (class 0 OID 49676)
-- Dependencies: 227
-- Data for Name: subcategories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.subcategories (id, subcategory, category) VALUES
(1, 'T-Shirt', 'Clothing'),
(2, 'Pants', 'Clothing'),
(3, 'Mobile J4', 'Electronics');


--
-- TOC entry 4962 (class 0 OID 49685)
-- Dependencies: 229
-- Data for Name: unit; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.unit (id, name) VALUES
(1, 'Gram'),
(2, 'Kilogram'),
(3, 'Liter');


--
-- TOC entry 4963 (class 0 OID 57849)
-- Dependencies: 230
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, username, password, role, created_at, privileges, blocked, last_activity, email, is_active, first_name, last_name, role_id, is_admin) VALUES
(0, 'InnovaTech', '$2y$10$EVqi7dElOBVXvLstj4ZFOuWJvyUH4TfeW6kQtXjsEZCLMW/LtoB62', 'user', '2025-05-01 17:35:08', NULL, false, NULL, 'innova.tech213@gmail.com', true, 'zahid', 'Ghori', 3, false),
(1, 'admin', '$2y$10$/4HECJxd.TXoqtJIxrXjEeecpb8Wxy15yi1uY96uS4ua9yi29ymNe', 'admin', '2025-03-08 17:09:31', NULL, false, '2025-05-18 04:52:14', 'admin@gmail.com', true, 'Admin', NULL, 1, true);


--
-- TOC entry 4984 (class 0 OID 0)
-- Dependencies: 217
-- Name: bom_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bom_entries_id_seq', 3, true);


--
-- TOC entry 4985 (class 0 OID 0)
-- Dependencies: 224
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 2, true);


--
-- TOC entry 4986 (class 0 OID 0)
-- Dependencies: 235
-- Name: extractions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.extractions_id_seq', 2, true);


--
-- TOC entry 4987 (class 0 OID 0)
-- Dependencies: 220
-- Name: machine_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.machine_entries_id_seq', 16, true);


--
-- TOC entry 4988 (class 0 OID 0)
-- Dependencies: 222
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 4, true);


--
-- TOC entry 4989 (class 0 OID 0)
-- Dependencies: 233
-- Name: role_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_permissions_id_seq', 824, false);


--
-- TOC entry 4990 (class 0 OID 0)
-- Dependencies: 231
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 4, false);


--
-- TOC entry 4991 (class 0 OID 0)
-- Dependencies: 226
-- Name: subcategories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subcategories_id_seq', 3, true);


--
-- TOC entry 4992 (class 0 OID 0)
-- Dependencies: 228
-- Name: unit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.unit_id_seq', 3, true);


--
-- TOC entry 4775 (class 2606 OID 49638)
-- Name: bom_entries bom_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bom_entries
    ADD CONSTRAINT bom_entries_pkey PRIMARY KEY (id);


--
-- TOC entry 4778 (class 2606 OID 49646)
-- Name: bom_headers bom_headers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bom_headers
    ADD CONSTRAINT bom_headers_pkey PRIMARY KEY (job_no);


--
-- TOC entry 4784 (class 2606 OID 49674)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4802 (class 2606 OID 66052)
-- Name: extractions extractions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.extractions
    ADD CONSTRAINT extractions_pkey PRIMARY KEY (id);


--
-- TOC entry 4780 (class 2606 OID 49654)
-- Name: machine_entries machine_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.machine_entries
    ADD CONSTRAINT machine_entries_pkey PRIMARY KEY (id);


--
-- TOC entry 4782 (class 2606 OID 49667)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4799 (class 2606 OID 57885)
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 4792 (class 2606 OID 57869)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4794 (class 2606 OID 57871)
-- Name: roles roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- TOC entry 4786 (class 2606 OID 49683)
-- Name: subcategories subcategories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategories
    ADD CONSTRAINT subcategories_pkey PRIMARY KEY (id);


--
-- TOC entry 4788 (class 2606 OID 49690)
-- Name: unit unit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit
    ADD CONSTRAINT unit_pkey PRIMARY KEY (id);


--
-- TOC entry 4790 (class 2606 OID 57860)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4795 (class 1259 OID 57889)
-- Name: idx_allowed; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_allowed ON public.role_permissions USING btree (allowed);


--
-- TOC entry 4796 (class 1259 OID 57888)
-- Name: idx_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_category ON public.role_permissions USING btree (category);


--
-- TOC entry 4776 (class 1259 OID 49639)
-- Name: idx_job_no; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_job_no ON public.bom_entries USING btree (job_no);


--
-- TOC entry 4797 (class 1259 OID 57887)
-- Name: idx_role_form; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_role_form ON public.role_permissions USING btree (role_id, category, form_name);


--
-- TOC entry 4800 (class 1259 OID 57886)
-- Name: unique_permission; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_permission ON public.role_permissions USING btree (role_id, category, form_name, sub_permission);


--
-- TOC entry 4804 (class 2620 OID 57873)
-- Name: roles trigger_update_roles_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_roles_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4803 (class 2606 OID 57890)
-- Name: role_permissions fk_role_permissions_role_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT fk_role_permissions_role_id FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


-- Completed on 2025-06-01 00:31:48

--
-- PostgreSQL database dump complete
--

