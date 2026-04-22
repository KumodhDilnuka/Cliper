import TopBar from '../components/TopBar';

const LecturerLayout = ({ profileName = "Dr. Alistair Thorne", profileRole = "Senior Lecturer", profileImage }) => {
  return <TopBar mode="lecturer" profileName={profileName} profileRole={profileRole} profileImage={profileImage} />;
};

export default LecturerLayout;