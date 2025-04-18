import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { useLoadingStore } from '../../store/loadingStore'

export default function SimpleBackdrop() {
  const { state, dispatch } = useLoadingStore()

  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={state.startLoading}
      onClick={() => dispatch.setLoading(false)}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}
