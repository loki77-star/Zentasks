import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async getAll(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
      include: { subtasks: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
      include: { subtasks: true },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto, userId: string) {
    const { title, description, status, priority, dueDate, subtasks } = createTaskDto;

    return this.prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        userId,
        subtasks: {
          create: subtasks ? subtasks.map(st => ({ title: st.title })) : [],
        },
      },
      include: { subtasks: true },
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    // Check if task exists and belongs to the user
    await this.getOne(id, userId);

    const { title, description, status, priority, dueDate, subtasks } = updateTaskDto;

    // Handle nested subtasks update if provided
    if (subtasks !== undefined) {
      // 1. Get existing subtasks for this task
      const existingSubtasks = await this.prisma.subtask.findMany({
        where: { taskId: id },
      });

      const existingIds = existingSubtasks.map(st => st.id);
      const incomingIds = subtasks.filter(st => st.id).map(st => st.id as string);

      // 2. Identify subtasks to delete (present in DB but not in update payload)
      const idsToDelete = existingIds.filter(dbId => !incomingIds.includes(dbId));
      if (idsToDelete.length > 0) {
        await this.prisma.subtask.deleteMany({
          where: { id: { in: idsToDelete } },
        });
      }

      // 3. Update existing and create new subtasks
      for (const st of subtasks) {
        if (st.id && existingIds.includes(st.id)) {
          // Update existing
          await this.prisma.subtask.update({
            where: { id: st.id },
            data: {
              title: st.title,
              isCompleted: st.isCompleted ?? false,
            },
          });
        } else {
          // Create new
          await this.prisma.subtask.create({
            data: {
              title: st.title,
              isCompleted: st.isCompleted ?? false,
              taskId: id,
            },
          });
        }
      }
    }

    // Update main task properties
    return this.prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
      include: { subtasks: true },
    });
  }

  async delete(id: string, userId: string) {
    await this.getOne(id, userId);
    await this.prisma.task.delete({
      where: { id },
    });
    return { success: true, message: `Task with ID "${id}" successfully deleted` };
  }
}
