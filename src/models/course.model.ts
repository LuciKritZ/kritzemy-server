import { IComment, ICourse, ICourseData, ILink, IReview } from '@/dto';
import {
  type CallbackWithoutResultAndOptionalError,
  type Model,
  Schema,
  model,
} from 'mongoose';

const ReviewSchema = new Schema<IReview>({
  user: Object,
  rating: {
    type: Number,
    default: 0,
  },
  comment: String,
});

const LinkSchema = new Schema<ILink>({
  title: String,
  url: String,
});

const CommentSchema = new Schema<IComment>({
  user: Object,
  comment: String,
  commentReplies: [Object],
});

const CourseDataSchema = new Schema<ICourseData>({
  videoURL: String,
  videoThumbnail: Object,
  title: String,
  videoSection: String,
  description: String,
  videoLength: Number,
  videoPlayer: String,
  links: [LinkSchema],
  suggestion: String,
  questions: [CommentSchema],
});

const CourseSchema = new Schema<ICourse>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  estimatedPrice: {
    type: Number,
  },
  thumbnail: {
    public_id: {
      required: true,
      type: String,
    },
    url: {
      required: true,
      type: String,
    },
  },
  tags: {
    required: true,
    type: String,
  },
  level: {
    type: String,
    required: true,
  },
  demoUrl: {
    type: String,
    required: true,
  },
  benefits: [
    {
      title: String,
    },
  ],
  prerequisites: [
    {
      title: String,
    },
  ],
  reviews: [ReviewSchema],
  courseData: [CourseDataSchema],
  ratings: {
    type: Number,
    default: 0,
  },
  purchaseCount: {
    type: Number,
    default: 0,
  },
});

const CourseModel: Model<ICourse> = model('Course', CourseSchema);

export default CourseModel;
