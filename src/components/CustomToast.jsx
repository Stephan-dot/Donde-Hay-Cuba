import { Toaster, toast } from 'react-hot-toast';
import { Howl } from 'howler';

// Configuración del sonido
const sound = new Howl({
  src: ['public/sounds/notification9 meloboom.mp3'],
  volume: 0.5,
});

// Creamos un objeto que contendrá todas nuestras funciones de toast
const customToast = {
  show: (message, type = 'default', options = {}) => {
    sound.play();
    
    switch (type) {
      case 'success':
        return toast.success(message, options);
      case 'error':
        return toast.error(message, options);
      case 'info':
        return toast.info(message, options);
      default:
        return toast(message, options);
    }
  },
  
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  }
};

// También puedes añadir otras funciones útiles si las necesitas
customToast.loading = (message, options) => {
  sound.play();
  return toast.loading(message, options);
};

export const showToast = customToast.show;
showToast.dismiss = customToast.dismiss;
showToast.loading = customToast.loading;

export const CustomToaster = () => (
  <Toaster
    toastOptions={{
      duration: 3000
    }}
  />
);