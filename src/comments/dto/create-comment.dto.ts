import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsUUID()
  postId: string;

  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  userFirstName: string;

  @IsNotEmpty()
  @IsString()
  userLastName: string;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsOptional()
  @IsString()
  userImageUrl?: string;
}
