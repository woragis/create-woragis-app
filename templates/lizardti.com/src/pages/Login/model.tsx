import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Auth } from '@/services/auth'
import { useLoadingStore } from '../../store/loadingStore'
import { useToastStore } from '../../store/toastStore'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/userStore'

const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
})

type LoginFormData = z.infer<typeof loginSchema>

export const useLogin = () => {
  const { dispatch: dispatchLoading } = useLoadingStore()
  const { dispatch: dispatchToast } = useToastStore()
  const { dispatch: dispatchUser } = useAuthStore()

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
    dispatchLoading.setLoading(true)
    const response = await Auth.loginUser(data)
    dispatchLoading.setLoading(false)

    if (response.status === 200) {
      dispatchToast.setOpenToast('success', 'Login efetuado com sucesso')
      navigate('/inicial-page')
      dispatchUser.setUser(response.data)
    } else {
      dispatchToast.setOpenToast('error', response.message)
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
