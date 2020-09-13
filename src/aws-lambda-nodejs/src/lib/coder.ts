import { InvocationRequest } from 'aws-sdk/clients/lambda';
import { lambda } from '../config/lamba_config';
import { genSalt, hash, compare } from 'bcryptjs';

export const encodeBase64 = (input: string) => {
  return new Buffer(input).toString('base64');
};

export const decodeBase64 = (input: string): string => {
  return new Buffer(input, 'base64').toString();
};

export const encodeMD5 = async (input: string) => {
  const params: InvocationRequest = {
    FunctionName: 'md5_encoder',
    Payload: `{"password": "${input}"}`,
  };

  try {
    console.log(`Getting md5 encoded password  with parameters ${JSON.stringify(params)}`);
    const response = await lambda.invoke(params).promise();
    const password = response.Payload.toString().replace('\"', '').replace('\"', '');
    console.log(`MD5 encoded password = ${password}`);
    return password;
  } catch (e) {
    console.log(`An error has occurred while getting MD5 encoded password with params ${JSON.stringify(params)}`);
    console.log(e.toString());
    return null;
  }
};

export const hashPassword = async (input: string): Promise<string> => {
  const salt = await genSalt(12);
  return hash(input, salt);
};

export const comparePassword = (password: string, hash: string): boolean => {
  return compare(password, hash);

};
