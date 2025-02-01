/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { Tenant } from './Tenant';

@Entity({ name: 'JobEmployerProfile' })
export class JobEmployerProfile {
    @PrimaryGeneratedColumn()
    id: string;

    @OneToOne(() => User, (user) => user.jobEmployerProfile, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    user: User;

    @ManyToOne(() => Tenant, (company) => company, { onDelete: 'SET NULL' })
    @JoinColumn()
    company: Tenant;

    roleInCompany?: string; // Employer's role in the company (e.g., "HR Manager", "Recruiter")
    contactNumber?: string; // Employer's contact number
    department?: string; // Department the employer works in
    jobPostings?: string[]; // IDs of job postings created by this employer
}
