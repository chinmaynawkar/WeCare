
import React from 'react'
import Image from 'next/image'
import WeCare from '@/public/assets/svg/logo-no-background.svg'
import { RegisterForm } from '@/components/forms/RegisterForm'
import { getUser } from '@/lib/actions/patient.actions'

// eslint-disable-next-line @next/next/no-async-client-component
const RegisterPage = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId)
  return (
    <div className="flex h-screen max-h-screen">
      {/* TODO: OTP Verfication | Passkey */}
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src={WeCare}
            alt="patient"
            width={1000}
            height={1000}
            className="mb-6 h-24 w-auto self-start"
          />
          <RegisterForm user={user} />
            <div className="flex justify-between">
              <p className="copyright py-6">Copyright © 2024 We Care. All rights reserved.</p>
              <p className="copyright py-6">Made with ❤️ By Chinmay Nawkar.</p>
            </div>
        </div>
      </section>

      <Image
        src='/assets/images/register-img.png'
        alt="patient"
        width={1000}
        height={1000}
        className="side-img max-w-[40%] h-full"
      />
    </div>
  )
}
export default RegisterPage
