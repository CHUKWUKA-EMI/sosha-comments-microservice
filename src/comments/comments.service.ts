import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { lastValueFrom, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import {
  PaginatedComments,
  PostCommentsPaginationPayload,
  UserCommentsPaginationPayload,
} from './interfaces/comments.interface';

const logger = new Logger('CommentsService');

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private httpService: HttpService,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    try {
      const comment = this.commentRepository.create(createCommentDto);
      const savedComment = await this.commentRepository.save(comment);
      //increment post's comments
      lastValueFrom(this.incrementPostComments(createCommentDto.postId));

      return savedComment;
    } catch (error) {
      logger.log('server error', error);
      throw new RpcException(error);
    }
  }

  async findAll({
    postId,
    limit = 10,
    page = 1,
  }: PostCommentsPaginationPayload): Promise<PaginatedComments> {
    try {
      const offset = (page - 1) * limit;
      const queryBuilder =
        this.commentRepository.createQueryBuilder('comments');
      const comments = await queryBuilder
        .where('comments.postId = :postId', { postId })
        .take(limit)
        .skip(offset)
        .orderBy('comments.createdAt', 'DESC')
        .cache({ enabled: true })
        .getMany();

      //pagination metadata
      const totalComments = await queryBuilder
        .where('comments.postId = :postId', { postId })
        .getCount();
      const totalPages = Math.ceil(totalComments / limit);
      const hasNext = page < totalPages;
      const hasPrevious = page > 1;

      //return post's comments
      const resData: PaginatedComments = {
        data: comments.length > 0 ? comments : [],
        currentPage: page,
        hasNext,
        hasPrevious,
        size: comments.length,
        totalPages,
      };

      return resData;
    } catch (error) {
      logger.log('server error', error);
      throw new RpcException(error);
    }
  }

  async findByUser({
    userId,
    limit = 10,
    page = 1,
  }: UserCommentsPaginationPayload): Promise<PaginatedComments> {
    try {
      const offset = (page - 1) * limit;
      const queryBuilder =
        this.commentRepository.createQueryBuilder('comments');
      const comments = await queryBuilder
        .where('comments.userId = :userId', { userId })
        .take(limit)
        .skip(offset)
        .orderBy('comments.createdAt', 'DESC')
        .cache({ enabled: true })
        .getMany();

      //pagination metadata
      const totalComments = await queryBuilder
        .where('comments.userId = :userId', { userId })
        .getCount();
      const totalPages = Math.ceil(totalComments / limit);
      const hasNext = page < totalPages;
      const hasPrevious = page > 1;

      //return post's comments
      const resData: PaginatedComments = {
        data: comments.length > 0 ? comments : [],
        currentPage: page,
        hasNext,
        hasPrevious,
        size: comments.length,
        totalPages,
      };

      return resData;
    } catch (error) {
      logger.log('server error', error);
      throw new RpcException(error);
    }
  }

  async findOne(id: string): Promise<Comment> {
    try {
      const comment = await this.commentRepository.findOne(id);
      if (!comment) {
        throw new RpcException('Comment not found');
      }

      return comment;
    } catch (error) {
      logger.log('server error', error);
      throw new RpcException(error);
    }
  }

  async update(updateCommentDto: UpdateCommentDto): Promise<Comment> {
    try {
      const updatedComment = await this.commentRepository
        .createQueryBuilder()
        .update(Comment, { comment: updateCommentDto.comment })
        .where('id = :id', { id: updateCommentDto.id })
        .andWhere('userId = :userId', { userId: updateCommentDto.userId })
        .returning('*')
        .execute();

      return updatedComment.raw[0];
    } catch (error) {
      logger.log('server error', error);
      throw new RpcException(error);
    }
  }

  async remove(id: string, userId: string): Promise<Comment> {
    try {
      const deletedComment = await this.commentRepository
        .createQueryBuilder()
        .delete()
        .from(Comment)
        .where('id = :id', { id })
        .andWhere('userId = :userId', { userId })
        .returning('*')
        .execute();
      //decrement post's comments
      lastValueFrom(this.decrementPostComments(deletedComment.raw[0].postId));

      //return deleted comment
      return deletedComment.raw[0];
    } catch (error) {
      logger.log('server error', error);
      throw new RpcException(error);
    }
  }

  async incrementRepliesCount(id: string): Promise<string> {
    try {
      await this.commentRepository.increment({ id }, 'numberOfReplies', 1);
      return 'Comment replied';
    } catch (error) {
      logger.log('server error', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Ooops! Something broke from our end. Please retry',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async decrementRepliesCount(id: string): Promise<string> {
    try {
      await this.commentRepository.decrement({ id }, 'numberOfReplies', 1);
      return 'reply deleted';
    } catch (error) {
      logger.log('server error', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Ooops! Something broke from our end. Please retry',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private incrementPostComments(
    postId: string,
  ): Observable<AxiosResponse<void>> {
    const res$ = this.httpService.patch(
      `${process.env.POSTS_URL}/posts/comments/${postId}`,
    );
    return res$;
  }

  private decrementPostComments(
    postId: string,
  ): Observable<AxiosResponse<void>> {
    const res$ = this.httpService.delete(
      `${process.env.POSTS_URL}/posts/comments/${postId}`,
    );
    return res$;
  }
}
