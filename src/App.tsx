import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RootLayout } from './layouts/root-layout'
import { AuthLayout } from './layouts/auth-layout'
import { Login } from './pages/auth/login';
import { Register } from './pages/auth/register';
import PrivateRoute from './private/private-route';
import { useEffect } from 'react';
import { authService } from './services/auth.service';
import { useAuthStore } from './store/auth-store';
import { AdminLayout } from './layouts/admin-layout';
import { SubjectPage } from './pages/admin/subjects/subjects';
import { TestsPage } from './pages/admin/tests/tests';
import Blocks from './pages/admin/blocks/blocks';
import PublicBlocksPage from './pages/blocks/public-blocks';
import DashboardPage from './pages/dashboard/dashboard';
import AdminUsersPage from './pages/admin/users/users';
import AdminDashboard from './pages/admin/dashboard/admin-dashboard';
import Quiz from './pages/quiz/quiz';
import QuizResults from './pages/quiz/quiz-results';
import QuizRating from './pages/quiz/quiz-rating';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute roles={['admin', 'student']}>
        <RootLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute roles={['student', 'admin']}>
            <DashboardPage />
          </PrivateRoute>
        ),
      },
      {
        path: "blocks",
        element: (
          <PrivateRoute roles={['student', 'admin']}>
            <PublicBlocksPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'quiz/:blockId',
        element: (
          <PrivateRoute roles={['admin', 'student']}>
            <Quiz />
          </PrivateRoute>
        )
      }
      ,
      {
        path: 'result/quiz',
        element: (
          <PrivateRoute roles={['admin', 'student']}>
            <QuizResults />
          </PrivateRoute>
        )
      },
      {
        path: 'ratings/quiz',
        element: (
          <PrivateRoute roles={['admin', 'student']}>
            <QuizRating />
          </PrivateRoute>
        )
      }
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <PrivateRoute roles={['admin']}>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />
      },
      {
        path: 'subjects',
        element: <SubjectPage />
      },
      {
        path: 'tests',
        element: <TestsPage />
      },
      {
        path: 'blocks',
        element: <Blocks />
      },
      {
        path: 'users',
        element: <AdminUsersPage />
      }
    ]
  },
  {
    path: "/unauthorized",
    element: (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Ruxsat yo'q</h1>
          <p className="text-gray-600 mb-4">Bu sahifaga kirish uchun yetarli huquqlaringiz yo'q.</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Orqaga qaytish
          </button>
        </div>
      </div>
    ),
  },
]);

export default function App() {
  const { handleAuth, logout } = useAuthStore();
  useEffect(() => {
    (async () => {
      try {
        const profile = await authService.profile();
        handleAuth(profile.user);
      } catch (error) {
        console.error(error);
        logout();
      }
    })();
  }, [handleAuth, logout])

  return <RouterProvider router={router} />
}
