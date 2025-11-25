import React, { useState } from 'react';
import { UserProfile, ActivityLevel, Goal } from '../types';
import { saveUser } from '../services/storage';

interface AuthProps {
  onAuthSuccess: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(false); // Default to register for better conversion
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    height: '',
    weight: '',
    gender: 'male',
    activityLevel: ActivityLevel.Sedentary,
    goal: Goal.LoseWeight
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new user object
    const newUser: UserProfile = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      age: Number(formData.age),
      height: Number(formData.height),
      weight: Number(formData.weight),
      gender: formData.gender as 'male' | 'female',
      activityLevel: formData.activityLevel as any,
      goal: formData.goal as any,
      isPremium: false,
      registrationDate: new Date().toISOString()
    };

    saveUser(newUser);
    onAuthSuccess(newUser);
  };

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          خطوتك الأولى نحو حياة صحية
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Basic Info */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">الاسم الكامل</label>
              <div className="mt-1">
                <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
              <div className="mt-1">
                <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>
            </div>

            {/* Physical Stats - Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700">العمر (سنة)</label>
                  <input id="age" name="age" type="number" required min="10" max="100" value={formData.age} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">الجنس</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm">
                        <option value="male">ذكر</option>
                        <option value="female">أنثى</option>
                    </select>
                </div>
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700">الوزن (كجم)</label>
                  <input id="weight" name="weight" type="number" required min="30" max="300" value={formData.weight} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700">الطول (سم)</label>
                  <input id="height" name="height" type="number" required min="100" max="250" value={formData.height} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
            </div>

            {/* Lifestyle */}
            <div>
              <label className="block text-sm font-medium text-gray-700">مستوى النشاط</label>
              <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm">
                <option value={ActivityLevel.Sedentary}>خامل (قليل أو لا تمارين)</option>
                <option value={ActivityLevel.Light}>خفيف (تمارين خفيفة 1-3 أيام)</option>
                <option value={ActivityLevel.Moderate}>متوسط (تمارين متوسطة 3-5 أيام)</option>
                <option value={ActivityLevel.Active}>نشط (تمارين شاقة 6-7 أيام)</option>
                <option value={ActivityLevel.VeryActive}>نشط جداً (تمارين شاقة جداً)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">الهدف الرئيسي</label>
              <select name="goal" value={formData.goal} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm">
                <option value={Goal.LoseWeight}>إنقاص الوزن</option>
                <option value={Goal.Maintain}>الحفاظ على الوزن</option>
                <option value={Goal.GainMuscle}>زيادة الكتلة العضلية</option>
              </select>
            </div>

            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                {isLogin ? 'تسجيل الدخول' : 'تسجيل والبدء'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                {isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;