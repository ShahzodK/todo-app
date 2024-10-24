export interface User {
    email: string, 
    password: string,
    access_token: string,
    token_type: string,
}
export type userReq = Pick<User, 'email' | 'password'>;
export type userRes = Pick<User, 'token_type' | 'access_token'>;
export type userRegistration = Pick<User, 'email' | 'password'> & {name: string, password_confirmation: string};
export type userRegistrationRes = {message: string};