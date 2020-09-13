import { genSalt, hash, compare } from 'bcryptjs';

const hashPassword = async (input) => {
  const salt = await genSalt(12);
  return hash(input, salt);
};

