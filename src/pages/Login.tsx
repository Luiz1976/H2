// src/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Log de debugging para identificar problemas
  useEffect(() => {
    console.log('🔍 [LOGIN] Componente Login montado');
    console.log('🔍 [LOGIN] User atual:', user);
    console.log('🔍 [LOGIN] Location:', window.location.href);
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    console.log('🔍 [LOGIN] Tentativa de login iniciada');
    
    try {
      const result = await login(email, password);
      console.log('🔍 [LOGIN] Resultado do login:', result);
      
      if (result.success && result.user) {
        console.log('🔍 [LOGIN] Login bem-sucedido, redirecionando para animação pós-login');
        navigate('/post-login-animation');
      } else {
        console.log('🔍 [LOGIN] Login falhou:', result.message);
        setError(result.message || 'Ocorreu um erro ao fazer login');
      }
    } catch (loginError) {
      console.error('❌ [LOGIN] Erro no processo de login:', loginError);
      setError('Erro interno no sistema de login');
    }
  };

  console.log('🔍 [LOGIN] Renderizando componente Login');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Entre com suas credenciais para acessar o sistema.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2 relative">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer" style={{ top: '1.5rem' }} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">Entrar</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;