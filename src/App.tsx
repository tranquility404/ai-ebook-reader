import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"

import { AuthProvider } from "./context/AuthContext"

// import ErrorPage from "./pages/ErrorPage"
import LoadingPage from "./pages/LoadingPage"
// import ProtectedRoute from ""

// ✅ Lazy-loaded pages
const ProtectedRoute = lazy(() => import("./routes/ProtectedRoute"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const RegisterPage = lazy(() => import("./pages/Auth/RegisterPage"));
const BookInfoPage = lazy(() => import("./pages/BookInfoPage"));
const ChaptersPage = lazy(() => import("./pages/ChaptersPage"));
const EpubReaderPage = lazy(() => import("./pages/EpubReaderPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const QuizPage = lazy(() => import("./pages/QuizPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const UploadPage = lazy(() => import("./pages/UploadPage"));

function App() {
  return (
    <>
      <Suspense fallback={<LoadingPage />}>
        <Routes>

          <Route path="*" element={<NotFoundPage />} />
          {/* <Route path="/error" element={<ErrorPage />} /> */}

          <Route path='/register' element={
            <AuthProvider>
              <RegisterPage />
            </AuthProvider>
          } />

          <Route element={<ProtectedRoute />}>

            <Route path="/" element={<HomePage />} />

            <Route path="/books/:bookId" element={<BookInfoPage />} />
            <Route path="/books/:bookId/reader" element={<EpubReaderPage />} />
            <Route path="/quiz/:quizId" element={<QuizPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/upload" element={<UploadPage />} />

            <Route path="/books/:bookId/chapters" element={<ChaptersPage />} />
            
            {/* <Route element={<MLRoute />}>
              <Route path="/books/:bookId/chapters" element={<ChaptersPage />} />
            </Route> */}
          </Route>

        </Routes>
      </Suspense>
    </>
  )
}

export default App

{/* <Route index element={<HomePage />} /> */ }

// <ErrorPage errorCode={404} errorMessage="Internal Server Error"/>

{/* <Route element={
              <AuthProvider>
                <Outlet />
              </AuthProvider>
            }>
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/login' element={<LoginPage />} />

            </Route> */}

{/* <Route path='/login' element={
              <AuthProvider>
                <LoginPage />
              </AuthProvider>
            } />

            <Route path='/register' element={
              <AuthProvider>
                <RegisterPage />
              </AuthProvider>
            } /> */}
