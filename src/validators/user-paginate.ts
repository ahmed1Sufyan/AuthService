import { checkSchema } from 'express-validator';
export default checkSchema(
    {
        q: {
            trim: true,
            customSanitizer: {
                options: (value: string) => {
                    return value ? value : '';
                },
            },
        },
        role: {
            customSanitizer: {
                options: (value: string) => {
                    return value ? value : '';
                },
            },
        },
        currentPage: {
            customSanitizer: {
                options: (value) => {
                    const parsedValue = Number(value);
                    return Number.isNaN(parsedValue) ? 1 : parsedValue;
                },
            },
        },
        perPage: {
            customSanitizer: {
                options: (value) => {
                    const parsedValue = Number(value);
                    return Number.isNaN(parsedValue) ? 4 : parsedValue;
                },
            },
        },
    },
    ['query'],
);
