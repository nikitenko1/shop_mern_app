import { Helmet } from 'react-helmet';

const HeadInfo = ({ title }) => {
  return (
    <Helmet>
      <title>Let&apos;s work || {title}</title>
    </Helmet>
  );
};

export default HeadInfo;
