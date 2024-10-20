import Image from "next/image";
import WeCare from '@/public/assets/svg/logo-no-background.svg'
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";

export default async function NewAppointment({ params: { userId } }: SearchParamProps) {
    const patients = await getPatient(userId);
    return (
        <div className="flex h-screen max-h-screen">
            {/* TODO: OTP Verfication | Passkey */}
            <section className="remove-scrollbar container my-auto">
                <div className="sub-container max-w-[860px] flex-1 justify-between">
                    <Image
                        src={WeCare}
                        alt="patient"
                        width={1000}
                        height={1000}
                        className="mb-6 h-24 w-auto self-start"
                    />
                    <AppointmentForm
                        type="create"
                        userId={userId}
                        patientId={patients.$id}
                    />

                    <p className="copyright mt-5 py-6">
                        &copy; {new Date().getFullYear()} WeCare. All rights reserved.
                    </p>
                </div>
            </section>
            <Image
                src='/assets/images/appointment-img.png'
                alt="appointment"
                width={1000}
                height={1000}
                className="side-img max-w-[390px] bg-bottom"
            />
        </div>
    );
}
