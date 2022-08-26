import { useRoutes } from 'solid-app-router'
import routes from '@/routes'
import Navigation from './components/Navigation';

const App = () => {
  const Routes = useRoutes(routes)
  return (
    <>
      <div class="mb-16">
        <Routes />
      </div>
      <Navigation />
    </>
  );
};

export default App;
