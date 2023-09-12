import routes from '@/routes'
import { useRoutes } from "@solidjs/router";
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
