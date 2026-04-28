--
-- PostgreSQL database dump
--

\restrict GMfzbp7lveSRk8Z2M7zTBviM1mGIDhcSkoYLwdCp45fJgwW8VRpQjYimfj83wU9

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

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
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: clientes_estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.clientes_estado_enum AS ENUM (
    'activo',
    'baja'
);


ALTER TYPE public.clientes_estado_enum OWNER TO postgres;

--
-- Name: estados_clientes; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estados_clientes AS ENUM (
    'activo',
    'baja'
);


ALTER TYPE public.estados_clientes OWNER TO postgres;

--
-- Name: estados_proyectos; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estados_proyectos AS ENUM (
    'activo',
    'finalizado',
    'baja'
);


ALTER TYPE public.estados_proyectos OWNER TO postgres;

--
-- Name: estados_tareas; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estados_tareas AS ENUM (
    'pendiente',
    'finalizado',
    'baja'
);


ALTER TYPE public.estados_tareas OWNER TO postgres;

--
-- Name: estados_usuarios; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estados_usuarios AS ENUM (
    'activo',
    'baja'
);


ALTER TYPE public.estados_usuarios OWNER TO postgres;

--
-- Name: proyectos_estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.proyectos_estado_enum AS ENUM (
    'activo',
    'finalizado',
    'baja'
);


ALTER TYPE public.proyectos_estado_enum OWNER TO postgres;

--
-- Name: tareas_estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tareas_estado_enum AS ENUM (
    'pendiente',
    'finalizado',
    'baja'
);


ALTER TYPE public.tareas_estado_enum OWNER TO postgres;

--
-- Name: usuarios_estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.usuarios_estado_enum AS ENUM (
    'activo',
    'baja'
);


ALTER TYPE public.usuarios_estado_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clientes (
    id integer NOT NULL,
    nombre text NOT NULL,
    estado public.estados_clientes NOT NULL
);


ALTER TABLE public.clientes OWNER TO postgres;

--
-- Name: clientes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clientes_id_seq OWNER TO postgres;

--
-- Name: clientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clientes_id_seq OWNED BY public.clientes.id;


--
-- Name: proyectos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proyectos (
    id integer NOT NULL,
    nombre text NOT NULL,
    estado public.estados_proyectos NOT NULL,
    id_cliente integer
);


ALTER TABLE public.proyectos OWNER TO postgres;

--
-- Name: proyectos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.proyectos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.proyectos_id_seq OWNER TO postgres;

--
-- Name: proyectos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.proyectos_id_seq OWNED BY public.proyectos.id;


--
-- Name: tareas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tareas (
    id integer NOT NULL,
    descripcion text NOT NULL,
    estado public.estados_tareas NOT NULL,
    id_proyecto integer NOT NULL
);


ALTER TABLE public.tareas OWNER TO postgres;

--
-- Name: tareas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tareas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tareas_id_seq OWNER TO postgres;

--
-- Name: tareas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tareas_id_seq OWNED BY public.tareas.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre text NOT NULL,
    clave text NOT NULL,
    estado public.estados_usuarios NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: clientes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes ALTER COLUMN id SET DEFAULT nextval('public.clientes_id_seq'::regclass);


--
-- Name: proyectos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos ALTER COLUMN id SET DEFAULT nextval('public.proyectos_id_seq'::regclass);


--
-- Name: tareas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas ALTER COLUMN id SET DEFAULT nextval('public.tareas_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Name: clientes clientes_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_nombre_key UNIQUE (nombre);


--
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);


--
-- Name: proyectos proyectos_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos
    ADD CONSTRAINT proyectos_nombre_key UNIQUE (nombre);


--
-- Name: proyectos proyectos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos
    ADD CONSTRAINT proyectos_pkey PRIMARY KEY (id);


--
-- Name: tareas tareas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT tareas_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_nombre_key UNIQUE (nombre);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: proyectos fk_proyectos_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos
    ADD CONSTRAINT fk_proyectos_cliente FOREIGN KEY (id_cliente) REFERENCES public.clientes(id);


--
-- Name: tareas fk_tareas_proyecto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT fk_tareas_proyecto FOREIGN KEY (id_proyecto) REFERENCES public.proyectos(id);


--
-- PostgreSQL database dump complete
--

\unrestrict GMfzbp7lveSRk8Z2M7zTBviM1mGIDhcSkoYLwdCp45fJgwW8VRpQjYimfj83wU9

