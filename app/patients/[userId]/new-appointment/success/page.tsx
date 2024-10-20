import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";
import WeCare from '@/public/assets/svg/logo-no-background.svg'

const Success = async ({
  searchParams,
  params: { userId },
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);

  const doctor = Doctors.find(
    (doctor) => doctor.name === appointment.primaryPhyisican
  );

  // Debug: Check if doctor is found
  if (!doctor) {
    console.error("Doctor not found for primaryPhysician:", appointment.primaryPhyisican);
    // to handle this case, e.g., by showing a default image or an error message
  }

  return (
    <div className=" flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src={WeCare}
            height={1000}
            width={1000}
            alt="logo"
            className="h-20 w-fit"
          />
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={200}
            width={200}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-yellow-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p>We&apos;ll be in touch shortly to confirm.</p>
        </section>

        <section className="request-details">
          <p>Requested appointment details: </p>
          {doctor ? (
            <div className="flex items-center gap-3">
              <Image
                src={doctor.image!}
                alt="doctor"
                width={100}
                height={100}
                className="size-6"
              />
              <p className="whitespace-nowrap">Dr. {doctor.name}</p>
            </div>
          ) : (
            <p>Doctor information not available</p>
          )}
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p> {formatDateTime(appointment.schedule).dateTime}</p>
          </div>
        </section>

        <Button variant="outline" className="bg-yellow-500 hover:bg-yellow-600 text-black" asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            New Appointment
          </Link>
        </Button>

        <p className="copyright">© 2024 WeCare. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Success;