import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '@prisma/client';

describe('TasksController', () => {
  let controller: TasksController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: TasksService;
  let prismaServiceMock: {
    task: {
      create: jest.Mock<any, any>;
      findMany: jest.Mock<any, any>;
      findUnique: jest.Mock<any, any>;
      update: jest.Mock<any, any>;
      delete: jest.Mock<any, any>;
    };
  };

  beforeEach(async () => {
    prismaServiceMock = {
      task: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        { provide: PrismaService, useValue: prismaServiceMock },
        { provide: JwtService, useValue: { sign: jest.fn() } },
        AuthGuard,
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      prismaServiceMock.task.create.mockResolvedValue(createdTask);

      expect(
        await controller.create(createTaskDto, { user: { email: userEmail } }),
      ).toEqual(createdTask);
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const tasks = [
        {
          id: 1,
          title: 'Test task',
          description: 'Test description',
          dueDate: new Date(),
          status: TaskStatus.PENDING,
          userId: 1,
          assignedTo: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
      ];

      const userEmail = 'john@example.com';

      prismaServiceMock.task.findMany.mockResolvedValue(tasks);

      expect(await controller.findAll({ user: { email: userEmail } })).toEqual(
        tasks,
      );
    });
  });

  describe('findOne', () => {
    it('should return a task by ID', async () => {
      const task = {
        id: 1,
        title: 'Test task',
        description: 'Test description',
        dueDate: new Date(),
        status: TaskStatus.PENDING,
        userId: 1,
        assignedTo: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
        },
      };

      const userEmail = 'john@example.com';

      prismaServiceMock.task.findUnique.mockResolvedValue(task);

      expect(
        await controller.findOne('1', { user: { email: userEmail } }),
      ).toEqual(task);
    });
  });

  describe('update', () => {
    it('should update a task by ID', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated task',
        description: 'Updated description',
        dueDate: '08/20/2024',
        status: TaskStatus.IN_PROGRESS,
      };

      const userEmail = 'john@example.com';

      const task = {
        id: 1,
        title: 'Test task',
        description: 'Test description',
        dueDate: new Date(),
        status: TaskStatus.PENDING,
        userId: 1,
        assignedTo: {
          id: 1,
          name: 'John Doe',
          email: userEmail, // Ensure the email matches the userEmail
        },
      };

      const updatedTask = {
        ...task,
        ...updateTaskDto,
      };

      prismaServiceMock.task.findUnique.mockResolvedValue(task);
      prismaServiceMock.task.update.mockResolvedValue(updatedTask);

      expect(
        await controller.update('1', updateTaskDto, {
          user: { email: userEmail },
        }),
      ).toEqual(updatedTask);
    });
  });

  describe('remove', () => {
    it('should remove a task by ID', async () => {
      const task = {
        id: 1,
        title: 'Test task',
        description: 'Test description',
        dueDate: new Date(),
        status: TaskStatus.PENDING,
        userId: 1,
        assignedTo: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
        },
      };

      const userEmail = 'john@example.com';

      prismaServiceMock.task.findUnique.mockResolvedValue(task);
      prismaServiceMock.task.delete.mockResolvedValue(task);

      expect(
        await controller.remove('1', { user: { email: userEmail } }),
      ).toEqual(task);
    });
  });
});
