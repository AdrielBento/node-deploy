import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import {z} from 'zod'

const server = fastify();

const prisma = new PrismaClient();

server.get("/users", async (request, reply) => {
  const users = await prisma.user.findMany();

  return {users}
});

server.post("/users", async (request, reply) => {
    const createUserSchema = z.object({
        name: z.string(),
        email: z.string().email(),      
    })
        

    const { name, email } = createUserSchema.parse(request.body);

    await prisma.user.create({
        data: {
            name,
            email
        }
    })


    return reply.status(201).send();

});


server.listen({
    host: "0.0.0.0", 
    port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => {
    console.log(`Server listening`);
})