import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Auth } from '@/services/auth'
import { useNavigate } from '@tanstack/react-router'
import { setLoading } from '@/store/loading/actions'
import { showToast } from '@/store/toast/actions'
import { setUser } from '@/store/user/actions'

const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
})

type LoginFormData = z.infer<typeof loginSchema>

export const useLogin = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    ...rest
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    const response = await Auth.loginUser(data)
    setLoading(false)

    if (response.status === 200) {
      showToast('success', 'Login efetuado com sucesso')
      navigate({ to: '/inicial-page' })
      setUser(response.data)
    } else {
      showToast('error', response.message)
    }

    console.log(data)
  }

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    ...rest
  }
}
