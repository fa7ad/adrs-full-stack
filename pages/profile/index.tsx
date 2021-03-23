import { NextPage } from 'next';

const Profile: NextPage<{}> = function Profile(_props) {
  return <div>Hello</div>;
};

Profile.getInitialProps = function getInitialProps(_ctx) {
  return {};
};

export default Profile;
