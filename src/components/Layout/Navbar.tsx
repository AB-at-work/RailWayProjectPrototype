// components/Layout/Navbar.tsx
export default function Navbar() {
  return (
    <header className="bg-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1 className="text-xl font-semibold text-gray-900">Railway Network Optimizer</h1>
          <div className="flex items-center">
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
              System Online
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}