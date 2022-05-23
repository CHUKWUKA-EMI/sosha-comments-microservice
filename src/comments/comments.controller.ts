import { Controller, Delete, Param, Patch, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AllRPCExceptionsFilter } from 'all-rpc-exception-filters';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  PostCommentsPaginationPayload,
  UserCommentsPaginationPayload,
} from './interfaces/comments.interface';

interface deleteCommentPayload {
  id: string;
  userId: string;
}

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseFilters(new AllRPCExceptionsFilter())
  @MessagePattern({ role: 'comments', cmd: 'create' })
  create(@Payload() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @UseFilters(new AllRPCExceptionsFilter())
  @MessagePattern({ role: 'comments', cmd: 'findAll' })
  findAll(payload: PostCommentsPaginationPayload) {
    return this.commentsService.findAll(payload);
  }

  @UseFilters(new AllRPCExceptionsFilter())
  @MessagePattern({ role: 'comments', cmd: 'findOne' })
  findOne(@Payload() id: string) {
    return this.commentsService.findOne(id);
  }

  @UseFilters(new AllRPCExceptionsFilter())
  @MessagePattern({ role: 'comments', cmd: 'findByUser' })
  findByUser(@Payload() payload: UserCommentsPaginationPayload) {
    return this.commentsService.findByUser(payload);
  }

  @UseFilters(new AllRPCExceptionsFilter())
  @MessagePattern({ role: 'comments', cmd: 'update' })
  update(@Payload() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(updateCommentDto);
  }

  @UseFilters(new AllRPCExceptionsFilter())
  @MessagePattern({ role: 'comments', cmd: 'delete' })
  remove(@Payload() payload: deleteCommentPayload) {
    return this.commentsService.remove(payload.id, payload.userId);
  }

  @Patch('comments/repliesCount/:id')
  async incrementRepliesCount(@Param('id') id: string) {
    await this.commentsService.incrementRepliesCount(id);
  }

  @Delete('comments/repliesCount/:id')
  async decrementRepliesCount(@Param('id') id: string) {
    await this.commentsService.decrementRepliesCount(id);
  }
}
