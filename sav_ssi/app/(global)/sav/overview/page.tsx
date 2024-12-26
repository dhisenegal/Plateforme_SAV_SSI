
import { FaSpinner } from 'react-icons/fa';
import dynamic from 'next/dynamic';
const OverViewPage = dynamic(() => import('./_components/overview'), {
    loading: () => <div>
      <FaSpinner className="flex items-center justify-center animate-spin" />
       Chargement...</div>,
});
export const metadata = {
  title: 'Dashboard : Overview'
};

export default function page() {
  return <OverViewPage />;
}
