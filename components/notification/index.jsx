import { toast } from 'react-toastify';

const options = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
};

export default {
  info: (m) => toast.info(m, options),
  success: (m) => toast.success(m, options),
  error: (m) => toast.error(m, options),
  warning: (m) => toast.warning(m, options),
};
