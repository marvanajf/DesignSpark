import { createContext, useState, useContext, type ReactNode } from 'react';

type UserAvatarContextType = {
  avatarColor: string;
  setAvatarColor: (color: string) => void;
};

const defaultContext: UserAvatarContextType = {
  avatarColor: 'bg-[#74d1ea]/20',
  setAvatarColor: () => {},
};

export const UserAvatarContext = createContext<UserAvatarContextType>(defaultContext);

type UserAvatarProviderProps = {
  children: ReactNode;
};

export const UserAvatarProvider = ({ children }: UserAvatarProviderProps) => {
  const [avatarColor, setAvatarColor] = useState<string>('bg-[#74d1ea]/20');

  return (
    <UserAvatarContext.Provider value={{ avatarColor, setAvatarColor }}>
      {children}
    </UserAvatarContext.Provider>
  );
};

export const useUserAvatar = () => useContext(UserAvatarContext);