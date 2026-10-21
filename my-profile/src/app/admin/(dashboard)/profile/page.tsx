import { prisma } from "@/lib/prisma";
import ProfileManager from "@/components/admin/ProfileManager";


export default async function AdminProfilePage() {
  const settings = await prisma.siteSetting.findMany();
  const settingsMap = settings.reduce<Record<string, string>>((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});

  return <ProfileManager initialSettings={settingsMap} />;
}
