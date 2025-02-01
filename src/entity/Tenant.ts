import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { JobEmployerProfile } from './JobEmployer';
import { CompanyReview } from './Companyreview';

@Entity({ name: 'tenants' })
export class Tenant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { nullable: true })
    adminId: string;

    @Column('varchar', { length: 100 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string; // Brief description about the company

    @Column({ type: 'jsonb', nullable: true })
    address?: {
        country?: string;
        state?: string;
        city?: string;
        street?: string;
        postalCode?: string;
    };
    @Column({ type: 'varchar', length: 100, nullable: true })
    industry?: string; // Industry the company belongs to (e.g., IT, Finance, Healthcare)

    @Column({ type: 'varchar', length: 100, nullable: true })
    size?: string; // Company size (e.g., Small, Medium, Large)

    @Column({ type: 'varchar', length: 100, nullable: true })
    type?: string; // Public, Private, Government, etc.
    @Column({ type: 'simple-array', nullable: true })
    locations?: string[]; // Additional office locations

    @Column({ type: 'varchar', length: 255, nullable: true })
    logo?: string; // URL of the company's logo

    @Column({
        type: 'varchar',
        enum: ['Verified', 'Pending', 'Rejected'],
        default: 'Pending',
    })
    verificationStatus?: string; // Verified, Pending, or Rejected

    @OneToMany(
        () => JobEmployerProfile,
        (employerProfile) => employerProfile.company,
        { cascade: true },
    )
    employers?: JobEmployerProfile[]; // Employers working for the company

    @OneToMany(() => CompanyReview, (CompanyReview) => CompanyReview.company, {
        cascade: true,
    })
    reviews?: CompanyReview[]; // Employers working for the company

    @Column({ type: 'jsonb', nullable: true })
    jobs?: Array<Record<string, string>>;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
