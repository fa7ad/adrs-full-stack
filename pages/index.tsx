import Layout from 'components/Layout';
import { usePageTitleEffect } from 'utils/pageTitle';

type Props = {};

const Blog: React.FC<Props> = props => {
  usePageTitleEffect('Index');

  return (
    <Layout>
      <div className='page'>
        <h1>Public Feed</h1>
      </div>
    </Layout>
  );
};

export default Blog;
