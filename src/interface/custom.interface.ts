// custom.interface.ts
import { Request } from 'express';

export interface CustomRequest extends Request {
  user: any; // Assuming you have a 'user' property
  admin: any;
  courier: any; // Add your 'admin' property here
}
