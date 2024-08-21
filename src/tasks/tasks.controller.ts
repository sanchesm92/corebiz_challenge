import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('tasks')
@Controller('tasks')
@ApiBearerAuth('auth-token')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description:
      'Task successfully created and associated with the authenticated user.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input provided.' })
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: any) {
    const userEmail = req.user.email;
    return this.tasksService.create(createTaskDto, userEmail);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all tasks for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'List of tasks retrieved successfully.',
  })
  findAll(@Req() req: any) {
    const userEmail = req.user.email;
    return this.tasksService.findAll(userEmail);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific task by ID' })
  @ApiResponse({
    status: 200,
    description: 'Task retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @ApiParam({ name: 'id', description: 'The ID of the task to retrieve' })
  findOne(@Param('id') id: string, @Req() req: any) {
    const userEmail = req.user.email;
    return this.tasksService.findOne(+id, userEmail);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific task by ID' })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @ApiParam({ name: 'id', description: 'The ID of the task to update' })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: any,
  ) {
    const userEmail = req.user.email;
    return this.tasksService.update(+id, updateTaskDto, userEmail);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific task by ID' })
  @ApiResponse({
    status: 200,
    description: 'Task deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @ApiParam({ name: 'id', description: 'The ID of the task to delete' })
  remove(@Param('id') id: string, @Req() req: any) {
    const userEmail = req.user.email;
    return this.tasksService.remove(+id, userEmail);
  }
}
