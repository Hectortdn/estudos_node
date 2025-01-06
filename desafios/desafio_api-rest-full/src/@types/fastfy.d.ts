// FastifyRequestContext
import "fastify";

declare module "fastify" {
  export interface FastifyRequest {
    user?: {
      id: string;
      name: string;
      email: string;
      created_at: Date;
      updated_at: Date;
      session_id?: string;
    };
  }
}
