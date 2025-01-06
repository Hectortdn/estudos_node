import { Knex } from "knex";

declare module "knex/types/tables" {
  interface User {
    id: string;
    name: string;
    email: string;
    created_at: Date;
    updated_at: Date;
    session_id?: string;
  }

  interface Meals {
    id: string;
    date: Date;
    name: string;
    user_id: sting;
    created_at: Date;
    updated_at: Date;
    description: string;
    is_on_diet: boolean
  }

  interface Tables {
    users: User;
    meals: Meals
  }
}
