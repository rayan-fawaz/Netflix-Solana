import Link from "next/link"
import Image from "next/image"

export default function ProfilesPage() {
  const profiles = [
    {
      id: "kanye",
      name: "Kanye",
      image: "/images/kanye.png",
    },
    {
      id: "andrew",
      name: "Andrew",
      image: "/images/andrew.png",
    },
    {
      id: "elon",
      name: "Elon",
      image: "/images/elon.png",
    },
    {
      id: "donald",
      name: "Donald",
      image: "/images/donald.png",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      <div className="w-full max-w-screen-lg px-4 py-8">
        <div className="flex justify-center mb-8">
          <h1 className="text-red-600 font-bold text-4xl">NETFLIX.FUN</h1>
        </div>

        <div className="flex flex-col items-center mt-16">
          <h2 className="text-4xl font-medium mb-16">Who's watching?</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {profiles.map((profile) => (
              <Link key={profile.id} href="/home" className="flex flex-col items-center group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-md overflow-hidden relative group-hover:ring-4 group-hover:ring-white transition duration-200">
                  <Image src={profile.image || "/placeholder.svg"} alt={profile.name} fill className="object-cover" />
                </div>
                <span className="mt-3 text-gray-400 group-hover:text-white transition duration-200">
                  {profile.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
