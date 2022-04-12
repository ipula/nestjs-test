import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
});


const mockUser = {
    username: 'ipula',
    id: 'someId',
    password: 'test',
    tasks: []
}

describe('TasksService', () => {
    let tasksService: TasksService;
    let taskRepository;

    beforeEach(async () => {
        // initialize a NestJS module with tasksService and tasksRepository
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTasksRepository }
            ],

        }).compile();

        tasksService = await module.get(TasksService);
        taskRepository = await module.get(TaskRepository);
    })

    describe('getTasks', () => {
        it('calls TasksRepository.getTasks and return the result', async () => {
            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            taskRepository.getTasks.mockResolvedValue('someValue');
            //call tasksService.getTasks(), which should then call the repository's getTasks
            const result = await tasksService.getTasks(null, mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('someValue')
        })
    });

    describe('getTaskById', () => {
        it('calls TasksRepository.findOne and return the result', async () => {
            const mockTask = {
                title: 'title',
                description: 'Test desc',
                id: 'someId',
                status: TaskStatus.DONE
            };
            taskRepository.findOne.mockResolvedValue(mockTask);
            const result = await tasksService.getTaskById('someId', mockUser);
            expect(result).toEqual(mockTask);


        });

        it('calls TasksRepository.findOne and handle error', async () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(NotFoundException)
        })
    })
});