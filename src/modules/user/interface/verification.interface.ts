import { Date, Document } from 'mongoose';

interface IVerify extends Document {
  user_id: string
  uuid: string
  createdAt: Date
}

export default IVerify;
