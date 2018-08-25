import validator from 'validator';

const isPopulated = value => !!value.toString().trim().length;
const isEmail = value => validator.isEmail(value);
const isGreaterThanLength = (value, length) => value.length > length;
const isMatched = (value, matchValue) => value === matchValue;

const getErrorsString = errors => errors.reduce((CompleteErrorString, errorMessage, index) => {
  if (index === 0) { return errorMessage; }
  return `${CompleteErrorString}\n${errorMessage}`;
}, '');

const getValidationErrors = fieldsConfig => fieldsConfig
  .map((field) => {
    for (let i = 0; i < field.verify.length; i += 1) {
      const verification = field.verify[i];

      if (verification.type === 'isPopulated' && !isPopulated(field.value)) {
        return verification.message;
      }

      if (verification.type === 'isGreaterThanLength' && !isGreaterThanLength(field.value, verification.length)) {
        return verification.message;
      }

      if (verification.type === 'isEmail' && !isEmail(field.value)) {
        return verification.message;
      }

      if (
        verification.type === 'isMatched'
              && isPopulated(field.value)
              && isPopulated(verification.matchValue)
              && !isMatched(field.value, verification.matchValue)
      ) {
        return verification.message;
      }

      if (verification.type === 'isCustom' && !verification.condition) {
        return verification.message;
      }
    }
    return false;
  })
  // Filter out all messages that are not false
  .filter(message => message);

const validateForm = (fieldsConfig) => {
  const errors = getValidationErrors(fieldsConfig);
  if (errors.length) {
    return getErrorsString(errors);
  }

  return false;
};

export default validateForm;
