import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Authservice } from '../services/api/auth/AuthService'

interface AuthProps {
  email: string
  password: string
}
interface AuthContextProviderProps {
  isAuthenticated: boolean
  handleLogin: (data: AuthProps) => Promise<string | void>
  handleLogout: () => void
}

interface AuthContextProps {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextProviderProps)

const LOCAL_STORAGE_KEY__ACCESS_TOKEN = 'APP_ACCESS_TOKEN'

export function AuthProvider({ children }: AuthContextProps) {
  const [accessToken, setAcessToken] = useState<string>()
  console.log(accessToken)

  useEffect(() => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN)
    if (accessToken) {
      setAcessToken(JSON.parse(accessToken))
    } else {
      setAcessToken(undefined)
    }
  }, [])

  const handleLogin = useCallback(async (data: AuthProps) => {
    const response = await Authservice.auth({
      email: data.email,
      password: data.password,
    })
    if (response) {
      setAcessToken(response.data.token)
    }
  }, [])

  const handleLogout = useCallback(() => {
    setAcessToken(undefined)
    localStorage.removeItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN)
  }, [])

  const isAuthenticated = useMemo(() => !!accessToken, [])

  return (
    <AuthContext.Provider
      value={{ handleLogin, handleLogout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  )
}