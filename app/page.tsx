import Image from "next/image";
import { PatientForm } from "@/components/forms/PatientForm";
import Link from "next/link";
import WeCare from '@/public/assets/svg/logo-no-background.svg'
import Doc5 from '@/public/assets/icons/doc5.jpg'

export default function Home() {
  return (
    <div className="flex h-screen max-h-screen">
      {/* TODO: OTP Verfication | Passkey */}
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src={WeCare}
            alt="patient"
            width={1000}
            height={1000}
            className="mb-6 h-24 w-auto self-start"
          />
          <PatientForm />
          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">Copyright © 2024 We Care. All rights reserved.</p>
            <Link href="/?admin=true" className="text-[#FFD147]">Admin</Link>
          </div>
        </div>
      </section>
      <Image
        src={Doc5}
        alt="patient"
        width={1000}
        height={1000}
        className="side-img max-w-[45%]"
      />
    </div>
  );
}
