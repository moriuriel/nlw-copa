import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import ShortUniqueId from "short-unique-id";
import { z } from "zod";
import { prisma } from "./infrastructure/prisma";

async function bootstrap() {
  const fastify = Fastify({ logger: true });

  fastify.get("/pools/count", async () => {
    const total = await prisma.pools.count();

    return { total };
  });

  fastify.get("/users/count", async () => {
    const total = await prisma.users.count();

    return { total };
  });

  fastify.get("/guesses/count", async () => {
    const total = await prisma.guess.count();

    return { total };
  });

  fastify.post(
    "/pools",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const poolInput = z.object({
        title: z.string(),
      });

      const { title } = poolInput.parse(request.body);

      const generate = new ShortUniqueId({ length: 6 });
      const code = String(generate()).toUpperCase();

      await prisma.pools.create({
        data: {
          title,
          code,
        },
      });

      return reply.status(201).send({ code });
    }
  );

  await fastify.listen({ port: 3331, host: "0.0.0.0" });
}

bootstrap();
