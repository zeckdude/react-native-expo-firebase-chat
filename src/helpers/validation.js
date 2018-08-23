import validator from 'validator';

export const isPopulated = value => !!value.toString().trim().length;
export const isEmail = value => !!validator.isEmail(value);
