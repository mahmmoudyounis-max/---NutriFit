import React from 'react';
import { ArrowLeft, CheckCircle, Shield, Star, Users } from 'lucide-react';

interface HomeProps {
  onStart: () => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-right">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">احصل على جسمك المثالي</span>{' '}
                  <span className="block text-primary">بخطط علمية مدروسة</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  برامج تغذية علاجية ونحافة مخصصة لك بالكامل. نستخدم الذكاء الاصطناعي وأحدث التوصيات الطبية لتصميم جدولك الغذائي بناءً على وزنك، طولك، وعمرك.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button
                      onClick={onStart}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-green-600 md:py-4 md:text-lg md:px-10 transition-all transform hover:scale-105"
                    >
                      ابدأ الآن مجاناً
                      <ArrowLeft className="mr-2 h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:left-0 lg:w-1/2 bg-green-50 flex items-center justify-center">
            <img 
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="طعام صحي" 
                className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full opacity-90"
            />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">لماذا نحن؟</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              نهج متكامل لصحتك
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              لا مزيد من التخمين. احصل على خطة دقيقة تناسب أسلوب حياتك.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">موثوق علمياً</h3>
                <p className="mt-2 text-base text-gray-500">
                  نعتمد على بروتوكولات التغذية العلاجية المعتمدة من كبرى المنظمات الصحية.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">مخصص لك</h3>
                <p className="mt-2 text-base text-gray-500">
                  تحليل دقيق لبيانات جسمك (BMI, BMR) لتحديد احتياجاتك بدقة متناهية.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">متابعة مستمرة</h3>
                <p className="mt-2 text-base text-gray-500">
                  إمكانية تحديث بياناتك في أي وقت والحصول على خطط جديدة تناسب تطورك.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;