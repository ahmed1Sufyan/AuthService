import { checkSchema } from 'express-validator';

export default checkSchema({
    email: {
        errorMessage: 'Valid email is required',
        notEmpty: true,
        trim: true,
        isEmail: true,
    },
    firstName: {
        errorMessage: 'First Name is required',
        notEmpty: true,
        trim: true,
    },
    lastName: {
        errorMessage: 'Last Name is required',
        notEmpty: true,
        trim: true,
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
