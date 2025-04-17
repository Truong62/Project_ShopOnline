import React from 'react';
import Header from '../../components/Header/Header';
import UserMetaCard from '../../../dashboard/src/components/UserProfile/UserMetaCard';
import UserInfoCard from '../../../dashboard/src/components/UserProfile/UserInfoCard';
import UserAddressCard from '../../../dashboard/src/components/UserProfile/UserAddressCard';

export default function UserProfiles() {
  return (
    <>
      <Header />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <UserAddressCard />
        </div>
      </div>
    </>
  );
}
