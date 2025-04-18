import logo from "../../assets/logo_lizard.png"; // ✅ Importação correta da logo
import { useLogin } from "./model";

type LoginViewProps = ReturnType<typeof useLogin>;

export const LoginView = (props: LoginViewProps) => {
  const { register, handleSubmit, errors, onSubmit } = props;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      {/* Card de Login */}
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-xl">
        
        {/* Logo Centralizada */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-32" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-300">E-mail</label>
            <input
              type="email"
              className="w-full mt-1 rounded-md bg-gray-700 px-4 py-2 text-white outline-none transition-all focus:ring-2 focus:ring-green-500"
              placeholder="Digite seu e-mail"
              {...register('email')} 
            />
            {errors.email && (
              <span className="text-sm text-red-500">{errors.email.message}</span>
            )}
          </div>

          <div>
            <label className="block text-gray-300">Senha</label>
            <input
              type="password"
              className="w-full mt-1 rounded-md bg-gray-700 px-4 py-2 text-white outline-none transition-all focus:ring-2 focus:ring-green-500"
              placeholder="Digite sua senha"
              {...register('password')} 
            />
            {errors.password && (
              <span className="text-sm text-red-500">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-4 rounded-md bg-green-500 px-4 py-2 text-white font-semibold transition-all hover:bg-green-600 focus:ring-2 focus:ring-green-500"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};