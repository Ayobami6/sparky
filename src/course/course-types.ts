export interface Question {
  user: object;
  text: string;
  replies?: Question[];
}

export interface Link {
  title: string;
  url: string;
}

export interface Review {
  user: object;
  rating: number;
  text: string;
  replies?: Question[];
}

export interface Benefit {
  title: string;
}

export interface Instructor {
  name: string;
  email: string;
  id: string;
}

export interface CourseContent {
    id?: string;
  title: string;
  description: string;
  videoUrl: string;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: Link[];
  suggestion: string;
  questions: Question[];
}

export interface Thumbnail {
  public_id: string;
  url: string;
}

export interface Course {
  name: string;
  description: string;
  price: number;
  estimatedPrice: number;
  thumbnail?: object;
  tags: string[];
  level: string;
  demoUrl: string;
  reviews: Review[];
  benefits: Benefit[];
  prerequisites: Benefit[];
  courseData: CourseContent[];
  ratings?: number;
  purchased?: number;
  instructor: Instructor;
}
