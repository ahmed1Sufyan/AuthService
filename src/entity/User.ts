import {
    Column,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { JobSeekerProfile } from './JobSeeker';
import { JobEmployerProfile } from './JobEmployer';
import { CompanyReview, ReviewReaction } from './Companyreview';

//   @Entity({name : "users"}) // Maps to the "job_seekers" table
//   export class User {
// @PrimaryGeneratedColumn()
// id: string;

// @Column()
// firstName: string;

// @Column()
// lastName: string;

// @Column()
// email: string;

// @Column()
// password: string;

// @Column({ type: "varchar", length: 15, unique: true })
// phoneNumber?: string;

// @Column({ type: "text", nullable: true })
// profile_picture?: string;

// @Column({ type: "text", nullable: true })
// resume?: string;

// @Column({ type: "json", nullable: true })
// location?: Record<string, any>;

// @Column({ type: "json", nullable: true })
// education?: Array<Record<string, any>>;

// @Column({ type: "json", nullable: true })
// work_experience?: Array<Record<string, any>>;

// @Column({ type: "text", nullable: true })
// skills?: string;

// @Column({ type: "text", nullable: true })
// languages?: string;

// @Column({ type: "json", nullable: true })
// industry_preferences?: Array<string>;

// @Column({ type: "enum", enum: ["Full-time", "Part-time", "Freelance", "Internship"], nullable: true })
// job_type_preferences?: string;

// @Column({ type: "enum", enum: ["Immediate", "Within 1 month", "Within 3 months"], nullable: true })
// availability?: string;

// @Column({ type: "text", nullable: true })
// bio?: string;

// @Column({ type: "json", nullable: true })
// social_links?: Record<string, string>;

// @Column({ type: "json", nullable: true })
// applied_jobs?: Array<string>;

// @Column({ type: "json", nullable: true })
// saved_jobs?: Array<string>;

// @Column({ type: "boolean", default: true })
// notifications?: boolean;

// @Column({ type: "enum", enum: ["active", "inactive", "banned"], default: "active" })
// account_status?: string;

// @CreateDateColumn({ type: "timestamp" })
// created_at: Date;

// @UpdateDateColumn({ type: "timestamp" })
// updated_at: Date;

//     @ManyToOne(() => Tenant)
//     tenant: Tenant;
//     @Column()
//     role: string;
//   }

// export class Location {
//     @Column({ nullable: true })
//     country?: string;

//     @Column({ nullable: true })
//     state?: string;

//     @Column({ nullable: true })
//     city?: string;

//     @Column({ nullable: true })
//     postal_code?: string;

//     @Column({ nullable: true })
//     latitude?: number;

//     @Column({ nullable: true })
//     longitude?: number;
//   }

// @Entity({ name: 'users' })
// export class User {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column()
//     firstName: string;
//     @Column()
//     lastName: string;
//     @Column()
//     email: string;
//     @Column()
//     password: string;

//     // @ManyToOne(() => Tenant)
//     // tenant?: Tenant;
//     @Column({enum : ["jobseeker", "recruiter", "admin"]})
//     role?: string;
// }

export enum UserRole {
    JOB_SEEKER = 'job_seeker',
    JOB_EMPLOYER = 'job_employer',
    ADMIN = 'admin',
}
@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    profileUrl?: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.JOB_SEEKER })
    role: UserRole;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    @OneToMany(() => CompanyReview, (review) => review.user)
    reviews: CompanyReview[];

    // Relationship with Reactions
    @OneToMany(() => ReviewReaction, (reaction) => reaction.user)
    reactions: ReviewReaction[];

    @OneToOne(
        () => JobSeekerProfile,
        (jobSeekerProfile) => jobSeekerProfile.user,
        { nullable: true },
    )
    jobSeekerProfile?: JobSeekerProfile;

    @OneToOne(
        () => JobEmployerProfile,
        (jobEmployerProfile) => jobEmployerProfile.user,
        { nullable: true },
    )
    jobEmployerProfile?: JobEmployerProfile;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
