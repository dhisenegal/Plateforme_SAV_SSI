'use client' // Error boundaries must be Client Components

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="flex flex-col items-center justify-center h-screen bg-red-50 text-red-800">
        <div className="p-6 bg-white shadow rounded">
          <h1 className="text-2xl font-bold mb-4">Oups!</h1>
          <p className="mb-4">Il y a eu une erreur: {error.message}</p>
          <button 
            onClick={() => reset()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  )
}