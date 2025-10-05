import { storage } from "../server/storage";
import fs from "fs/promises";
import path from "path";

async function exportData() {
  const dataDir = path.resolve(process.cwd(), "client", "src", "data");
  
  // Create data directory if it doesn't exist
  await fs.mkdir(dataDir, { recursive: true });

  // Export all data
  const [members, memberClasses, news, programs, heroImages] = await Promise.all([
    storage.getMembers(),
    storage.getMemberClasses(),
    storage.getNews(),
    storage.getPrograms(),
    storage.getHeroImages()
  ]);

  // Write JSON files
  await Promise.all([
    fs.writeFile(
      path.join(dataDir, "members.json"),
      JSON.stringify(members, null, 2),
      "utf8"
    ),
    fs.writeFile(
      path.join(dataDir, "memberClasses.json"),
      JSON.stringify(memberClasses, null, 2),
      "utf8"
    ),
    fs.writeFile(
      path.join(dataDir, "news.json"),
      JSON.stringify(news, null, 2),
      "utf8"
    ),
    fs.writeFile(
      path.join(dataDir, "programs.json"),
      JSON.stringify(programs, null, 2),
      "utf8"
    ),
    fs.writeFile(
      path.join(dataDir, "heroImages.json"),
      JSON.stringify(heroImages, null, 2),
      "utf8"
    )
  ]);

  console.log("Data exported successfully!");
  console.log(`- ${members.length} members`);
  console.log(`- ${memberClasses.length} member classes`);
  console.log(`- ${news.length} news items`);
  console.log(`- ${programs.length} programs`);
  console.log(`- ${heroImages.length} hero images`);
}

exportData().catch(console.error);
