import type { Metadata } from "next"
import LinkTree from "@/components/link-tree"

export const metadata: Metadata = {
  title: "Harsh Mistry",
  description: "A Peronal Portfolio of Harsh Mistry, a Game Developer",
}

// export default function Home() {
//   return (
//     <main className="min-h-screen flex flex-col items-center justify-start p-4 pt-8 bg-secondary">
//       <LinkTree />
//     </main>
//   )
// }

export default function Home() {
   return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-secondary">
        <LinkTree />
      </main>
   )
}
