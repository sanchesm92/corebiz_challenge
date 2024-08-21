import { PrismaClient, TaskStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      name: 'Alice',
      password: 'password',
      email: 'alice@email.com',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Bob',
      password: 'password',
      email: 'bob@email.com',
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: 'Task 1',
        description: 'Description for Task 1',
        dueDate: new Date('2024-09-01T00:00:00.000Z'),
        status: TaskStatus.PENDING,
        userId: user1.id,
      },
      {
        title: 'Task 2',
        description: 'Description for Task 2',
        dueDate: new Date('2024-09-15T00:00:00.000Z'),
        status: TaskStatus.IN_PROGRESS,
        userId: user2.id,
      },
      {
        title: 'Task 3',
        description: 'Description for Task 3',
        dueDate: new Date('2024-10-01T00:00:00.000Z'),
        status: TaskStatus.COMPLETED,
        userId: user1.id,
      },
    ],
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
