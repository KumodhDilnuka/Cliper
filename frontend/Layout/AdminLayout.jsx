import TopBar from '../components/TopBar';

const AdminLayout = ({ profileImage }) => {
  return <TopBar mode="admin" profileImage={profileImage} />;
};

export default AdminLayout;