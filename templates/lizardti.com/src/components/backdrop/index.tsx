import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

import { useLoading } from '@/store/loading/hooks'
import { setLoading } from '@/store/loading/actions'

export default function SimpleBackdrop() {
  const { loading } = useLoading()

  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
      onClick={() => setLoading(false)}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}
