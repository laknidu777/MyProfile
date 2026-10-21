import { prisma } from "@/lib/prisma";
import ContactManager from "@/components/admin/ContactManager";


export default async function AdminContactPage() {
  const settings = await prisma.siteSetting.findMany();
  const settingsMap = settings.reduce<Record<string, string>>((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});

  return <ContactManager initialSettings={settingsMap} />;
}
