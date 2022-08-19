import { useRoutes } from 'solid-app-router'
import routes from '@/routes'

const App = () => {
  const Routes = useRoutes(routes)
  return <Routes />;
};

export default App;
