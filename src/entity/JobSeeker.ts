import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './User'; // Assuming you have a User entity

@Entity()
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    country?: string;

    @Column()
    state?: string;

    @Column()
    city?: string;

    @Column()
    postalCode?: string;
}
@Entity()
export class JobSeekerProfile {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ length: 25, unique: true })
    phone: string;

    @Column({ length: 100 })
    title: string;

    @Column({ type: 'text', nullable: true })
    about?: string;

    @OneToOne(() => User, (user) => user.jobSeekerProfile, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    user: User;

    @Column({ nullable: true })
    resume?: string;

    @Column({ type: 'jsonb', nullable: true }) // Store skills as structured data
    skills?: Skill[];

    @Column({ nullable: true })
    portfolioUrl?: string;
    @Column({ nullable: true })
    avatar?: string;

    @OneToMany(() => Project, (project) => project.jobSeekerProfile, {
        cascade: true,
    })
    @JoinColumn()
    projects?: Project[];

    @OneToMany(
        () => Testimonial,
        (testimonial) => testimonial.jobSeekerProfile,
        { cascade: true },
    )
    @JoinColumn()
    testimonials?: Testimonial[];

    @OneToMany(
        () => Achievement,
        (achievement) => achievement.jobSeekerProfile,
        { cascade: true },
    )
    @JoinColumn()
    achievements?: Achievement[];

    @OneToMany(
        () => Certification,
        (certification) => certification.jobSeekerProfile,
        { cascade: true },
    )
    @JoinColumn()
    certifications?: Certification[];

    @OneToMany(
        () => LanguageProficiency,
        (language) => language.jobSeekerProfile,
        { cascade: true },
    )
    @JoinColumn()
    languages?: LanguageProficiency[];

    @OneToMany(() => WorkExperience, (work) => work.jobSeekerProfile, {
        cascade: true,
    })
    @JoinColumn()
    workExperience?: WorkExperience[];

    @ManyToOne(() => Location, (location) => location.id, {
        nullable: true,
        cascade: true,
    })
    @JoinColumn()
    location?: Location;

    @Column({ type: 'varchar', nullable: true })
    linkedin?: string;

    @Column({ type: 'varchar', nullable: true })
    github?: string;

    @OneToMany(() => Education, (education) => education.jobSeekerProfile, {
        cascade: true,
    })
    @JoinColumn()
    education: Education[];
}
@Entity()
export class Education {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    school: string;

    @Column()
    degree: string;

    @Column()
    fieldOfStudy: string;

    @Column()
    description: string;

    @Column({ nullable: true })
    grade?: string;

    @Column()
    year: Date;

    @ManyToOne(() => JobSeekerProfile, (profile) => profile.education, {
        onDelete: 'CASCADE',
    })
    jobSeekerProfile: JobSeekerProfile;
}

@Entity()
export class WorkExperience {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    role: string;

    @Column()
    logo?: string; // Remote, Hybrid, On-site

    @Column()
    company: string;

    @Column()
    startDate: string;

    @Column({ nullable: true })
    endDate?: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @ManyToOne(() => JobSeekerProfile, (profile) => profile.workExperience, {
        onDelete: 'CASCADE',
    })
    jobSeekerProfile: JobSeekerProfile;
}

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    image?: string;

    @Column({ nullable: true })
    deployLink?: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ nullable: true })
    link?: string;

    @ManyToOne(() => JobSeekerProfile, (profile) => profile.projects, {
        onDelete: 'CASCADE',
    })
    jobSeekerProfile: JobSeekerProfile;
}

@Entity()
export class Testimonial {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    content: string;

    @Column()
    name: string;

    @Column()
    role: string;

    @ManyToOne(() => JobSeekerProfile, (profile) => profile.testimonials, {
        onDelete: 'CASCADE',
    })
    jobSeekerProfile: JobSeekerProfile;
}

@Entity()
export class Achievement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description?: string;

    @ManyToOne(() => JobSeekerProfile, (profile) => profile.achievements, {
        onDelete: 'CASCADE',
    })
    jobSeekerProfile: JobSeekerProfile;
}

@Entity()
export class Certification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    year: number;

    @ManyToOne(() => JobSeekerProfile, (profile) => profile.certifications, {
        onDelete: 'CASCADE',
    })
    jobSeekerProfile: JobSeekerProfile;
}

@Entity()
export class LanguageProficiency {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    level: string; // Beginner, Intermediate, Advanced, Fluent

    @ManyToOne(() => JobSeekerProfile, (profile) => profile.languages, {
        onDelete: 'CASCADE',
    })
    jobSeekerProfile: JobSeekerProfile;
}

export class Skill {
    name: string;
    level: number;
}
