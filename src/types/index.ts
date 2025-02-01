import { Request } from 'express';
import { Config } from '../config';
import { JobEmployerProfile } from '../entity/JobEmployer';
import { User } from '../entity/User';
import { JobSeekerProfile } from '../entity/JobSeeker';

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
}
export interface RegisterUserRequest extends Request {
    body: UserData;
}
export const user = {
    firstName: Config.firstName,
    lastName: Config.lastName,
    email: Config.email,
    password: Config.password,
    role: Config.role,
};
export const user1 = {
    email: Config.email,
    password: Config.password,
};
export interface Authrequest extends Request {
    auth: {
        sub: number;
        role: string;
    };
    user: string;
}
export type AuthCookie = {
    refreshToken: string;
};
export interface AuthTokens {
    accessToken: string | null;
}
export interface IRefreshToken {
    id: string;
}
export interface Reqpayload extends Request {
    auth: {
        sub: number;
        role: string;
        id: number;
    };
}

export interface ITenant {
    name: string;
    adminId: string;
    address?: {
        country?: string;
        state?: string;
        city?: string;
        street?: string;
        postalCode?: string;
    };
    description?: string;
    industry?: string;
    size?: string;
    type?: string;
    locations?: string[];
    logo?: string;
    verificationStatus?: string;
    employers?: JobEmployerProfile[];
    jobs?: Array<Record<string, string>>;
}
export interface ItenantRequest extends Request {
    body: ITenant;
}
export interface IdReq extends Request {
    body: {
        id: number;
    };
}
export interface updateReq extends Request {
    body: User & JobSeekerProfile;
}
export interface Query {
    currentPage: number;
    perPage: number;
    q: string;
    role: string;
}

export interface Review {
    rating: number;
    user: number;
    comment: string;
    company: number;
}

export type UserOrJobSeeker = User & JobSeekerProfile;

type Skill = {
    name: string;
    level: number;
};

type Experience = {
    id: number;
    role: string;
    company: string;
    logo: string;
    period: string;
    description: string;
};

type Education = {
    id: number;
    degree: string;
    school: string;
    logo: string;
    year: string;
    description: string;
};

type Project = {
    id: number;
    name: string;
    description: string;
    link: string;
    image: string;
};

type Testimonial = {
    id: number;
    name: string;
    role: string;
    content: string;
};

type Certification = {
    id: number;
    name: string;
    year: number;
};

type Language = {
    id: number;
    name: string;
    level: string;
};
interface Achievement {
    id: number;
    description?: string;
}
export interface Profile {
    id: number;
    name?: string;
    title?: string;
    avatar?: string;
    location?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    about?: string;
    skills?: Skill[];
    experience?: Experience[];
    education?: Education[];
    projects?: Project[];
    testimonials?: Testimonial[];
    achievements?: Achievement[];
    certifications?: Certification[];
    languages?: Language[];
}

export interface JobseekerInterface extends Request {
    body: Profile;
}
