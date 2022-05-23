import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), HttpModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
