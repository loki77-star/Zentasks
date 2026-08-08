import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAll(@GetUser() user: { id: string }) {
    return this.tasksService.getAll(user.id);
  }

  @Get(':id')
  getOne(@Param('id') id: string, @GetUser() user: { id: string }) {
    return this.tasksService.getOne(id, user.id);
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: { id: string }) {
    return this.tasksService.create(createTaskDto, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: { id: string },
  ) {
    return this.tasksService.update(id, updateTaskDto, user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @GetUser() user: { id: string }) {
    return this.tasksService.delete(id, user.id);
  }
}
