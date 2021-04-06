declare namespace Express {
    export interface Request {
       uid: string,
       username: string,
       fullname: string,
       role: string,
       state: boolean
       
    }
 }