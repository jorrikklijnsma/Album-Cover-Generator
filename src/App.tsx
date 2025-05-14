// src/App.tsx
import HomePage from './pages/HomePage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  return (
    <div className="bg-aurora flex min-h-screen flex-col bg-cover bg-no-repeat">
      <Header />
      <main className="container mx-auto flex-grow px-4 py-8">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
}

export default App;
