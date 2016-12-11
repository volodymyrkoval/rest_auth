function isValidPassword(password) {
  return !!String(password).length;
}

function isValidEmail(email) {
  return /^.+@.+\..+$/.test(email);
}

function isValidPhone(phone) {
  return /^\+\d+$/.test(phone)
}

function checkType(id) {
  if (isValidEmail(id)) {
    return 'mail';
  } else if (isValidPhone(id)) {
    return 'phone';
  }
}

function isCredentialsValid(id, type, password) {
  if (!id || !password || !type) {
    return false;
  }
  let validateIdHandler = undefined;
  if (type == 'mail') {
    validateIdHandler = isValidEmail;
  } else if (type == 'phone') {
    validateIdHandler = isValidPhone;
  }

  return (validateIdHandler(id) && isValidPassword(password));
}

export {checkType, isCredentialsValid};
