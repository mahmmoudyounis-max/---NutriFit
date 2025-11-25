import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, DietPlan } from '../types';

const apiKey = process.env.API_KEY;

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: apiKey });

export const generateDietPlan = async (user: UserProfile): Promise<DietPlan> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    أنت خبير تغذية عالمي متخصص في التغذية العلاجية وإنقاص الوزن.
    قم بإنشاء خطة غذائية أسبوعية مفصلة ومخصصة بناءً على البيانات التالية:
    - الاسم: ${user.name}
    - العمر: ${user.age} سنة
    - الجنس: ${user.gender === 'male' ? 'ذكر' : 'أنثى'}
    - الطول: ${user.height} سم
    - الوزن: ${user.weight} كجم
    - مستوى النشاط: ${user.activityLevel}
    - الهدف: ${user.goal === 'lose_weight' ? 'إنقاص الوزن' : user.goal === 'gain_muscle' ? 'بناء العضلات' : 'الحفاظ على الوزن'}
    
    الخطة يجب أن تكون علمية، متوازنة، وتحتوي على سعرات حرارية محسوبة بدقة.
    قم بتضمين نصائح عامة في البداية.
    
    المخرجات يجب أن تكون بصيغة JSON فقط وتتبع الهيكل المحدد بدقة.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "ملخص للحالة والهدف والسعرات المستهدفة يومياً" },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "قائمة بالنصائح العامة الهامة"
          },
          weeklyPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING, description: "اسم اليوم (السبت، الأحد...)" },
                totalCalories: { type: Type.NUMBER, description: "مجموع السعرات لهذا اليوم" },
                breakfast: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    calories: { type: Type.NUMBER },
                    protein: { type: Type.STRING },
                    carbs: { type: Type.STRING },
                    fats: { type: Type.STRING },
                  }
                },
                lunch: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    calories: { type: Type.NUMBER },
                    protein: { type: Type.STRING },
                    carbs: { type: Type.STRING },
                    fats: { type: Type.STRING },
                  }
                },
                dinner: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    calories: { type: Type.NUMBER },
                    protein: { type: Type.STRING },
                    carbs: { type: Type.STRING },
                    fats: { type: Type.STRING },
                  }
                },
                snack: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    calories: { type: Type.NUMBER },
                    protein: { type: Type.STRING },
                    carbs: { type: Type.STRING },
                    fats: { type: Type.STRING },
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("فشل في إنشاء الخطة الغذائية. يرجى المحاولة مرة أخرى.");
  }

  const generatedData = JSON.parse(response.text);

  return {
    id: Date.now().toString(),
    userId: user.id,
    createdAt: new Date().toISOString(),
    summary: generatedData.summary,
    weeklyPlan: generatedData.weeklyPlan,
    recommendations: generatedData.recommendations
  };
};