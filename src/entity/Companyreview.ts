import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { User } from './User';
import { Tenant } from './Tenant';

@Entity()
export class CompanyReview {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'float' })
    rating: number;

    @Column({ type: 'text' })
    comment: string;

    @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Tenant, (Tenant) => Tenant.reviews, {
        onDelete: 'CASCADE',
    })
    company: Tenant;

    @OneToMany(() => ReviewReaction, (reaction) => reaction.review)
    reactions: ReviewReaction[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

@Entity()
export class ReviewReaction {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => CompanyReview, (review) => review.reactions, {
        onDelete: 'CASCADE',
    })
    review: CompanyReview;

    @ManyToOne(() => User, (user) => user.reactions, { onDelete: 'CASCADE' })
    user: User;

    @Column({ type: 'enum', enum: ['like', 'unlike'] })
    type: 'like' | 'unlike'; // Indicates if it's a like or unlike

    @CreateDateColumn()
    reactedAt: Date;
}
