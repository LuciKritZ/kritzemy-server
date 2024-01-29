import { Document } from 'mongoose';
import { CloudinaryImage } from './cloudinary.dto';

export interface IComment extends Document {
  user: object;
  comment: string;
  commentReplies?: IComment[];
}

export interface IReview extends Document {
  user: object;
  rating: number;
  comment: string;
  commentReplies: IComment[];
}

export interface ILink extends Document {
  title: string;
  url: string;
}

interface ICourseBenefits {
  title: string;
}

export interface ICourseData extends Document {
  title: string;
  description: string;
  videoURL: string;
  videoThumbnail: CloudinaryImage;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: ILink[];
  suggestion: string;
  questions: IComment[];
}

export interface ICourse extends Document {
  name: string;
  description?: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: CloudinaryImage;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: ICourseBenefits[];
  prerequisites: ICourseBenefits[];
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  purchaseCount?: number;
}
