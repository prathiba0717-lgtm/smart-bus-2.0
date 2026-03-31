
import { RouterProvider } from 'react-router-dom';
import { AppProvider } from './AppContext';
import { router } from './routes';

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

