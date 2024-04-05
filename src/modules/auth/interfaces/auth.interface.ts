import { Document } from 'mongoose';

interface IAuth extends Document {
  user_id: string;
  admin_id: string;
  courier_id: string;
  access_token: string;
}

export default IAuth;
