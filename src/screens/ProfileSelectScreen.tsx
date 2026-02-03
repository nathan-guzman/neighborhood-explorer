import { useState } from 'react';
import { useAllUsers, createUser, verifyPin } from '@/hooks/useUser';
import { useAppStore } from '@/stores/appStore';
import ProfileList from '@/components/profile/ProfileList';
import CreateProfileForm from '@/components/profile/CreateProfileForm';
import PinEntry from '@/components/profile/PinEntry';
import type { User } from '@/types';

type View = 'list' | 'create' | 'pin';

export default function ProfileSelectScreen() {
  const users = useAllUsers();
  const setActiveUserId = useAppStore((s) => s.setActiveUserId);
  const [view, setView] = useState<View>('list');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pinError, setPinError] = useState('');

  if (!users) return null;

  const handleSelectUser = (user: User) => {
    if (user.pinHash) {
      setSelectedUser(user);
      setPinError('');
      setView('pin');
    } else {
      setActiveUserId(user.id!);
    }
  };

  const handlePinSubmit = async (pin: string) => {
    if (!selectedUser) return;
    const valid = await verifyPin(selectedUser, pin);
    if (valid) {
      setActiveUserId(selectedUser.id!);
    } else {
      setPinError('Incorrect PIN');
    }
  };

  const handleCreateProfile = async (username: string, pin: string | null) => {
    const id = await createUser(username, pin);
    setActiveUserId(id);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-sm">
        {view === 'list' && (
          <>
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                Neighborhood Explorer
              </h1>
              <p className="text-gray-500">
                {users.length > 0
                  ? 'Choose your profile'
                  : 'Create a profile to get started'}
              </p>
            </div>

            {users.length > 0 ? (
              <ProfileList
                users={users}
                onSelect={handleSelectUser}
                onCreate={() => setView('create')}
              />
            ) : (
              <CreateProfileForm
                onSubmit={handleCreateProfile}
                onCancel={() => {}}
                existingUsernames={users.map((u) => u.username.toLowerCase())}
              />
            )}
          </>
        )}

        {view === 'create' && (
          <>
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              New Profile
            </h2>
            <CreateProfileForm
              onSubmit={handleCreateProfile}
              onCancel={() => setView('list')}
              existingUsernames={users.map((u) => u.username.toLowerCase())}
            />
          </>
        )}

        {view === 'pin' && selectedUser && (
          <PinEntry
            username={selectedUser.username}
            onSubmit={handlePinSubmit}
            onCancel={() => {
              setView('list');
              setSelectedUser(null);
            }}
            error={pinError}
          />
        )}
      </div>
    </div>
  );
}
