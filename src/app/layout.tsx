'use client'

import LoadingScreen from '@/components/LoadingScreen'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import './globals.css'
import ErrorBoundary from '@/components/ErrorBoundary'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import apiClient from '@/utils/apiClient'

// export const metadata: Metadata = {
//   title: 'Ebook Reader',
//   description: 'AI-powered ebook reader - By Tranquility',
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en">
      <body className=''>
        <AuthProvider>
          <AuthWrapper>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </AuthWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated, setIsLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const healthCheck = async () => {
      try {
        const response = await apiClient.get("/auth/health-check")
        if (response.status === 200) {
          setIsLoading(false)
        } else {
          throw new Error('Health check failed')
        }
      } catch (error) {
        console.error('Error during health check:', error)
      } finally {
        setIsLoading(false)
      }
    }

    healthCheck()
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login"); // Redirect to login if not authenticated
      //   window.location.href = "/login";
    }
  }, [isAuthenticated, router]);

  // if (!user && typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
  //   return null;
  // }

  return <>{isLoading ? <LoadingScreen /> : children}</>;
}