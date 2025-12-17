import { Toaster } from 'sonner';
import { MadlibsGame } from './components/MadlibsGame';

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <MadlibsGame />
    </>
  );
}

export default App;
