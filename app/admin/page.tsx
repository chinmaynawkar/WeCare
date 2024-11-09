import Image from "next/image";
import Link from "next/link";

import { StatCard } from "@/components/StatCard";
import WeCare from '@/public/assets/svg/logo-no-background.svg'
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import { DataTable } from "@/components/table/DataTable";
import { columns } from "@/components/table/Columns";


const AdminPage = async () => {
  try {
    const appointments = await getRecentAppointmentList();

    // Add default values in case appointments is undefined
    const stats = {
      scheduledCount: appointments?.scheduledCount ?? 0,
      pendingCount: appointments?.pendingCount ?? 0,
      cancelledCount: appointments?.cancelledCount ?? 0,
      documents: appointments?.documents ?? []
    };

    return (
      <div className="mx-auto flex max-w-7xl flex-col space-y-14">
        <header className="admin-header">
          <Link href="/" className="cursor-pointer">
            <Image
              src={WeCare}
              height={52}
              width={300}
              alt="logo"
              className="h-10 w-fit"
            />
          </Link>

          <p className="text-16-semibold">Admin Dashboard</p>
        </header>

        <main className="admin-main">
          <section className="w-full space-y-4">
            <h1 className="header">Welcome 👋</h1>
            <p className="text-dark-700">
              Start the day with managing new appointments
            </p>
          </section>

          <section className="admin-stat">
            <StatCard
              type="appointments"
              count={stats.scheduledCount}
              label="Scheduled appointments"
              icon={"/assets/icons/appointments.svg"}
            />
            <StatCard
              type="pending"
              count={stats.pendingCount}
              label="Pending appointments"
              icon={"/assets/icons/pending.svg"}
            />
            <StatCard
              type="cancelled"
              count={stats.cancelledCount}
              label="Cancelled appointments"
              icon={"/assets/icons/cancelled.svg"}
            />
          </section>

          <DataTable columns={columns} data={stats.documents} />
        </main>
      </div>
    );
  } catch (error) {
    console.error("An error occurred while retrieving the recent appointments:", error);
    // Return a fallback UI or error state
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Unable to load dashboard data. Please try again later.</p>
      </div>
    );
  }
};

export default AdminPage;