import { HomePageClient } from "@/components/home/homePageClient";
import { getAllSkills } from "@/lib/skills/skillsData";

const HomePage = async () => {
  const skills = await getAllSkills();
  const skillSummaries = skills.map((skill) => {
    return {
      description: skill.description,
      name: skill.name,
      slug: skill.slug,
      category: skill.category,
      clawhubUrl: skill.clawhubUrl,
    };
  });

  return <HomePageClient skills={skillSummaries} />;
};

export default HomePage;

