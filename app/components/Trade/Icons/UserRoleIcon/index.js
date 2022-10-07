import * as React from 'react';

import { UserRole } from '../../../../Data/Models';
import AdminIcon from '../../../../assets/icons/profile/roles/admin.svg';
import ModeratorIcon from '../../../../assets/icons/profile/roles/admin.svg';

const UserRoleIcon = ({ role, size = 20 }) => {
  if (role === 'ADMIN') {
    return <AdminIcon width={size} height={size} />;
  } else if (role === 'MODERATOR') {
    return <ModeratorIcon width={size} height={size} />;
  } else {
    // normal user has no Role Icon
    return <></>;
  }
};

export default UserRoleIcon;
