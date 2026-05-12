import useSyncServiceWorker from './hooks/useSyncServiceWorker';

const ServiceWorkerManager = () => {
  useSyncServiceWorker();
  return null;
};

export default ServiceWorkerManager;
