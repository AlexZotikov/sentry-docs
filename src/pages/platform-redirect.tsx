import React, {useEffect} from 'react';
import {useLocation, useNavigate} from '@reach/router';
import {PlatformIcon} from 'platformicons';
import {parse} from 'query-string';

import {usePlatformList} from '../components/hooks/usePlatform';
import Layout from '../components/layout';
import SmartLink from '../components/smartLink';

type Props = {
  path?: string;
};

function BasePlatformRedirect({path = '/'}: Props) {
  const platformList = usePlatformList();

  return (
    <Layout>
      <h1>Platform Specific Content</h1>
      <p>
        The page you are looking for is customized for each platform. Select your platform
        below and we&apos;ll direct you to the most specific documentation on it.
      </p>

      <ul>
        {platformList.map(platform => (
          <li key={platform.key}>
            <SmartLink to={`/platforms/${platform.key}${path}`}>
              <PlatformIcon
                size={16}
                platform={platform.key}
                style={{marginRight: '0.5rem'}}
                format="lg"
              />
              <h4 style={{display: 'inline-block'}}>{platform.title}</h4>
            </SmartLink>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

export default function PlatformRedirect() {
  const platformList = usePlatformList();

  const location = useLocation();
  const navigate = useNavigate();

  const queryString = parse(location.search, {arrayFormat: 'none'});
  const path = (queryString.next as string | null) || '';
  const requestedPlatform = queryString.platform as string | null;

  const isValidPlatform = platformList.some(
    p => p.key === requestedPlatform?.toLowerCase()
  );

  const shouldRedirect = isValidPlatform && requestedPlatform;

  useEffect(() => {
    if (shouldRedirect) {
      navigate(`/platforms/${requestedPlatform}${path}`);
    }
  }, [navigate, path, requestedPlatform, shouldRedirect]);

  if (shouldRedirect) {
    return null;
  }

  return <BasePlatformRedirect path={path || ''} />;
}
