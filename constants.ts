import type { WorkerProfile, EmployerProfile, Job, Application } from './types';
import { JobType, LocationType, ApplicationStatus } from './types';

export const WORKERS: WorkerProfile[] = [
  {
    id: 1,
    username: 'anya',
    name: 'Anya Sharma',
    avatarUrl: 'https://picsum.photos/seed/anya/200',
    title: 'Senior Frontend Developer',
    location: 'Lagos, Nigeria',
    bio: 'Passionate frontend developer with 8+ years of experience in creating beautiful and performant web applications using React, TypeScript, and Next.js. I thrive in collaborative environments and am dedicated to mentoring junior developers.',
    skills: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'Tailwind CSS', 'Figma'],
    experience: [
      { id: 1, title: 'Lead Frontend Engineer', company: 'Paystack', period: '2020 - Present', description: 'Led a team of 5 engineers to rebuild the customer dashboard, improving performance by 40%.' },
      { id: 2, title: 'Software Engineer', company: 'Andela', period: '2017 - 2020', description: 'Developed and maintained features for various international clients.' },
    ],
    education: [
      { id: 1, institution: 'University of Lagos', degree: 'B.Sc. in Computer Science', period: '2013 - 2017' },
    ],
    portfolio: [
        { id: 1, title: 'E-commerce Platform', description: 'A full-stack e-commerce site built with Next.js.', imageUrl: 'https://picsum.photos/seed/ecomm/400/300', link: '#' }
    ],
    // Fix: Add email and contact to conform to the updated WorkerProfile type.
    email: 'anya.sharma@example.com',
    contact: '1234567890',
  },
  {
    id: 2,
    username: 'ben',
    name: 'Ben Carter',
    avatarUrl: 'https://picsum.photos/seed/ben/200',
    title: 'UX/UI Designer',
    location: 'Nairobi, Kenya',
    bio: 'Creative UX/UI designer focused on creating user-centric and intuitive digital experiences. Proficient in the entire design process from research and wireframing to high-fidelity prototyping and user testing.',
    skills: ['Figma', 'Adobe XD', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
     experience: [
      { id: 1, title: 'Senior Product Designer', company: 'Safaricom', period: '2019 - Present', description: 'Designed the user interface for the M-PESA super app, used by millions.' },
    ],
    education: [
      { id: 1, institution: 'University of Nairobi', degree: 'B.A. in Design', period: '2015 - 2019' },
    ],
    portfolio: [
        { id: 1, title: 'Mobile Banking App', description: 'A concept for a neobank app focused on financial literacy.', imageUrl: 'https://picsum.photos/seed/bankapp/400/300', link: '#' }
    ],
    // Fix: Add email and contact to conform to the updated WorkerProfile type.
    email: 'ben.carter@example.com',
    contact: '0987654321',
  },
];

export const EMPLOYERS: EmployerProfile[] = [
    {
        id: 1,
        username: 'stripe_hr',
        companyName: 'Stripe',
        logoUrl: 'https://picsum.photos/seed/stripe/100',
        industry: 'Fintech',
        location: 'San Francisco, USA (Remote Friendly)',
        about: 'Stripe is a technology company that builds economic infrastructure for the internet. Businesses of every size use our software to accept payments and manage their businesses online.',
        // Fix: Add email and contact to conform to the updated EmployerProfile type.
        email: 'hr@stripe.com',
        contact: '1122334455',
    },
    {
        id: 2,
        username: 'shopify_hr',
        companyName: 'Shopify',
        logoUrl: 'https://picsum.photos/seed/shopify/100',
        industry: 'E-commerce',
        location: 'Ottawa, Canada (Remote First)',
        about: 'Shopify is a leading global commerce company, providing trusted tools to start, grow, market, and manage a retail business of any size.',
        // Fix: Add email and contact to conform to the updated EmployerProfile type.
        email: 'hr@shopify.com',
        contact: '5544332211',
    }
];

export const JOBS: Job[] = [
  {
    id: 1,
    employerId: 1,
    title: 'Senior React Engineer',
    description: 'Join our core payments team to build and maintain the user interfaces that power global commerce. You will work on complex challenges and have a significant impact on our product.',
    skills: ['React', 'TypeScript', 'Performance Optimization', 'API Design'],
    compensation: { min: 90000, max: 130000, currency: 'USD', period: 'year' },
    jobType: JobType.FullTime,
    locationType: LocationType.Remote,
    workingConditions: ['Flexible Hours', 'Health Insurance', 'Generous PTO', '401k Matching']
  },
  {
    id: 2,
    employerId: 2,
    title: 'Product Designer (Merchant Experience)',
    description: 'We are looking for a talented Product Designer to shape the future of our merchant dashboard. You will be responsible for the end-to-end design process, from research to pixel-perfect mockups.',
    skills: ['UX Research', 'Figma', 'Prototyping', 'Design Systems', 'Data-informed Design'],
    compensation: { min: 85000, max: 120000, currency: 'USD', period: 'year' },
    jobType: JobType.FullTime,
    locationType: LocationType.Remote,
    workingConditions: ['Remote First Culture', 'Wellness Stipend', 'Parental Leave', 'Stock Options']
  },
   {
    id: 3,
    employerId: 1,
    title: 'Frontend Developer (Contract)',
    description: 'We need an experienced frontend developer for a 6-month contract to help us build out a new marketing website. Strong skills in Tailwind CSS and animation are required.',
    skills: ['React', 'Tailwind CSS', 'GSAP', 'Next.js'],
    compensation: { min: 80, max: 110, currency: 'USD', period: 'hour' },
    jobType: JobType.Contract,
    locationType: LocationType.Remote,
    workingConditions: ['Fully Remote', 'Flexible Schedule', 'Weekly Payouts']
  }
];

export const APPLICATIONS: Application[] = [
    { id: 1, jobId: 2, workerId: 1, status: ApplicationStatus.Interviewing, dateApplied: '2023-10-15' },
    { id: 2, jobId: 3, workerId: 1, status: ApplicationStatus.Applied, dateApplied: '2023-10-22' },
    { id: 3, jobId: 1, workerId: 2, status: ApplicationStatus.Rejected, dateApplied: '2023-09-01' },
];