import PocketBase from 'pocketbase';

export const pb = new PocketBase('https://b2core.junaid.pk');

export type AuthModel = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  verified: boolean;
  userStatus: string;
};

export const isUserValid = () => pb.authStore.isValid; 