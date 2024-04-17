"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const Error = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image
                src="/404error-lightmode.png"
                height="300"
                width="300"
                alt="Error 404"
                className="dark:hidden"
            />
            <Image
                src="/404error-darkmode.png"
                height="300"
                width="300"
                alt="Error 404"
                className="hidden dark:block"
            />
            <h2 className="text-xl font-medium">
                Something went wrong!
            </h2>
            <Button asChild>
               <Link href="/documents">
                    Go Back
               </Link> 
            </Button>
        </div>
    );
}

export default Error;