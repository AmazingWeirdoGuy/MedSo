export interface MemberClass {
  id: string;
  name: string;
  description?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export interface Member {
  id: string;
  name: string;
  role?: string | null;
  memberClassId?: string | null;
  bio?: string | null;
  image?: string | null;
  thumbnail?: string | null;
  linkedIn?: string | null;
  year?: string | null;
  isActive?: boolean;
  displayOrder?: number;
}

export interface HeroImage {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  altText: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface News {
  id: string;
  category: string;
  title: string;
  description: string;
  content?: string | null;
  image: string;
  isPublished?: boolean;
  publishDate?: string | null;
}

export interface Program {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}
