import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('../prisma/prisma.service', () => {
  return {
    PrismaService: jest.fn().mockImplementation(() => ({
      task: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    })),
  };
});

describe('TasksService', () => {
  let service: TasksService;
  let prisma: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, PrismaService],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test task',
        description: 'Test description',
        dueDate: '08/20/2024',
        status: TaskStatus.PENDING,
      };

      const userEmail = 'john@example.com';

      const createdTask = {
        id: 1,
        ...createTaskDto,
        assignedTo: {
          id: 1,
          name: 'John Doe',
          email: userEmail,
        },
      };

      prisma.task.create.mockResolvedValue(createdTask);

      expect(await service.create(createTaskDto, userEmail)).toEqual(
        createdTask,
      );
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          title: 'Test task',
          description: 'Test description',
          dueDate: new Date(2024, 7, 20), // Date should be correctly formatted
          status: 'PENDING',
          assignedTo: { connect: { email: userEmail } },
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks for the authenticated user', async () => {
      const tasks = [
        {
          id: 1,
          title: 'Test task',
          description: 'Test description',
          dueDate: new Date(),
          status: TaskStatus.PENDING,
          assignedTo: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
      ];

      const userEmail = 'john@example.com';

      prisma.task.findMany.mockResolvedValue(tasks);

      expect(await service.findAll(userEmail)).toEqual(tasks);
      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: { assignedTo: { email: userEmail } },
        include: {
          assignedTo: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a task by ID for the authenticated user', async () => {
      const task = {
        id: 1,
        title: 'Test task',
        description: 'Test description',
        dueDate: new Date(),
        status: TaskStatus.PENDING,
        assignedTo: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
        },
      };

      const userEmail = 'john@example.com';

      prisma.task.findUnique.mockResolvedValue(task);

      expect(await service.findOne(1, userEmail)).toEqual(task);
      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: 1, assignedTo: { email: userEmail } },
        include: {
          assignedTo: true,
        },
      });
    });

    it('should throw an UnauthorizedException if the task is not found', async () => {
      const userEmail = 'john@example.com';

      prisma.task.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1, userEmail)).rejects.toThrow(
        new UnauthorizedException('You do not have access to this task'),
      );
    });
  });

  describe('update', () => {
    it('should update a task by ID for the authenticated user', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated task',
        description: 'Updated description',
        dueDate: '08/21/2024',
        status: TaskStatus.IN_PROGRESS,
      };

      const userEmail = 'john@example.com';

      const existingTask = {
        id: 1,
        ...updateTaskDto,
        userId: 1,
        assignedTo: {
          id: 1,
          name: 'John Doe',
          email: userEmail,
        },
      };

      prisma.task.findUnique.mockResolvedValue(existingTask);
      prisma.task.update.mockResolvedValue(existingTask);

      expect(await service.update(1, updateTaskDto, userEmail)).toEqual(
        existingTask,
      );
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: 1, assignedTo: { email: userEmail } },
        data: {
          title: 'Updated task',
          description: 'Updated description',
          dueDate: new Date(2024, 7, 21),
          status: TaskStatus.IN_PROGRESS,
        },
      });
    });
  });

  describe('remove', () => {
    it('should remove a task by ID for the authenticated user', async () => {
      const taskToRemove = {
        id: 1,
        title: 'Test task',
        description: 'Test description',
        dueDate: new Date(),
        status: TaskStatus.PENDING,
        assignedTo: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
        },
      };

      const userEmail = 'john@example.com';

      prisma.task.findUnique.mockResolvedValue(taskToRemove);
      prisma.task.delete.mockResolvedValue(taskToRemove);

      expect(await service.remove(1, userEmail)).toEqual(taskToRemove);
      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: { id: 1, assignedTo: { email: userEmail } },
      });
    });

    it('should throw an UnauthorizedException if the task is not found', async () => {
      const userEmail = 'john@example.com';

      prisma.task.findUnique.mockResolvedValue(null);

      await expect(service.remove(1, userEmail)).rejects.toThrow(
        new UnauthorizedException('You do not have access to this task'),
      );
    });
  });
});
