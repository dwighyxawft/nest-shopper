import { Date, Document } from 'mongoose';

interface IPass extends Document {
  user_id: string
  uuid: string
  createdAt: Date
  expiry: Date
}

export default IPass;
