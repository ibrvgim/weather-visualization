import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CompareWeather from './pages/CompareWeather';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/compare',
    element: <CompareWeather />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
