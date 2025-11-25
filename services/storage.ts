import { UserProfile, DietPlan } from '../types';

const USER_KEY = 'nutrifit_user';
const PLAN_KEY = 'nutrifit_plan';

export const saveUser = (user: UserProfile): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): UserProfile | null => {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearUser = (): void => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(PLAN_KEY);
};

export const savePlan = (plan: DietPlan): void => {
  localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
};

export const getPlan = (): DietPlan | null => {
  const data = localStorage.getItem(PLAN_KEY);
  return data ? JSON.parse(data) : null;
};

export const updateUserPaymentStatus = (status: boolean): void => {
  const user = getUser();
  if (user) {
    user.isPremium = status;
    saveUser(user);
  }
};