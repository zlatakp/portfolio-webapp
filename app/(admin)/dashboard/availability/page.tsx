import { AvailabilityEditor } from "@/components/admin/AvailabilityEditor";
import { prisma } from "@/lib/prisma";

export default async function DashboardAvailabilityPage() {
  const rules = await prisma.availability.findMany({
    orderBy: [{ date: "desc" }, { dayOfWeek: "asc" }],
  });

  return (
    <AvailabilityEditor
      initialRules={rules.map((rule) => ({
        ...rule,
        date: rule.date ? rule.date.toISOString() : null,
      }))}
    />
  );
}
