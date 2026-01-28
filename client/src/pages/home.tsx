import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Menu,
  Check,
  ChevronLeft,
  Shield,
  Clock,
  Award,
  Phone,
  Car,
  FileText,
  Headphones,
  Sparkles,
  Star,
} from "lucide-react";
import alRajhiLogo from "@assets/W-123-removebg-preview_1769602081293.png";
import heroImage from "@assets/motor-img_1769601137526.webp";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-slate-900"
      dir="rtl"
    >
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 dark:text-gray-300"
              data-testid="button-menu"
            >
              <Menu className="w-6 h-6" />
            </Button>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              EN
            </span>
          </div>
          <div className="flex items-center">
            <img src={alRajhiLogo} alt="تكافل الراجحي - Al Rajhi Takaful" className="h-12 sm:h-14 md:h-16" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ 
            backgroundImage: `url(${heroImage})`,
            animation: "slowZoom 20s ease-in-out infinite alternate"
          }}
        />
        
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/60 to-black/40 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Animated decorative elements - hidden on small screens */}
        <div className="hidden sm:block absolute top-20 left-10 w-48 md:w-72 h-48 md:h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="hidden sm:block absolute bottom-20 right-20 w-64 md:w-96 h-64 md:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        
        {/* Floating particles - hidden on mobile */}
        <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDuration: "3s" }} />
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }} />
          <div className="absolute top-1/2 right-1/5 w-1 h-1 bg-primary/70 rounded-full animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }} />
        </div>
        
        {/* Hero Content */}
        <div className="relative container mx-auto px-4 py-10 sm:py-16 md:py-20">
          <div className="flex flex-col justify-center text-white max-w-3xl">
            {/* Animated Badge */}
            <div className="inline-flex items-center flex-wrap gap-1.5 sm:gap-2 bg-gradient-to-r from-primary/30 to-primary/10 backdrop-blur-md border border-primary/40 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm w-fit mb-4 sm:mb-8 shadow-lg shadow-primary/20">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary animate-pulse" />
              <span className="text-primary font-semibold">تكافل الراجحي - الأول في المملكة</span>
              <div className="flex items-center gap-0.5 mr-1 sm:mr-2">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-yellow-400" />
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-yellow-400" />
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-yellow-400" />
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-yellow-400" />
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
            
            {/* Main Title with gradient */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black mb-3 sm:mb-6 leading-tight">
              <span className="bg-gradient-to-l from-white via-white to-primary/80 bg-clip-text text-transparent">
                تأمين المركبات
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-3xl lg:text-4xl text-white/95 mb-2 sm:mb-4 font-light tracking-wide">
              حماية شاملة لسيارتك بأفضل الأسعار
            </p>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/70 mb-6 sm:mb-10 md:mb-12 max-w-xl leading-relaxed">
              احصل على تغطية تأمينية متكاملة مع خدمة عملاء متميزة على مدار الساعة. نوفر لك راحة البال مع أفضل حلول التأمين المتوافقة مع الشريعة الإسلامية.
            </p>
            
            {/* CTA Buttons with enhanced styling */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-10 md:mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-l from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-6 sm:px-10 md:px-12 py-5 sm:py-6 md:py-8 text-base sm:text-lg md:text-xl font-bold rounded-xl sm:rounded-2xl shadow-2xl shadow-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-primary/50 border border-primary/50"
                onClick={() => setLocation("/motor")}
                data-testid="button-hero-cta"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                احصل على عرض سعر
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/40 text-white hover:bg-white/15 hover:border-white/60 px-6 sm:px-8 md:px-10 py-5 sm:py-6 md:py-8 text-base sm:text-lg md:text-xl rounded-xl sm:rounded-2xl backdrop-blur-md transition-all duration-300 hover:scale-105"
                data-testid="button-learn-more"
              >
                تعرف على المزيد
              </Button>
            </div>
            
            {/* Enhanced Trust Badges */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-xl border border-white/25 px-3 sm:px-5 py-2 sm:py-3.5 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/20">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="font-semibold text-xs sm:text-sm md:text-base">تغطية شاملة</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-xl border border-white/25 px-3 sm:px-5 py-2 sm:py-3.5 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/20">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="font-semibold text-xs sm:text-sm md:text-base">خدمة 24/7</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-xl border border-white/25 px-3 sm:px-5 py-2 sm:py-3.5 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/20">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-amber-500 rounded-full flex items-center justify-center">
                  <Award className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="font-semibold text-xs sm:text-sm md:text-base">أسعار منافسة</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-xl border border-white/25 px-3 sm:px-5 py-2 sm:py-3.5 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/20">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="font-semibold text-xs sm:text-sm md:text-base">متوافق مع الشريعة</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-12 sm:h-16 md:h-20 fill-gray-50 dark:fill-slate-900">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Add keyframes for slow zoom animation */}
      <style>{`
        @keyframes slowZoom {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.15); }
        }
      `}</style>

      {/* Features Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              لماذا تختار تكافل الراجحي؟
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              نقدم لك أفضل حلول التأمين المتوافقة مع الشريعة الإسلامية مع خدمة عملاء متميزة
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <Card className="p-3 sm:p-4 md:p-6 text-center hover-elevate border-0 shadow-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary" />
              </div>
              <h3 className="text-sm sm:text-base md:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">تغطية شاملة</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 hidden sm:block">حماية كاملة لسيارتك ضد جميع المخاطر والحوادث</p>
            </Card>
            
            <Card className="p-3 sm:p-4 md:p-6 text-center hover-elevate border-0 shadow-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary" />
              </div>
              <h3 className="text-sm sm:text-base md:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">إصدار فوري</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 hidden sm:block">احصل على وثيقتك في دقائق معدودة</p>
            </Card>
            
            <Card className="p-3 sm:p-4 md:p-6 text-center hover-elevate border-0 shadow-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary" />
              </div>
              <h3 className="text-sm sm:text-base md:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">أفضل الأسعار</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 hidden sm:block">أسعار تنافسية مع خصومات حصرية</p>
            </Card>
            
            <Card className="p-3 sm:p-4 md:p-6 text-center hover-elevate border-0 shadow-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                <Headphones className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary" />
              </div>
              <h3 className="text-sm sm:text-base md:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">دعم متواصل</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 hidden sm:block">خدمة عملاء على مدار الساعة</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Insurance Types Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              أنواع التغطيات المتاحة
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              اختر التغطية المناسبة لاحتياجاتك
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <Card className="p-4 sm:p-6 md:p-8 hover-elevate border-2 border-transparent hover:border-primary/20 transition-all">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-blue-100 dark:bg-blue-900/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Car className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">تأمين ضد الغير</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed">
                تغطية أساسية تحميك من المسؤولية تجاه الآخرين في حالة الحوادث
              </p>
              <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 md:mb-8">
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0" />
                  <span>تغطية الأضرار الجسدية</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0" />
                  <span>تغطية الأضرار المادية</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0" />
                  <span>خدمة المساعدة على الطريق</span>
                </li>
              </ul>
              <Button 
                className="w-full text-sm sm:text-base" 
                variant="outline"
                onClick={() => setLocation("/motor")}
                data-testid="button-third-party"
              >
                احصل على عرض سعر
              </Button>
            </Card>
            
            <Card className="p-4 sm:p-6 md:p-8 hover-elevate border-2 border-primary/30 bg-gradient-to-b from-primary/5 to-transparent relative overflow-visible sm:col-span-2 lg:col-span-1">
              <div className="absolute -top-3 sm:-top-4 right-4 sm:right-6 bg-primary text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium">
                الأكثر طلباً
              </div>
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 mt-2 sm:mt-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-primary/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">التأمين الشامل</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed">
                تغطية كاملة لسيارتك ضد جميع المخاطر بما فيها السرقة والحريق
              </p>
              <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 md:mb-8">
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0" />
                  <span>جميع مميزات التأمين ضد الغير</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0" />
                  <span>تغطية أضرار سيارتك</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0" />
                  <span>الحماية من السرقة والحريق</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0" />
                  <span>سيارة بديلة</span>
                </li>
              </ul>
              <Button 
                className="w-full text-sm sm:text-base"
                onClick={() => setLocation("/motor")}
                data-testid="button-comprehensive"
              >
                احصل على عرض سعر
              </Button>
            </Card>
            
            <Card className="p-4 sm:p-6 md:p-8 hover-elevate border-2 border-transparent hover:border-primary/20 transition-all">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-purple-100 dark:bg-purple-900/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">تأمين مخصص</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed">
                صمم تغطيتك التأمينية حسب احتياجاتك الخاصة
              </p>
              <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 md:mb-8">
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0" />
                  <span>اختر التغطيات التي تناسبك</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0" />
                  <span>تحكم في قيمة التحمل</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0" />
                  <span>إضافات اختيارية متنوعة</span>
                </li>
              </ul>
              <Button 
                className="w-full text-sm sm:text-base" 
                variant="outline"
                onClick={() => setLocation("/motor")}
                data-testid="button-custom"
              >
                احصل على عرض سعر
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            جاهز لحماية سيارتك؟
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto">
            احصل على عرض سعر مجاني في أقل من دقيقتين
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 px-6 sm:px-8 md:px-10 py-5 sm:py-6 md:py-7 text-base sm:text-lg rounded-xl shadow-xl"
              onClick={() => setLocation("/motor")}
              data-testid="button-cta-quote"
            >
              احصل على عرض سعر الآن
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-6 sm:px-8 py-5 sm:py-6 md:py-7 text-base sm:text-lg rounded-xl"
              data-testid="button-cta-call"
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              اتصل بنا
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            <img src={alRajhiLogo} alt="تكافل الراجحي" className="h-10 sm:h-12 md:h-14" />
            <p className="text-gray-400 text-xs sm:text-sm text-center">
              © 2025 تكافل الراجحي. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
