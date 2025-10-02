import { 
  type User, type UpsertUser,
  type Program, type InsertProgram, 
  type News, type InsertNews,
  type Member, type InsertMember,
  type MemberClass, type InsertMemberClass,
  type AdminUser, type InsertAdminUser,
  type HeroImage, type InsertHeroImage,
  users, adminUsers, memberClasses, members, heroImages, programs, news
} from "../shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations (Replit Auth compatible)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Admin user operations
  getAdminUser(userId: string): Promise<AdminUser | undefined>;
  createAdminUser(adminUser: InsertAdminUser): Promise<AdminUser>;
  updateAdminUser(id: string, adminUser: Partial<InsertAdminUser>): Promise<AdminUser>;
  deleteAdminUser(id: string): Promise<void>;
  
  // Member class operations
  getMemberClasses(): Promise<MemberClass[]>;
  getMemberClass(id: string): Promise<MemberClass | undefined>;
  createMemberClass(memberClass: InsertMemberClass): Promise<MemberClass>;
  updateMemberClass(id: string, memberClass: Partial<InsertMemberClass>): Promise<MemberClass>;
  deleteMemberClass(id: string): Promise<void>;
  
  // Member operations
  getMembers(): Promise<Member[]>;
  getMember(id: string): Promise<Member | undefined>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: string, member: Partial<InsertMember>): Promise<Member>;
  deleteMember(id: string): Promise<void>;
  
  // Hero image operations
  getHeroImages(): Promise<HeroImage[]>;
  getHeroImage(id: string): Promise<HeroImage | undefined>;
  createHeroImage(heroImage: InsertHeroImage): Promise<HeroImage>;
  updateHeroImage(id: string, heroImage: Partial<InsertHeroImage>): Promise<HeroImage>;
  deleteHeroImage(id: string): Promise<void>;
  
  // Program operations
  getPrograms(): Promise<Program[]>;
  getProgram(id: string): Promise<Program | undefined>;
  createProgram(program: InsertProgram): Promise<Program>;
  updateProgram(id: string, program: Partial<InsertProgram>): Promise<Program>;
  deleteProgram(id: string): Promise<void>;
  
  // News operations
  getNews(): Promise<News[]>;
  getNewsItem(id: string): Promise<News | undefined>;
  createNews(news: InsertNews): Promise<News>;
  updateNews(id: string, news: Partial<InsertNews>): Promise<News>;
  deleteNews(id: string): Promise<void>;
  getPublishedNews(): Promise<News[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private adminUsers: Map<string, AdminUser>;
  private memberClasses: Map<string, MemberClass>;
  private members: Map<string, Member>;
  private heroImages: Map<string, HeroImage>;
  private programs: Map<string, Program>;
  private news: Map<string, News>;

  constructor() {
    this.users = new Map();
    this.adminUsers = new Map();
    this.memberClasses = new Map();
    this.members = new Map();
    this.heroImages = new Map();
    this.programs = new Map();
    this.news = new Map();
    
    // Initialize with default data
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Default member classes
    const defaultMemberClasses: MemberClass[] = [
      {
        id: "website-manager",
        name: "Website Manager",
        description: "Manages the website and digital presence",
        displayOrder: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "officer",
        name: "Officer",
        description: "Executive leadership positions",
        displayOrder: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "active-member",
        name: "Active Member",
        description: "Regular participating members",
        displayOrder: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "faculty-advisors",
        name: "Faculty Advisors",
        description: "Faculty members providing guidance",
        displayOrder: 4,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    defaultMemberClasses.forEach(memberClass => this.memberClasses.set(memberClass.id, memberClass));

    // Default programs
    const defaultPrograms: Program[] = [
      {
        id: "clinical-skills",
        title: "Clinical Skills Workshop",
        subtitle: "First on the scene",
        description: "Hands-on training in basic medical procedures and patient care techniques.",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        createdAt: new Date()
      },
      {
        id: "disease-awareness",
        title: "Disease Awareness Campaigns",
        subtitle: "Fundraising events",
        description: "Initiatives to raise funds for hospitals.",
        image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        createdAt: new Date()
      },
      {
        id: "hospital-volunteering",
        title: "Hospital Volunteering",
        subtitle: "Donation & charity",
        description: "Donations to charitable organizations or hospitals.",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        createdAt: new Date()
      },
      {
        id: "medical-research",
        title: "Medical Research Projects",
        subtitle: "Social media page",
        description: "Student-made short videos exploring current medical topics, with the aim to improve public health.",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        createdAt: new Date()
      }
    ];

    defaultPrograms.forEach(program => this.programs.set(program.id, program));

    // Default members
    const defaultMembers: Member[] = [
      {
        id: "member-1",
        name: "Sarah Johnson",
        role: "President",
        memberClassId: "officer",
        bio: "Passionate about global health equity and medical education.",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        thumbnail: null,
        linkedIn: null,
        year: "Grade 12",
        isActive: true,
        displayOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "member-2",
        name: "Alex Chen",
        role: "Vice President",
        memberClassId: "officer",
        bio: "Leading initiatives in medical research and community outreach.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        thumbnail: null,
        linkedIn: null,
        year: "Grade 12",
        isActive: true,
        displayOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    defaultMembers.forEach(member => this.members.set(member.id, member));

    // Default hero images
    const defaultHeroImages: HeroImage[] = [
      {
        id: "hero-1",
        title: "First Aid Training Certification",
        description: "ISB Medical Society members completing their first aid certification",
        imageUrl: "/assets/97ccae24-4d7b-48c9-a16e-40476198cbd1_1758466251232.png",
        altText: "ISB Medical Society - First Aid Training Certification Group",
        displayOrder: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "hero-2",
        title: "Hospital Community Outreach",
        description: "Members visiting local hospitals for community outreach programs",
        imageUrl: "/assets/e5a0817e-1bad-4a67-bc34-45225337e332_1758466243134.png",
        altText: "ISB Medical Society - Hospital Community Outreach",
        displayOrder: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "hero-3",
        title: "Health Education Programs",
        description: "Educational workshops and health awareness campaigns",
        imageUrl: "/assets/16fd4d4d-d0b8-481f-821d-9d4b8ccae2f6_1758466251232.png",
        altText: "ISB Medical Society - Health Education Programs",
        displayOrder: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    defaultHeroImages.forEach(heroImage => this.heroImages.set(heroImage.id, heroImage));

    // Default news
    const defaultNews: News[] = [
      {
        id: "health-fair-2024",
        category: "Health Fair 2024",
        title: "Annual Health Fair Success",
        description: "Our 2024 Health Fair attracted over 500 participants, providing free health screenings and medical consultations to the community.",
        content: "The ISB Medical Society successfully hosted its annual Health Fair, welcoming over 500 community members for comprehensive health screenings and medical consultations. The event featured blood pressure monitoring, diabetes screening, and nutritional counseling, all provided free of charge by our volunteer medical professionals.",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        isPublished: true,
        publishDate: new Date(),
        authorId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "global-health-initiative",
        category: "Global Health Initiative",
        title: "New Partnership Announced",
        description: "MedSo partners with international healthcare organizations to expand our global health advocacy programs.",
        content: "We are excited to announce our new partnership with several international healthcare organizations. This collaboration will enhance our global health advocacy programs and provide our members with unprecedented opportunities to engage in worldwide health initiatives.",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        isPublished: true,
        publishDate: new Date(),
        authorId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    defaultNews.forEach(news => this.news.set(news.id, news));
  }

  // User operations (Replit Auth compatible)
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id!);
    const user: User = {
      id: userData.id!,
      email: userData.email ?? null,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  // Admin user operations
  async getAdminUser(userId: string): Promise<AdminUser | undefined> {
    return Array.from(this.adminUsers.values()).find(admin => admin.userId === userId);
  }

  async createAdminUser(insertAdminUser: InsertAdminUser): Promise<AdminUser> {
    const id = randomUUID();
    const adminUser: AdminUser = {
      id,
      userId: insertAdminUser.userId,
      role: insertAdminUser.role ?? "admin",
      permissions: insertAdminUser.permissions ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.adminUsers.set(id, adminUser);
    return adminUser;
  }

  async updateAdminUser(id: string, updateData: Partial<InsertAdminUser>): Promise<AdminUser> {
    const existing = this.adminUsers.get(id);
    if (!existing) throw new Error("Admin user not found");
    
    const updated: AdminUser = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    this.adminUsers.set(id, updated);
    return updated;
  }

  async deleteAdminUser(id: string): Promise<void> {
    this.adminUsers.delete(id);
  }

  // Member class operations
  async getMemberClasses(): Promise<MemberClass[]> {
    return Array.from(this.memberClasses.values()).sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }

  async getMemberClass(id: string): Promise<MemberClass | undefined> {
    return this.memberClasses.get(id);
  }

  async createMemberClass(insertMemberClass: InsertMemberClass): Promise<MemberClass> {
    const id = randomUUID();
    const memberClass: MemberClass = {
      id,
      name: insertMemberClass.name,
      description: insertMemberClass.description ?? null,
      displayOrder: insertMemberClass.displayOrder ?? 0,
      isActive: insertMemberClass.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.memberClasses.set(id, memberClass);
    return memberClass;
  }

  async updateMemberClass(id: string, updateData: Partial<InsertMemberClass>): Promise<MemberClass> {
    const existing = this.memberClasses.get(id);
    if (!existing) throw new Error("Member class not found");
    
    const updated: MemberClass = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    this.memberClasses.set(id, updated);
    return updated;
  }

  async deleteMemberClass(id: string): Promise<void> {
    this.memberClasses.delete(id);
  }

  // Member operations
  async getMembers(): Promise<Member[]> {
    return Array.from(this.members.values()).sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }

  async getMember(id: string): Promise<Member | undefined> {
    return this.members.get(id);
  }

  async createMember(insertMember: InsertMember): Promise<Member> {
    const id = randomUUID();
    const member: Member = {
      id,
      name: insertMember.name,
      role: insertMember.role || null,
      memberClassId: insertMember.memberClassId || null,
      bio: insertMember.bio || null,
      image: insertMember.image ?? null,
      thumbnail: insertMember.thumbnail ?? null,
      linkedIn: insertMember.linkedIn ?? null,
      year: insertMember.year ?? null,
      isActive: insertMember.isActive ?? true,
      displayOrder: insertMember.displayOrder ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.members.set(id, member);
    return member;
  }

  async updateMember(id: string, updateData: Partial<InsertMember>): Promise<Member> {
    const existing = this.members.get(id);
    if (!existing) throw new Error("Member not found");
    
    const updated: Member = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    this.members.set(id, updated);
    return updated;
  }

  async deleteMember(id: string): Promise<void> {
    this.members.delete(id);
  }

  // Hero image operations
  async getHeroImages(): Promise<HeroImage[]> {
    return Array.from(this.heroImages.values()).sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }

  async getHeroImage(id: string): Promise<HeroImage | undefined> {
    return this.heroImages.get(id);
  }

  async createHeroImage(insertHeroImage: InsertHeroImage): Promise<HeroImage> {
    const id = randomUUID();
    const heroImage: HeroImage = {
      id,
      title: insertHeroImage.title,
      description: insertHeroImage.description ?? null,
      imageUrl: insertHeroImage.imageUrl,
      altText: insertHeroImage.altText,
      displayOrder: insertHeroImage.displayOrder ?? 0,
      isActive: insertHeroImage.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.heroImages.set(id, heroImage);
    return heroImage;
  }

  async updateHeroImage(id: string, updateData: Partial<InsertHeroImage>): Promise<HeroImage> {
    const existing = this.heroImages.get(id);
    if (!existing) throw new Error("Hero image not found");
    
    const updated: HeroImage = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    this.heroImages.set(id, updated);
    return updated;
  }

  async deleteHeroImage(id: string): Promise<void> {
    this.heroImages.delete(id);
  }

  async getPrograms(): Promise<Program[]> {
    return Array.from(this.programs.values());
  }

  async getProgram(id: string): Promise<Program | undefined> {
    return this.programs.get(id);
  }

  async createProgram(insertProgram: InsertProgram): Promise<Program> {
    const id = randomUUID();
    const program: Program = { 
      ...insertProgram, 
      id, 
      createdAt: new Date() 
    };
    this.programs.set(id, program);
    return program;
  }

  async updateProgram(id: string, updateData: Partial<InsertProgram>): Promise<Program> {
    const existing = this.programs.get(id);
    if (!existing) throw new Error("Program not found");
    
    const updated: Program = {
      ...existing,
      ...updateData,
    };
    this.programs.set(id, updated);
    return updated;
  }

  async deleteProgram(id: string): Promise<void> {
    this.programs.delete(id);
  }

  async getNews(): Promise<News[]> {
    return Array.from(this.news.values());
  }

  async getNewsItem(id: string): Promise<News | undefined> {
    return this.news.get(id);
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const id = randomUUID();
    const news: News = {
      id,
      category: insertNews.category,
      title: insertNews.title,
      description: insertNews.description,
      content: insertNews.content ?? null,
      image: insertNews.image,
      isPublished: insertNews.isPublished ?? false,
      publishDate: insertNews.publishDate ?? null,
      authorId: insertNews.authorId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.news.set(id, news);
    return news;
  }

  async updateNews(id: string, updateData: Partial<InsertNews>): Promise<News> {
    const existing = this.news.get(id);
    if (!existing) throw new Error("News not found");
    
    const updated: News = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    this.news.set(id, updated);
    return updated;
  }

  async deleteNews(id: string): Promise<void> {
    this.news.delete(id);
  }

  async getPublishedNews(): Promise<News[]> {
    return Array.from(this.news.values())
      .filter(news => news.isPublished)
      .sort((a, b) => (b.publishDate || b.createdAt)!.getTime() - (a.publishDate || a.createdAt)!.getTime());
  }
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize with default data on first run
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    // Check if we already have data
    const existingClasses = await db.select().from(memberClasses).limit(1);
    if (existingClasses.length > 0) return; // Already initialized

    // Default member classes
    const defaultMemberClasses = [
      {
        id: "website-manager",
        name: "Website Manager",
        description: "Manages the website and digital presence",
        displayOrder: 1,
        isActive: true
      },
      {
        id: "officer",
        name: "Officer",
        description: "Executive leadership positions",
        displayOrder: 2,
        isActive: true
      },
      {
        id: "active-member",
        name: "Active Member",
        description: "Regular participating members",
        displayOrder: 3,
        isActive: true
      },
      {
        id: "faculty-advisors",
        name: "Faculty Advisors",
        description: "Faculty members providing guidance",
        displayOrder: 4,
        isActive: true
      }
    ];

    await db.insert(memberClasses).values(defaultMemberClasses).onConflictDoNothing();

    // Default programs
    const defaultPrograms = [
      {
        id: "clinical-skills",
        title: "Clinical Skills Workshop",
        subtitle: "First on the scene",
        description: "Hands-on training in basic medical procedures and patient care techniques.",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
      },
      {
        id: "disease-awareness",
        title: "Disease Awareness Campaigns",
        subtitle: "Fundraising events",
        description: "Initiatives to raise funds for hospitals.",
        image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
      },
      {
        id: "hospital-volunteering",
        title: "Hospital Volunteering",
        subtitle: "Donation & charity",
        description: "Donations to charitable organizations or hospitals.",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
      },
      {
        id: "medical-research",
        title: "Medical Research Projects",
        subtitle: "Social media page",
        description: "Student-made short videos exploring current medical topics, with the aim to improve public health.",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
      }
    ];

    await db.insert(programs).values(defaultPrograms).onConflictDoNothing();

    // Default members
    const defaultMembers = [
      {
        id: "member-1",
        name: "Sarah Johnson",
        role: "President",
        memberClassId: "officer",
        bio: "Passionate about global health equity and medical education.",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        thumbnail: null,
        linkedIn: null,
        year: "Grade 12",
        isActive: true,
        displayOrder: 1
      },
      {
        id: "member-2",
        name: "Alex Chen",
        role: "Vice President",
        memberClassId: "officer",
        bio: "Leading initiatives in medical research and community outreach.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        thumbnail: null,
        linkedIn: null,
        year: "Grade 12",
        isActive: true,
        displayOrder: 2
      }
    ];

    await db.insert(members).values(defaultMembers).onConflictDoNothing();

    // Default hero images
    const defaultHeroImages = [
      {
        id: "hero-1",
        title: "First Aid Training Certification",
        description: "ISB Medical Society members completing their first aid certification",
        imageUrl: "/assets/97ccae24-4d7b-48c9-a16e-40476198cbd1_1758466251232.png",
        altText: "ISB Medical Society - First Aid Training Certification Group",
        displayOrder: 1,
        isActive: true
      },
      {
        id: "hero-2",
        title: "Hospital Community Outreach",
        description: "Members visiting local hospitals for community outreach programs",
        imageUrl: "/assets/e5a0817e-1bad-4a67-bc34-45225337e332_1758466243134.png",
        altText: "ISB Medical Society - Hospital Community Outreach",
        displayOrder: 2,
        isActive: true
      },
      {
        id: "hero-3",
        title: "Health Education Programs",
        description: "Educational workshops and health awareness campaigns",
        imageUrl: "/assets/16fd4d4d-d0b8-481f-821d-9d4b8ccae2f6_1758466251232.png",
        altText: "ISB Medical Society - Health Education Programs",
        displayOrder: 3,
        isActive: true
      }
    ];

    await db.insert(heroImages).values(defaultHeroImages).onConflictDoNothing();

    // Default news
    const defaultNews = [
      {
        id: "health-fair-2024",
        category: "Health Fair 2024",
        title: "Annual Health Fair Success",
        description: "Our 2024 Health Fair attracted over 500 participants, providing free health screenings and medical consultations to the community.",
        content: "The ISB Medical Society successfully hosted its annual Health Fair, welcoming over 500 community members for comprehensive health screenings and medical consultations. The event featured blood pressure monitoring, diabetes screening, and nutritional counseling, all provided free of charge by our volunteer medical professionals.",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        isPublished: true,
        publishDate: new Date(),
        authorId: null
      },
      {
        id: "global-health-initiative",
        category: "Global Health Initiative",
        title: "New Partnership Announced",
        description: "MedSo partners with international healthcare organizations to expand our global health advocacy programs.",
        content: "We are excited to announce our new partnership with several international healthcare organizations. This collaboration will enhance our global health advocacy programs and provide our members with unprecedented opportunities to engage in worldwide health initiatives.",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        isPublished: true,
        publishDate: new Date(),
        authorId: null
      }
    ];

    await db.insert(news).values(defaultNews).onConflictDoNothing();
  }

  // User operations (Replit Auth compatible)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        id: userData.id!,
        email: userData.email ?? null,
        firstName: userData.firstName ?? null,
        lastName: userData.lastName ?? null,
        profileImageUrl: userData.profileImageUrl ?? null,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email ?? null,
          firstName: userData.firstName ?? null,
          lastName: userData.lastName ?? null,
          profileImageUrl: userData.profileImageUrl ?? null,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Admin user operations
  async getAdminUser(userId: string): Promise<AdminUser | undefined> {
    const [adminUser] = await db.select().from(adminUsers).where(eq(adminUsers.userId, userId));
    return adminUser || undefined;
  }

  async createAdminUser(insertAdminUser: InsertAdminUser): Promise<AdminUser> {
    const [adminUser] = await db.insert(adminUsers).values(insertAdminUser).returning();
    return adminUser;
  }

  async updateAdminUser(id: string, updateData: Partial<InsertAdminUser>): Promise<AdminUser> {
    const [adminUser] = await db
      .update(adminUsers)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(adminUsers.id, id))
      .returning();
    return adminUser;
  }

  async deleteAdminUser(id: string): Promise<void> {
    await db.delete(adminUsers).where(eq(adminUsers.id, id));
  }

  // Member class operations
  async getMemberClasses(): Promise<MemberClass[]> {
    return await db.select().from(memberClasses).orderBy(memberClasses.displayOrder);
  }

  async getMemberClass(id: string): Promise<MemberClass | undefined> {
    const [memberClass] = await db.select().from(memberClasses).where(eq(memberClasses.id, id));
    return memberClass || undefined;
  }

  async createMemberClass(insertMemberClass: InsertMemberClass): Promise<MemberClass> {
    const [memberClass] = await db.insert(memberClasses).values(insertMemberClass).returning();
    return memberClass;
  }

  async updateMemberClass(id: string, updateData: Partial<InsertMemberClass>): Promise<MemberClass> {
    const [memberClass] = await db
      .update(memberClasses)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(memberClasses.id, id))
      .returning();
    return memberClass;
  }

  async deleteMemberClass(id: string): Promise<void> {
    await db.delete(memberClasses).where(eq(memberClasses.id, id));
  }

  // Member operations
  async getMembers(): Promise<Member[]> {
    return await db.select().from(members).orderBy(members.displayOrder);
  }

  async getMember(id: string): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.id, id));
    return member || undefined;
  }

  async createMember(insertMember: InsertMember): Promise<Member> {
    const [member] = await db.insert(members).values(insertMember).returning();
    return member;
  }

  async updateMember(id: string, updateData: Partial<InsertMember>): Promise<Member> {
    const [member] = await db
      .update(members)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(members.id, id))
      .returning();
    return member;
  }

  async deleteMember(id: string): Promise<void> {
    await db.delete(members).where(eq(members.id, id));
  }

  // Hero image operations
  async getHeroImages(): Promise<HeroImage[]> {
    return await db.select().from(heroImages).orderBy(heroImages.displayOrder);
  }

  async getHeroImage(id: string): Promise<HeroImage | undefined> {
    const [heroImage] = await db.select().from(heroImages).where(eq(heroImages.id, id));
    return heroImage || undefined;
  }

  async createHeroImage(insertHeroImage: InsertHeroImage): Promise<HeroImage> {
    const [heroImage] = await db.insert(heroImages).values(insertHeroImage).returning();
    return heroImage;
  }

  async updateHeroImage(id: string, updateData: Partial<InsertHeroImage>): Promise<HeroImage> {
    const [heroImage] = await db
      .update(heroImages)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(heroImages.id, id))
      .returning();
    return heroImage;
  }

  async deleteHeroImage(id: string): Promise<void> {
    await db.delete(heroImages).where(eq(heroImages.id, id));
  }

  // Program operations
  async getPrograms(): Promise<Program[]> {
    return await db.select().from(programs);
  }

  async getProgram(id: string): Promise<Program | undefined> {
    const [program] = await db.select().from(programs).where(eq(programs.id, id));
    return program || undefined;
  }

  async createProgram(insertProgram: InsertProgram): Promise<Program> {
    const [program] = await db.insert(programs).values(insertProgram).returning();
    return program;
  }

  async updateProgram(id: string, updateData: Partial<InsertProgram>): Promise<Program> {
    const [program] = await db
      .update(programs)
      .set(updateData)
      .where(eq(programs.id, id))
      .returning();
    return program;
  }

  async deleteProgram(id: string): Promise<void> {
    await db.delete(programs).where(eq(programs.id, id));
  }

  // News operations
  async getNews(): Promise<News[]> {
    return await db.select().from(news);
  }

  async getNewsItem(id: string): Promise<News | undefined> {
    const [newsItem] = await db.select().from(news).where(eq(news.id, id));
    return newsItem || undefined;
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const [newsItem] = await db.insert(news).values(insertNews).returning();
    return newsItem;
  }

  async updateNews(id: string, updateData: Partial<InsertNews>): Promise<News> {
    const [newsItem] = await db
      .update(news)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(news.id, id))
      .returning();
    return newsItem;
  }

  async deleteNews(id: string): Promise<void> {
    await db.delete(news).where(eq(news.id, id));
  }

  async getPublishedNews(): Promise<News[]> {
    return await db.select().from(news).where(eq(news.isPublished, true)).orderBy(news.publishDate);
  }
}

export const storage = new DatabaseStorage();
