import { checkSchema } from 'express-validator';

// export default [body('email').notEmpty().withMessage('Email is required')];
export default checkSchema({
    email: {
        errorMessage: 'Valid email is required',
        notEmpty: true,
        trim: true,
        isEmail: true,
    },
    password: {
        errorMessage: 'Password is required',
        notEmpty: true,
        trim: true,
        isLength: {
            options: { min: 8, max: 20 },
            errorMessage: 'Password must be between 8 and 20 characters long',
        },
    },
});
