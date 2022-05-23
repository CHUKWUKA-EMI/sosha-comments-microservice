import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  userFirstName: string;

  @Column({ nullable: false })
  userLastName: string;

  @Column({ nullable: false })
  userName: string;

  @Column({ nullable: true })
  userImageUrl?: string;

  @Column({ nullable: false })
  postId: string;

  @Column('text', { nullable: false })
  comment: string;

  @Column({ default: 0 })
  numberOfReplies: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
