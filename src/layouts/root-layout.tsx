import Header from "@/components/header/header"
import { Outlet } from "react-router-dom"

export function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
} 