import { Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  gender: 'male' | 'female' | 'other';
  image: string; // Assuming the image is stored as a URL or file path
  address: string;
  state: string;
  city: string;
  cart: any[]; // Assuming cart contains the IDs or references to items in the cart
}

export default IUser;
