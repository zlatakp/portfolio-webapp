import { ServicesEditor } from "@/components/admin/ServicesEditor";
import { prisma } from "@/lib/prisma";

export default async function DashboardServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <ServicesEditor initialServices={services} />
  );
}
