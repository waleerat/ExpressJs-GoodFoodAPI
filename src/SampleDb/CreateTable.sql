
create type enum_status as enum('active', 'inactive', 'trash');
create type enum_approved as enum('approved', 'pedding', 'block');

--drop table if exists users;
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar(100) NOT NULL,
  "password" varchar(100) NOT NULL,
  "email" varchar(100) NOT NULL,
  "first_name" varchar(100),
  "last_name" varchar(100),
  "image" varchar(255),
  "website" varchar(255),
  "facebook" varchar(255),
  "instagram" varchar(255),
  "approved" enum_appoved NOT NULL  DEFAULT 'approved',
  "token" varchar(255) UNIQUE NOT NULL,
  "create_date" timestamp NOT NULL DEFAULT (current_timestamp),
  "update_date" timestamp NOT NULL DEFAULT (current_timestamp)
);
--drop table if exists ingredients;
CREATE TABLE "ingredients" (
  "id" SERIAL PRIMARY KEY,
  "user_id" integer NOT NULL,
  "slug" varchar(50)  NOT NULL,
  "title" varchar(90),
  "description" text,
  "remark" varchar(255),
  "image" varchar(255),
  "status" enum_status NOT NULL DEFAULT 'active',
  "create_date" timestamp NOT NULL DEFAULT (current_timestamp),
  "update_date" timestamp NOT NULL DEFAULT (current_timestamp)
);
--drop table if exists categories;
CREATE TABLE "categories" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "slug" varchar(50)  NOT NULL,
  "title" varchar(90),
  "description" text,
  "remark" varchar(255),
  "image" varchar(255),
  "status" enum_status NOT NULL DEFAULT 'active',
  "create_date" timestamp NOT NULL DEFAULT (current_timestamp),
  "update_date" timestamp NOT NULL DEFAULT (current_timestamp)
);
--drop table if exists recipes;
CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY,
  "user_id" integer NOT NULL,
  "category_id" integer NOT NULL,
  "slug" varchar(50)  NOT NULL,
  "title" varchar(90),
  "description" text,
  "remark" varchar(255),
  "image" varchar(255),
  "status" enum_status NOT NULL DEFAULT 'active',
  "create_date" timestamp NOT NULL DEFAULT (current_timestamp),
  "update_date" timestamp NOT NULL DEFAULT (current_timestamp)
);

--drop table if exists recipe_howto;
CREATE TABLE "recipe_howto" (
  "id" SERIAL PRIMARY KEY,
  "user_id" integer NOT NULL,
  "recipe_id" integer NOT NULL,
  "order_step" integer NOT NULL,
  "description" text,
  "remark" varchar(255),
  "image" varchar(255),
  "hide_title" boolean NOT NULL DEFAULT true,
  "status" enum_status NOT NULL DEFAULT 'active',
  "create_date" timestamp NOT NULL DEFAULT (current_timestamp),
  "update_date" timestamp NOT NULL DEFAULT (current_timestamp)
);


--drop table if exists ingredient;

CREATE TABLE "ingredient" (
  "ingredient_id" integer NOT NULL,
  "recipe_id" integer NOT NULL,
  "amount" varchar(50) NOT NULL,
  "status" enum_status NOT NULL DEFAULT 'active'
);

--drop table if exists authen_token;

CREATE TABLE "authen_token" (
  "user_id" integer NOT NULL,
  "token_id" varchar(255) NOT NULL,
  "status" enum_status NOT NULL DEFAULT 'active',
  "create_date" timestamp NOT NULL DEFAULT (current_timestamp)
);

ALTER TABLE "recipes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "ingredient" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");

ALTER TABLE "ingredient" ADD FOREIGN KEY ("ingredient_id") REFERENCES "ingredients" ("id");

ALTER TABLE "recipe_howto" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");

ALTER TABLE "recipe_howto" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "ingredients" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "recipes" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "authen_token" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");


CREATE UNIQUE INDEX category_userid_and_slug_unique
    ON categories USING btree
    (user_id ASC NULLS LAST, slug COLLATE pg_catalog."default" ASC NULLS LAST);
 

CREATE UNIQUE INDEX recipe_userid_and_slug_unique
    ON recipes USING btree
    (user_id ASC NULLS LAST, slug COLLATE pg_catalog."default" ASC NULLS LAST);

 
CREATE UNIQUE INDEX ingredient_userid_and_slug_unique
    ON ingredients USING btree
    (slug COLLATE pg_catalog."default" ASC NULLS LAST, user_id ASC NULLS LAST);
	
CREATE UNIQUE INDEX recipe_howto_order_step_key
    ON recipe_howto USING btree
    (recipe_id ASC NULLS LAST, order_step ASC NULLS LAST);

  CREATE UNIQUE INDEX recipe_id_and_ingredient_id_unique
    ON public.ingredient_bundle USING btree
    (ingredient_id ASC NULLS LAST, recipe_id ASC NULLS LAST);


    CREATE UNIQUE INDEX users_username_unique
    ON public.users USING btree
    (username COLLATE pg_catalog."default" ASC NULLS LAST);