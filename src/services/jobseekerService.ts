import { Repository } from 'typeorm';
import {
    Achievement,
    Certification,
    Education,
    JobSeekerProfile,
    LanguageProficiency,
    Location,
    Project,
    Testimonial,
    WorkExperience,
} from '../entity/JobSeeker';
// import { SeekerProfile } from "../controllers/JobSeekerController";
import { Profile } from '../types';
import { User } from '../entity/User';

export default class JobSeekerServices {
    constructor(
        private jobSeekerRepository: Repository<JobSeekerProfile>,
        private projects: Repository<Project>,
        private testimonials: Repository<Testimonial>,
        private achievements: Repository<Achievement>,
        private certifications: Repository<Certification>,
        private languages: Repository<LanguageProficiency>,
        private experience: Repository<WorkExperience>,
        private education: Repository<Education>,
        private location: Repository<Location>,
        private user: Repository<User>,
    ) {}
    createJobSeekerProfile = async (jobSeekerProfile: Profile, id: number) => {
        let projects = null,
            testimonials = null,
            achievements = null,
            certifications = null,
            languages = null,
            experience = null,
            education = null;

        let jobseeker = this.jobSeekerRepository.create({
            ...(jobSeekerProfile.phone && { phone: jobSeekerProfile.phone }),
            ...(jobSeekerProfile.title && { title: jobSeekerProfile.title }),
            ...(jobSeekerProfile.about && { about: jobSeekerProfile.about }),
            ...(jobSeekerProfile.github && { github: jobSeekerProfile.github }),
            ...(jobSeekerProfile.avatar && { avatar: jobSeekerProfile.avatar }),
            ...(jobSeekerProfile.linkedin && {
                linkedin: jobSeekerProfile.linkedin,
            }),
            ...(jobSeekerProfile.linkedin && {
                linkedin: jobSeekerProfile.linkedin,
            }),
            ...(jobSeekerProfile.skills && { skills: jobSeekerProfile.skills }),
            user: {
                id,
            },

            // location : jobSeekerProfile.location
        });
        jobseeker = await this.jobSeekerRepository.save(jobseeker);
        if (jobSeekerProfile.projects) {
            projects = jobSeekerProfile.projects.map((project) => {
                return this.projects.create({
                    name: project.name,
                    description: project.description,
                    image: project.image,
                    link: project.link,
                    jobSeekerProfile: jobseeker,
                });
            });
            await this.projects.save(projects);
        }
        if (jobSeekerProfile.testimonials) {
            testimonials = jobSeekerProfile.testimonials.map((testimonial) => {
                return this.testimonials.create({
                    content: testimonial.content,
                    name: testimonial.name,
                    role: testimonial.role,
                    jobSeekerProfile: jobseeker,
                });
            });
            await this.testimonials.save(testimonials);
        }
        if (jobSeekerProfile.achievements) {
            achievements = jobSeekerProfile.achievements.map((achievement) => {
                return this.achievements.create({
                    description: achievement.description,
                    jobSeekerProfile: jobseeker,
                });
            });
            await this.achievements.save(achievements);
        }
        if (jobSeekerProfile.certifications) {
            certifications = jobSeekerProfile.certifications.map(
                (certification) => {
                    return this.certifications.create({
                        name: certification.name,
                        year: certification.year,
                        jobSeekerProfile: jobseeker,
                    });
                },
            );
            await this.certifications.save(certifications);
        }
        if (jobSeekerProfile.languages) {
            languages = jobSeekerProfile.languages.map((language) => {
                return this.languages.create({
                    level: language.level,
                    name: language.name,
                    jobSeekerProfile: jobseeker,
                });
            });
            await this.languages.save(languages);
        }
        if (jobSeekerProfile.experience) {
            experience = jobSeekerProfile.experience.map((exp) => {
                return this.experience.create({
                    company: exp.company,
                    description: exp.description,
                    startDate: exp.period.split('-')[0],
                    endDate: exp.period.split('-')[1],
                    logo: exp.logo,
                    role: exp.role,
                    jobSeekerProfile: jobseeker,
                });
            });
            await this.experience.save(experience);
        }
        if (jobSeekerProfile.education) {
            education = jobSeekerProfile.education.map((edu) => {
                return this.education.create({
                    school: edu.school,
                    degree: edu.degree,
                    description: edu.description,
                    fieldOfStudy: edu.degree,
                    year: edu.year,
                    jobSeekerProfile: jobseeker,
                });
            });
            await this.education.save(education);
        }

        return await this.user.findOne({
            where: { id },
            relations: [
                'jobSeekerProfile',
                'jobSeekerProfile.workExperience',
                'jobSeekerProfile.education',
                'jobSeekerProfile.certifications',
                'jobSeekerProfile.projects',
                'jobSeekerProfile.testimonials',
                'jobSeekerProfile.achievements',
                'jobSeekerProfile.languages',
            ],
        });
    };
    getJobSeekerProfile = async (userId: string) => {
        return await this.jobSeekerRepository.findOne({
            where: { id: userId },
        });
    };
    getJobSeekerProfileById = async (id: string) => {
        return await this.jobSeekerRepository.findOne({ where: { id: id } });
    };
    deleteJobSeekerProfile = async (id: string) => {
        return await this.jobSeekerRepository.delete(id);
    };
    updateJobSeekerProfile = async (jobSeekerProfile: Profile, id: number) => {
        let jobseeker = await this.jobSeekerRepository.findOne({
            where: { user: { id } },
        });

        if (jobseeker) {
            // JobSeeker exist karta hai, toh update karo
            jobseeker = this.jobSeekerRepository.merge(jobseeker, {
                ...(jobSeekerProfile.phone && {
                    phone: jobSeekerProfile.phone,
                }),
                ...(jobSeekerProfile.title && {
                    title: jobSeekerProfile.title,
                }),
                ...(jobSeekerProfile.about && {
                    about: jobSeekerProfile.about,
                }),
                ...(jobSeekerProfile.github && {
                    github: jobSeekerProfile.github,
                }),
                ...(jobSeekerProfile.avatar && {
                    avatar: jobSeekerProfile.avatar,
                }),
                ...(jobSeekerProfile.linkedin && {
                    linkedin: jobSeekerProfile.linkedin,
                }),
                ...(jobSeekerProfile.skills && {
                    skills: jobSeekerProfile.skills,
                }),
            });

            await this.jobSeekerRepository.save(jobseeker);
        } else {
            // JobSeeker exist nahi karta, toh create karo
            jobseeker = this.jobSeekerRepository.create({
                ...(jobSeekerProfile.phone && {
                    phone: jobSeekerProfile.phone,
                }),
                ...(jobSeekerProfile.title && {
                    title: jobSeekerProfile.title,
                }),
                ...(jobSeekerProfile.about && {
                    about: jobSeekerProfile.about,
                }),
                ...(jobSeekerProfile.github && {
                    github: jobSeekerProfile.github,
                }),
                ...(jobSeekerProfile.avatar && {
                    avatar: jobSeekerProfile.avatar,
                }),
                ...(jobSeekerProfile.linkedin && {
                    linkedin: jobSeekerProfile.linkedin,
                }),
                ...(jobSeekerProfile.skills && {
                    skills: jobSeekerProfile.skills,
                }),
                ...(jobSeekerProfile.location && {
                    location: {
                        city: jobSeekerProfile.location.split('-')[0],
                        state: jobSeekerProfile.location.split('-')[1],
                        country: jobSeekerProfile.location.split('-')[2],
                    },
                }),
                user: { id },
            });

            jobseeker = await this.jobSeekerRepository.save(jobseeker);
        }
        //     if(jobSeekerProfile.location)
        //     {
        //         const existingProject = await this.location.findOne({ where: { id: 1 } });
        //         if (existingProject) {
        //             this.location.merge(existingProject, {
        //             city : jobSeekerProfile.location.split(',')[0],
        //             state : jobSeekerProfile.location.split(',')[1],
        //             country : jobSeekerProfile.location.split(',')[2]
        //             });

        //             await this.location.save(existingProject);
        //         } else {
        //             const newLocation = this.location.create({
        //                 city : jobSeekerProfile.location.split(',')[0],
        //                 state : jobSeekerProfile.location.split(',')[1],
        //                 country : jobSeekerProfile.location.split(',')[2],
        //                 jobSeekerProfile: jobseeker,
        //             });

        //             await this.location.save(newLocation);
        //     }
        // }
        if (jobSeekerProfile.projects) {
            for (const project of jobSeekerProfile.projects) {
                const existingProject = await this.projects.findOne({
                    where: { id: project.id },
                });

                if (existingProject) {
                    this.projects.merge(existingProject, {
                        name: project.name,
                        description: project.description,
                        image: project.image,
                        link: project.link,
                    });

                    await this.projects.save(existingProject);
                } else {
                    const newProject = this.projects.create({
                        name: project.name,
                        description: project.description,
                        image: project.image,
                        link: project.link,
                        jobSeekerProfile: jobseeker,
                    });

                    await this.projects.save(newProject);
                }
            }
        }

        if (jobSeekerProfile.experience) {
            for (const exp of jobSeekerProfile.experience) {
                const existingExperience = await this.experience.findOne({
                    where: { id: exp.id },
                });

                if (existingExperience) {
                    this.experience.merge(existingExperience, {
                        company: exp.company,
                        description: exp.description,
                        startDate: exp.period.split('-')[0],
                        endDate: exp.period.split('-')[1],
                        logo: exp.logo,
                        role: exp.role,
                    });

                    await this.experience.save(existingExperience);
                } else {
                    const newExperience = this.experience.create({
                        company: exp.company,
                        description: exp.description,
                        startDate: exp.period.split('-')[0],
                        endDate: exp.period.split('-')[1],
                        logo: exp.logo,
                        role: exp.role,
                        jobSeekerProfile: jobseeker,
                    });

                    await this.experience.save(newExperience);
                }
            }
        }

        if (jobSeekerProfile.education) {
            for (const edu of jobSeekerProfile.education) {
                const existingEducation = await this.education.findOne({
                    where: { id: edu.id },
                });

                if (existingEducation) {
                    this.education.merge(existingEducation, {
                        school: edu.school,
                        degree: edu.degree,
                        description: edu.description,
                        fieldOfStudy: edu.degree,
                        year: edu.year,
                    });

                    await this.education.save(existingEducation);
                } else {
                    const newEducation = this.education.create({
                        school: edu.school,
                        degree: edu.degree,
                        description: edu.description,
                        fieldOfStudy: edu.degree,
                        year: edu.year,
                        jobSeekerProfile: jobseeker,
                    });

                    await this.education.save(newEducation);
                }
            }
        }

        if (jobSeekerProfile.achievements) {
            for (const achievement of jobSeekerProfile.achievements) {
                const existingAchievement = await this.achievements.findOne({
                    where: { id: achievement.id },
                });

                if (existingAchievement) {
                    this.achievements.merge(existingAchievement, {
                        description: achievement.description,
                    });

                    await this.achievements.save(existingAchievement);
                } else {
                    const newAchievement = this.achievements.create({
                        description: achievement.description,
                        jobSeekerProfile: jobseeker,
                    });

                    await this.achievements.save(newAchievement);
                }
            }
        }

        if (jobSeekerProfile.certifications) {
            for (const certification of jobSeekerProfile.certifications) {
                const existingCertification = await this.certifications.findOne(
                    { where: { id: certification.id } },
                );

                if (existingCertification) {
                    this.certifications.merge(existingCertification, {
                        name: certification.name,
                        year: certification.year,
                    });

                    await this.certifications.save(existingCertification);
                } else {
                    const newCertification = this.certifications.create({
                        name: certification.name,
                        year: certification.year,
                        jobSeekerProfile: jobseeker,
                    });

                    await this.certifications.save(newCertification);
                }
            }
        }

        if (jobSeekerProfile.languages) {
            for (const language of jobSeekerProfile.languages) {
                const existingLanguage = await this.languages.findOne({
                    where: { id: language.id },
                });

                if (existingLanguage) {
                    this.languages.merge(existingLanguage, {
                        level: language.level,
                        name: language.name,
                    });

                    await this.languages.save(existingLanguage);
                } else {
                    const newLanguage = this.languages.create({
                        level: language.level,
                        name: language.name,
                        jobSeekerProfile: jobseeker,
                    });

                    await this.languages.save(newLanguage);
                }
            }
        }

        if (jobSeekerProfile.testimonials) {
            for (const testimonial of jobSeekerProfile.testimonials) {
                const existingTestimonial = await this.testimonials.findOne({
                    where: { id: testimonial.id },
                });

                if (existingTestimonial) {
                    this.testimonials.merge(existingTestimonial, {
                        content: testimonial.content,
                        name: testimonial.name,
                        role: testimonial.role,
                    });

                    await this.testimonials.save(existingTestimonial);
                } else {
                    const newTestimonial = this.testimonials.create({
                        content: testimonial.content,
                        name: testimonial.name,
                        role: testimonial.role,
                        jobSeekerProfile: jobseeker,
                    });

                    await this.testimonials.save(newTestimonial);
                }
            }
        }

        return await this.user.findOne({
            where: { id },
            relations: [
                'jobSeekerProfile',
                'jobSeekerProfile.workExperience',
                'jobSeekerProfile.education',
                'jobSeekerProfile.certifications',
                'jobSeekerProfile.projects',
                'jobSeekerProfile.testimonials',
                'jobSeekerProfile.achievements',
                'jobSeekerProfile.languages',
            ],
        });
    };
}
