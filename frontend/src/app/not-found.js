import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="text-center max-w-md animate-fade-in">
        <div className="text-8xl font-black text-indigo-600 mb-2">404</div>
        <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h2>
        <p className="text-gray-500 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
