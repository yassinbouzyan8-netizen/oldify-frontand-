import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Inscription | Oldify",
  description: "Créez votre compte Oldify",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 md:flex-row">
      <div className="flex w-full flex-1 flex-col justify-center px-8 py-12 md:w-1/2 md:px-12 lg:px-16 xl:px-20">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-10 inline-block">
            <Image
              src="/imges/logo/image.png"
              alt="Oldify"
              width={160}
              height={48}
              className="h-auto w-36 object-contain object-left sm:w-40"
              priority
            />
          </Link>
          <RegisterForm />
        </div>
      </div>

      <div className="relative hidden min-h-[40vh] w-full md:block md:min-h-screen md:w-1/2">
        <Image
          src="/imges/auth/image.png"
          alt=""
          fill
          className="object-cover"
          sizes="50vw"
          priority
        />
      </div>
    </div>
  );
}
