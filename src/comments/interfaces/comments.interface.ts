/* eslint-disable prettier/prettier */
import { Comment } from '../entities/comment.entity';

/* eslint-disable prettier/prettier */
export enum USER_ROLES {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface PaginatedComments {
  data: Comment[];
  currentPage: number;
  size: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PaginationPayload {
  page?: number;
  limit?: number;
}

export interface UserCommentsPaginationPayload extends PaginationPayload {
  userId: string;
}

export interface PostCommentsPaginationPayload extends PaginationPayload {
  postId: string;
}
