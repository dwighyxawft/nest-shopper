import { Document } from 'mongoose';

interface IAdmin extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  gender: 'male' | 'female' | 'other';
  image: string; // Assuming the image is stored as a URL or file path
  address: string;
  state: string;
  city: string;
}

export default IAdmin;
