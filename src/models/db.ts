import { PrismaClient } from '@prisma/client'

export const prismaClientSingleton = () => new PrismaClient()

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prismaClient = globalThis.prisma ?? prismaClientSingleton()

export default prismaClient
