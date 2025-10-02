import type { Member, MemberClass, News, HeroImage, Program } from "@/types/content";

const memberClassModules = import.meta.glob('/content/member-classes/*.json', { eager: true, import: 'default' });
const memberModules = import.meta.glob('/content/members/*.json', { eager: true, import: 'default' });
const newsModules = import.meta.glob('/content/news/*.json', { eager: true, import: 'default' });
const heroImageModules = import.meta.glob('/content/hero-images/*.json', { eager: true, import: 'default' });
const programModules = import.meta.glob('/content/programs/*.json', { eager: true, import: 'default' });

export function loadMemberClasses(): MemberClass[] {
  const classes = Object.values(memberClassModules) as MemberClass[];
  return classes.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

export function loadMembers(): Member[] {
  const members = Object.values(memberModules) as Member[];
  return members.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

export function loadNews(): News[] {
  const newsItems = Object.values(newsModules) as News[];
  return newsItems.filter((item: News) => item.isPublished);
}

export function loadHeroImages(): HeroImage[] {
  const images = Object.values(heroImageModules) as HeroImage[];
  return images
    .filter((img: HeroImage) => img.isActive)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

export function loadPrograms(): Program[] {
  return Object.values(programModules) as Program[];
}
