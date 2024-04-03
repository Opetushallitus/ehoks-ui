import { useNavigate } from "react-router"
import { useEffect } from "react"

export const Redirect = ({ to }: { to: string }) => {
  const navigate = useNavigate()
  useEffect(() => {
    if (navigate) {
      navigate(to)
    }
  }, [to, navigate])
  return null
}
