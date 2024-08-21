import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userEmail: string): Promise<Task> {
    const data: Prisma.TaskCreateInput = {
      title: createTaskDto.title,
      description: createTaskDto.description,
      dueDate: this.dateFormater(createTaskDto.dueDate),
      status: createTaskDto.status || 'PENDING',
      assignedTo: { connect: { email: userEmail } },
    };

    return this.prisma.task.create({ data });
  }

  async findAll(userEmail: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { assignedTo: { email: userEmail } },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findOne(id: number, userEmail: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id, assignedTo: { email: userEmail } },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!task || task.assignedTo.email !== userEmail) {
      throw new UnauthorizedException('You do not have access to this task');
    }

    return task;
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    userEmail: string,
  ): Promise<Task> {
    const task = await this.findOne(id, userEmail);

    if (!task) {
      throw new UnauthorizedException(
        'You do not have access to update this task',
      );
    }

    const data: Prisma.TaskUpdateInput = {
      title: updateTaskDto.title,
      description: updateTaskDto.description,
      dueDate: this.dateFormater(updateTaskDto.dueDate),
      status: updateTaskDto.status,
    };

    return this.prisma.task.update({
      where: { id, assignedTo: { email: userEmail } },
      data,
    });
  }

  async remove(id: number, userEmail: string): Promise<Task> {
    const task = await this.findOne(id, userEmail);

    if (!task) {
      throw new UnauthorizedException('You do not have access to this task');
    }

    return this.prisma.task.delete({
      where: { id, assignedTo: { email: userEmail } },
    });
  }
  private dateFormater(date: string) {
    const dateString = date;
    const [month, day, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }
}
