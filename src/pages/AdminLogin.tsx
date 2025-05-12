
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Mock admin authentication (in a real app, this would be done securely)
  const MOCK_PASSWORD = "admin123";
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      if (password === MOCK_PASSWORD) {
        // Store authentication state (in a real app, use JWT or session cookies)
        localStorage.setItem("adminAuthenticated", "true");
        toast.success("Login realizado com sucesso!");
        navigate("/admin/dashboard");
      } else {
        toast.error("Senha incorreta. Tente novamente.");
      }
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-beige flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Lock size={24} className="text-green" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-green">Área Administrativa</h1>
            <p className="text-gray-600 mt-2">Digite a senha para acessar</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
                placeholder="Digite a senha de administrador"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium
                ${isLoading ? "bg-green-300 cursor-not-allowed" : "bg-green hover:bg-green-600"}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a href="/" className="text-green hover:text-green-600 text-sm">
              Voltar para a página inicial
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
