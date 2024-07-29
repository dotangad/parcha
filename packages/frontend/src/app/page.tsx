import Header from "@/components/header";
import { EnsureAuthenticated } from "@/lib/authcontext";
import Image from "next/image";

export default function Home() {
  return (
   <div>
    <Header />
      <div className="w-full mx-auto my-8">
        <p className="text-4xl font-semibold font-mono">Welcome!</p>
        <p className="text-lg mt-2">
          <span className="italic font-mono font-semibold">parcha</span> (roughly piece or chit in Hindi) is a knowledge management app for the common man. It keeps your data in your hands and provides near infinte customizability through the extension engine. It&apos;s also open source!
          Whereas disregard and contempt for human rights have resulted
        </p>
      </div>
      <EnsureAuthenticated unauthenticated={<></>}>
        <>
          {/* <div className="w-full mx-auto mt-10 grid grid-cols-4 gap-4">
            {Object.values(extensions).map((extension, i) => {
              return (
                <div className="aspect-w-1 aspect-h-[1.3]" key={i}>
                  <extension.Create />
                </div>
              )
            })}
          </div>
          <div className="w-full mx-auto mt-6">
            <QueryDocuments />
          </div> */}
        </>
      </EnsureAuthenticated>
   </div>
  );
}
