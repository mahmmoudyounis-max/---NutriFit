import React, { useEffect, useState } from 'react';
import { UserProfile, DietPlan, ActivityLevel, Goal } from '../types';
import { generateDietPlan } from '../services/geminiService';
import { savePlan, getPlan, saveUser, updateUserPaymentStatus } from '../services/storage';
import { AlertCircle, Check, Loader2, RefreshCw, Lock, CreditCard, Mail, Edit, X, Save } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DashboardProps {
  user: UserProfile;
  setUser: (u: UserProfile) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setUser }) => {
  const [plan, setPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(!user.isPremium);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');
  
  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    weight: user.weight,
    height: user.height,
    age: user.age,
    activityLevel: user.activityLevel,
    goal: user.goal
  });

  useEffect(() => {
    // Load existing plan if available
    const existingPlan = getPlan();
    if (existingPlan && existingPlan.userId === user.id) {
      setPlan(existingPlan);
    }
    setShowPayment(!user.isPremium);
    
    // Sync edit form with user
    setEditForm({
        weight: user.weight,
        height: user.height,
        age: user.age,
        activityLevel: user.activityLevel,
        goal: user.goal
    });
  }, [user]);

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError('');
    try {
      const newPlan = await generateDietPlan(user);
      setPlan(newPlan);
      savePlan(newPlan);
    } catch (err) {
      setError('حدث خطأ أثناء إنشاء الخطة. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (method: 'paypal' | 'payoneer') => {
    // Simulate payment process
    setTimeout(() => {
        updateUserPaymentStatus(true);
        const updatedUser = { ...user, isPremium: true };
        setUser(updatedUser);
        saveUser(updatedUser);
        setShowPayment(false);
        setPaymentSuccessMsg(`تم الدفع بنجاح عبر ${method === 'paypal' ? 'PayPal' : 'Payoneer'}. تم إرسال نسخة من الخطة إلى بريدك الإلكتروني وإشعار إلى الإدارة.`);
        // Here we would call an API to send the email to mahmmoudyounid@gmail.com
    }, 1500);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ 
        ...editForm, 
        [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value 
    });
  };

  const saveProfileChanges = () => {
    const updatedUser = { ...user, ...editForm };
    setUser(updatedUser);
    saveUser(updatedUser);
    setIsEditing(false);
  };

  // Helper to calculate BMR and TDEE
  const calculateStats = () => {
    let bmr = 0;
    if (user.gender === 'male') {
      bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
    } else {
      bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
    }

    const activityMultipliers = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very_active': 1.9
    };
    
    const tdee = Math.round(bmr * activityMultipliers[user.activityLevel]);
    const bmi = (user.weight / ((user.height / 100) * (user.height / 100))).toFixed(1);
    
    return { bmr: Math.round(bmr), tdee, bmi };
  };

  const stats = calculateStats();
  const bmiNumber = parseFloat(stats.bmi);
  let bmiCategory = '';
  let bmiColor = '';
  
  if (bmiNumber < 18.5) { bmiCategory = 'نحافة'; bmiColor = 'text-yellow-500'; }
  else if (bmiNumber < 25) { bmiCategory = 'وزن مثالي'; bmiColor = 'text-green-500'; }
  else if (bmiNumber < 30) { bmiCategory = 'وزن زائد'; bmiColor = 'text-orange-500'; }
  else { bmiCategory = 'سمنة'; bmiColor = 'text-red-500'; }

  const chartData = [
    { name: 'بروتين', value: 30, color: '#10b981' }, // primary
    { name: 'كربوهيدرات', value: 40, color: '#3b82f6' }, // blue
    { name: 'دهون صحية', value: 30, color: '#f59e0b' }, // amber
  ];

  if (showPayment) {
      return (
          <div className="max-w-4xl mx-auto px-4 py-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-primary p-6 text-white text-center">
                      <Lock className="mx-auto h-12 w-12 mb-2" />
                      <h2 className="text-2xl font-bold">تفعيل العضوية المميزة</h2>
                      <p className="mt-2 text-green-100">احصل على خطة غذائية متكاملة مصممة خصيصاً لك</p>
                  </div>
                  <div className="p-8">
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">ملخص حالتك:</h3>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-gray-50 p-3 rounded">
                                    <p className="text-sm text-gray-500">BMI</p>
                                    <p className={`text-xl font-bold ${bmiColor}`}>{stats.bmi}</p>
                                    <p className={`text-xs ${bmiColor}`}>{bmiCategory}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded">
                                    <p className="text-sm text-gray-500">احتياجك اليومي</p>
                                    <p className="text-xl font-bold text-gray-800">{stats.tdee}</p>
                                    <p className="text-xs text-gray-500">سعرة حرارية</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded">
                                    <p className="text-sm text-gray-500">الوزن الحالي</p>
                                    <p className="text-xl font-bold text-gray-800">{user.weight}</p>
                                    <p className="text-xs text-gray-500">كجم</p>
                                </div>
                            </div>
                        </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-4">اختر وسيلة الدفع للاستمرار:</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                          <button onClick={() => handlePayment('paypal')} className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all">
                              <div className="text-blue-800 font-extrabold text-2xl italic mb-2">PayPal</div>
                              <span className="text-sm text-gray-600">دفع آمن وسريع</span>
                          </button>
                          <button onClick={() => handlePayment('payoneer')} className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all">
                              <div className="text-red-500 font-bold text-2xl mb-2">Payoneer</div>
                              <span className="text-sm text-gray-600">تحويل بنكي مباشر</span>
                          </button>
                      </div>
                      <p className="mt-6 text-xs text-center text-gray-400">
                          بإتمام الدفع، سيتم إرسال الخطة تلقائياً إلى بريدك الإلكتروني {user.email} وإشعار للدعم الفني.
                      </p>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {paymentSuccessMsg && (
          <div className="mb-6 bg-green-100 border-r-4 border-green-500 p-4 rounded shadow-sm flex items-center">
              <Mail className="h-6 w-6 text-green-600 ml-3" />
              <div>
                  <p className="font-bold text-green-700">تمت العملية بنجاح</p>
                  <p className="text-sm text-green-600">{paymentSuccessMsg}</p>
              </div>
          </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsEditing(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 left-0 pt-4 pl-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <Edit className="h-6 w-6 text-primary" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">تحديث بياناتي</h3>
                  <div className="mt-4 text-right space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">الوزن (كجم)</label>
                        <input name="weight" type="number" value={editForm.weight} onChange={handleEditChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">الطول (سم)</label>
                        <input name="height" type="number" value={editForm.height} onChange={handleEditChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">العمر</label>
                        <input name="age" type="number" value={editForm.age} onChange={handleEditChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">مستوى النشاط</label>
                        <select name="activityLevel" value={editForm.activityLevel} onChange={handleEditChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                            <option value={ActivityLevel.Sedentary}>خامل</option>
                            <option value={ActivityLevel.Light}>خفيف</option>
                            <option value={ActivityLevel.Moderate}>متوسط</option>
                            <option value={ActivityLevel.Active}>نشط</option>
                            <option value={ActivityLevel.VeryActive}>نشط جداً</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">الهدف</label>
                        <select name="goal" value={editForm.goal} onChange={handleEditChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                            <option value={Goal.LoseWeight}>إنقاص الوزن</option>
                            <option value={Goal.Maintain}>الحفاظ على الوزن</option>
                            <option value={Goal.GainMuscle}>بناء عضلات</option>
                        </select>
                      </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={saveProfileChanges}
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:text-sm"
                >
                  حفظ التغييرات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between border-r-4 border-primary relative group">
          <div>
            <div className="flex items-center">
                 <p className="text-sm text-gray-500 ml-2">مؤشر كتلة الجسم (BMI)</p>
                 <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-primary"><Edit size={14} /></button>
            </div>
            <p className={`text-3xl font-bold ${bmiColor}`}>{stats.bmi}</p>
            <p className="text-sm text-gray-400">{bmiCategory}</p>
          </div>
          <ActivityChartIcon color={bmiColor.includes('red') ? '#ef4444' : '#10b981'} />
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-r-4 border-secondary">
           <div className="flex items-center">
             <p className="text-sm text-gray-500 mb-1 ml-2">الاحتياج اليومي (TDEE)</p>
             <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-primary"><Edit size={14} /></button>
           </div>
           <div className="flex items-baseline">
             <p className="text-3xl font-bold text-gray-800">{stats.tdee}</p>
             <span className="mr-2 text-gray-500">سعرة / يوم</span>
           </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-center items-center">
             <p className="text-sm text-gray-500 mb-2">توزيع المايكروز المقترح</p>
             <div className="h-20 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={chartData} cx="50%" cy="50%" innerRadius={25} outerRadius={35} paddingAngle={5} dataKey="value">
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="flex justify-center space-x-2 space-x-reverse text-xs text-gray-500">
                 <span>بروتين</span>
                 <span>كارب</span>
                 <span>دهون</span>
             </div>
        </div>
      </div>

      {/* Plan Section */}
      <div className="bg-white shadow rounded-xl overflow-hidden min-h-[400px]">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">الخطة الغذائية الأسبوعية</h3>
          <button 
            onClick={handleGeneratePlan} 
            disabled={loading}
            className="flex items-center text-sm bg-white border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 text-gray-700"
          >
            {loading ? <Loader2 className="animate-spin ml-2 h-4 w-4" /> : <RefreshCw className="ml-2 h-4 w-4" />}
            {plan ? 'تحديث الخطة' : 'إنشاء الخطة'}
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold ml-2">خطأ!</strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-gray-500 text-lg animate-pulse">جاري تحليل البيانات وتصميم الخطة المثالية...</p>
              <p className="text-gray-400 text-sm mt-2">نستخدم الذكاء الاصطناعي لحساب أدق التفاصيل</p>
            </div>
          ) : !plan ? (
            <div className="text-center py-16">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد خطة حالياً</h3>
              <p className="mt-1 text-sm text-gray-500">اضغط على زر "إنشاء الخطة" لبدء رحلتك.</p>
              <button
                onClick={handleGeneratePlan}
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-green-600 focus:outline-none"
              >
                إنشاء خطتي الآن
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Summary */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-2">ملخص الخطة:</h4>
                <p className="text-blue-700">{plan.summary}</p>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                    <CheckCircleIcon />
                    نصائح هامة
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {plan.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start">
                            <Check className="h-5 w-5 text-primary ml-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600 text-sm">{rec}</span>
                        </li>
                    ))}
                </ul>
              </div>

              {/* Weekly Plan Tabs */}
              <div className="space-y-6">
                {plan.weeklyPlan.map((day, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 font-bold text-gray-700 flex justify-between">
                        <span>{day.day}</span>
                        <span className="text-xs bg-white px-2 py-1 rounded border">مجموع السعرات: {day.totalCalories}</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <MealRow title="الإفطار" meal={day.breakfast} />
                        <MealRow title="الغداء" meal={day.lunch} />
                        <MealRow title="العشاء" meal={day.dinner} />
                        <MealRow title="سناك" meal={day.snack} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MealRow = ({ title, meal }: { title: string, meal: any }) => (
    <div className="p-4 hover:bg-gray-50 transition-colors grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-2 font-semibold text-primary">{title}</div>
        <div className="col-span-12 md:col-span-10">
            <h5 className="font-bold text-gray-800">{meal.name}</h5>
            <p className="text-sm text-gray-600 mt-1 mb-2">{meal.description}</p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="bg-green-50 px-2 py-1 rounded text-green-700 border border-green-100">{meal.calories} سعرة</span>
                <span className="bg-blue-50 px-2 py-1 rounded text-blue-700 border border-blue-100">بروتين: {meal.protein}</span>
                <span className="bg-orange-50 px-2 py-1 rounded text-orange-700 border border-orange-100">كارب: {meal.carbs}</span>
                <span className="bg-yellow-50 px-2 py-1 rounded text-yellow-700 border border-yellow-100">دهون: {meal.fats}</span>
            </div>
        </div>
    </div>
);

const ActivityChartIcon = ({color}: {color: string}) => (
    <svg className={`h-12 w-12 opacity-20`} fill="currentColor" style={{color}} viewBox="0 0 24 24">
        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg className="h-5 w-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default Dashboard;