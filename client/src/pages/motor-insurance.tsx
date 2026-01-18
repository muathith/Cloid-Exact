import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, ChevronLeft, ChevronRight, Check, Zap, Sparkles, Car, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insuranceFormSchema, type InsuranceFormData } from "@shared/schema";

export default function MotorInsurance() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"new" | "renew">("new");
  const [showError, setShowError] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<InsuranceFormData>({
    resolver: zodResolver(insuranceFormSchema),
    defaultValues: {
      nationalId: "1035257896",
      birthDay: "01",
      birthMonth: "01",
      birthYear: "2010",
      isHijri: false,
      phoneNumber: "546555666",
      acceptMarketing: true,
      carInsurance: true,
      healthInsurance: true,
      generalInsurance: true,
      protectionAndSavings: true,
      vehicleSerial: "",
      vehicleYear: "2023",
      coverageType: "comprehensive",
      roadsideAssistance: false,
      replacementCar: false,
      personalAccident: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsuranceFormData) => {
      return apiRequest("POST", "/api/insurance/apply", data);
    },
    onSuccess: () => {
      toast({
        title: "تم الإرسال بنجاح",
        description: "سيتم التواصل معك قريباً",
      });
      setCurrentStep(3);
    },
    onError: () => {
      toast({
        title: "حدث خطأ",
        description: "الرجاء المحاولة مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const handleStep1Submit = () => {
    const step1Fields = ["nationalId", "birthDay", "birthMonth", "birthYear", "phoneNumber"] as const;
    const isValid = step1Fields.every(field => !form.formState.errors[field]);
    if (isValid) {
      setCurrentStep(2);
    }
  };

  const onSubmit = (data: InsuranceFormData) => {
    if (currentStep === 1) {
      handleStep1Submit();
    } else if (currentStep === 2) {
      mutation.mutate(data);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));
  const carYears = Array.from({ length: 30 }, (_, i) => String(currentYear - i));

  const roadsideAssistance = form.watch("roadsideAssistance");
  const replacementCar = form.watch("replacementCar");
  const personalAccident = form.watch("personalAccident");

  const basePrice = 1200;
  const addOnsPrice = (roadsideAssistance ? 150 : 0) + (replacementCar ? 300 : 0) + (personalAccident ? 100 : 0);
  const subtotal = basePrice + addOnsPrice;
  const vat = subtotal * 0.15;
  const total = subtotal + vat;

  return (
    <div className="min-h-screen bg-background">
      {showError && currentStep === 1 && (
        <div 
          className="bg-red-50 border-b border-red-100 px-4 py-3 flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => setShowError(false)}
          data-testid="error-banner"
        >
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-700">
            رقم الجوال غير مرتبط برقم الهوية ، الرجاء ادخال البيانات الصحيحة
          </span>
        </div>
      )}

      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            أمّن مركبتك الآن
          </h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="text-sm">تغطيات مجانية لسيارتك مع ضد الغير</span>
          </div>
        </div>

        {currentStep < 3 && (
          <>
            <div className="flex gap-3 mb-6 justify-center">
              <Button
                variant={activeTab === "new" ? "default" : "outline"}
                className="rounded-full px-5 h-10"
                onClick={() => setActiveTab("new")}
                data-testid="tab-new-policy"
              >
                {activeTab === "new" && <Check className="h-4 w-4 ml-2" />}
                وثيقة جديدة
              </Button>
              <Button
                variant={activeTab === "renew" ? "default" : "outline"}
                className="rounded-full px-5 h-10"
                onClick={() => setActiveTab("renew")}
                data-testid="tab-renew-policy"
              >
                {activeTab === "renew" ? <Check className="h-4 w-4 ml-2" /> : <Sparkles className="h-4 w-4 ml-2" />}
                تجديد الوثيقة
              </Button>
            </div>

            <div className="flex items-center justify-center gap-3 mb-6">
              <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {currentStep > 1 ? <Check className="h-4 w-4" /> : '1'}
                </div>
                <span className="text-sm hidden sm:inline">البيانات الشخصية</span>
              </div>
              <div className={`w-12 h-0.5 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {currentStep > 2 ? <Check className="h-4 w-4" /> : '2'}
                </div>
                <span className="text-sm hidden sm:inline">بيانات المركبة</span>
              </div>
            </div>
          </>
        )}

        {currentStep === 1 && (
          <Card className="p-6 shadow-sm">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-1 h-10 bg-primary rounded-full mt-0.5" />
              <div>
                <h2 className="font-bold text-foreground text-lg">التفاصيل الشخصية</h2>
                <p className="text-sm text-muted-foreground">يرجى تعبئة المعلومات التالية</p>
              </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block text-right">
                  الهوية الوطنية / إقامة / الرقم الموحد 700
                </Label>
                <Input
                  {...form.register("nationalId")}
                  placeholder="1035257896"
                  className="text-left h-12 text-base"
                  dir="ltr"
                  data-testid="input-national-id"
                />
                {form.formState.errors.nationalId && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.nationalId.message}</p>
                )}
              </div>

              <div>
                <Label className="text-sm text-muted-foreground mb-2 block text-right">تاريخ الميلاد</Label>
                <div className="flex gap-3 items-center flex-row-reverse">
                  <Input
                    {...form.register("birthDay")}
                    placeholder="01"
                    className="w-16 text-center h-12 text-base"
                    data-testid="input-birth-day"
                  />
                  <Select
                    value={form.watch("birthYear")}
                    onValueChange={(value) => form.setValue("birthYear", value)}
                  >
                    <SelectTrigger className="flex-1 h-12" data-testid="select-birth-year">
                      <SelectValue placeholder="السنة" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2 shrink-0">
                    <Switch
                      checked={form.watch("isHijri")}
                      onCheckedChange={(checked) => form.setValue("isHijri", checked)}
                      data-testid="switch-hijri"
                    />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">هجري</span>
                  </div>
                </div>
                {(form.formState.errors.birthDay || form.formState.errors.birthMonth || form.formState.errors.birthYear) && (
                  <p className="text-sm text-destructive mt-2">
                    {form.formState.errors.birthDay?.message || form.formState.errors.birthMonth?.message || form.formState.errors.birthYear?.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm text-muted-foreground mb-2 block text-right">رقم الجوال</Label>
                <div className="flex gap-2 flex-row-reverse">
                  <Input
                    {...form.register("phoneNumber")}
                    placeholder="5xxxxxxxx"
                    className="flex-1 text-left h-12 text-base"
                    dir="ltr"
                    data-testid="input-phone"
                  />
                  <div className="flex items-center justify-center bg-muted px-4 rounded-md border border-input text-sm text-muted-foreground h-12 shrink-0">
                    +966
                  </div>
                </div>
                {form.formState.errors.phoneNumber && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.phoneNumber.message}</p>
                )}
              </div>

              <div className="pt-5 border-t space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed text-right">
                  بالمتابعة، أقر بموافقتي على قيام شركة التعاونية بمعالجة بياناتي المتوفرة لدى مركز المعلومات الوطني لغرض التحقق من هويتي وإصدار وثيقة التأمين؛ وفقاً للتفاصيل الواردة في{" "}
                  <a href="#" className="text-primary underline">إشعار الخصوصية</a>
                </p>

                <p className="text-xs text-muted-foreground leading-relaxed text-right">
                  أوافق على استلام الرسائل التسويقية والتحديثات والعروض من التعاونية والشركات التابعة لها ؛وفقاً للتفاصيل الواردة في{" "}
                  <a href="#" className="text-primary underline">إشعار الخصوصية</a>
                </p>

                <RadioGroup
                  value={form.watch("acceptMarketing") ? "yes" : "no"}
                  onValueChange={(value) => form.setValue("acceptMarketing", value === "yes")}
                  className="flex flex-col gap-4 pt-2"
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="yes" id="marketing-yes" className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary" data-testid="radio-marketing-yes" />
                    <Label htmlFor="marketing-yes" className="text-sm font-normal">نعم</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="no" id="marketing-no" className="border-muted-foreground" data-testid="radio-marketing-no" />
                    <Label htmlFor="marketing-no" className="text-sm font-normal">لا، لا أريد أن أستقبل أي رسائل.</Label>
                  </div>
                </RadioGroup>
              </div>
            </form>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="p-6 shadow-sm">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-1 h-10 bg-primary rounded-full mt-0.5" />
              <div>
                <h2 className="font-bold text-foreground text-lg">بيانات المركبة</h2>
                <p className="text-sm text-muted-foreground">أدخل معلومات السيارة</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block text-right">
                  الرقم التسلسلي للمركبة
                </Label>
                <Input
                  {...form.register("vehicleSerial")}
                  placeholder="أدخل الرقم التسلسلي"
                  className="text-left h-12 text-base"
                  dir="ltr"
                  data-testid="input-vehicle-serial"
                />
              </div>

              <div>
                <Label className="text-sm text-muted-foreground mb-2 block text-right">سنة الصنع</Label>
                <Select 
                  value={form.watch("vehicleYear")} 
                  onValueChange={(value) => form.setValue("vehicleYear", value)}
                >
                  <SelectTrigger className="h-12" data-testid="select-vehicle-year">
                    <SelectValue placeholder="اختر السنة" />
                  </SelectTrigger>
                  <SelectContent>
                    {carYears.map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground mb-2 block text-right">نوع التغطية</Label>
                <RadioGroup
                  value={form.watch("coverageType")}
                  onValueChange={(value: "third-party" | "comprehensive") => form.setValue("coverageType", value)}
                  className="grid grid-cols-2 gap-3"
                >
                  <Label htmlFor="coverage-third-party" className="cursor-pointer">
                    <div className={`border rounded-lg p-4 transition-colors ${form.watch("coverageType") === "third-party" ? "border-primary bg-primary/5" : "bg-card hover:border-primary/50"}`}>
                      <RadioGroupItem value="third-party" id="coverage-third-party" className="sr-only" />
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium text-sm">ضد الغير</span>
                      </div>
                      <p className="text-xs text-muted-foreground">تغطية أساسية للأضرار التي تلحق بالغير</p>
                    </div>
                  </Label>
                  <Label htmlFor="coverage-comprehensive" className="cursor-pointer">
                    <div className={`border rounded-lg p-4 transition-colors ${form.watch("coverageType") === "comprehensive" ? "border-primary bg-primary/5" : "bg-card hover:border-primary/50"}`}>
                      <RadioGroupItem value="comprehensive" id="coverage-comprehensive" className="sr-only" />
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Car className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium text-sm">شامل</span>
                      </div>
                      <p className="text-xs text-muted-foreground">تغطية شاملة لمركبتك والغير</p>
                    </div>
                  </Label>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground mb-2 block text-right">إضافات اختيارية</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="roadside" 
                        checked={form.watch("roadsideAssistance")}
                        onCheckedChange={(checked) => form.setValue("roadsideAssistance", !!checked)}
                        className="data-[state=checked]:bg-primary" 
                        data-testid="checkbox-roadside" 
                      />
                      <Label htmlFor="roadside" className="text-sm font-normal">المساعدة على الطريق</Label>
                    </div>
                    <span className="text-sm text-primary font-medium">+ 150 ر.س</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="replacement" 
                        checked={form.watch("replacementCar")}
                        onCheckedChange={(checked) => form.setValue("replacementCar", !!checked)}
                        className="data-[state=checked]:bg-primary" 
                        data-testid="checkbox-replacement" 
                      />
                      <Label htmlFor="replacement" className="text-sm font-normal">سيارة بديلة</Label>
                    </div>
                    <span className="text-sm text-primary font-medium">+ 300 ر.س</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="personal-accident" 
                        checked={form.watch("personalAccident")}
                        onCheckedChange={(checked) => form.setValue("personalAccident", !!checked)}
                        className="data-[state=checked]:bg-primary" 
                        data-testid="checkbox-personal-accident" 
                      />
                      <Label htmlFor="personal-accident" className="text-sm font-normal">حوادث شخصية للسائق</Label>
                    </div>
                    <span className="text-sm text-primary font-medium">+ 100 ر.س</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground text-sm">القسط الأساسي</span>
                  <span className="font-medium">{basePrice.toLocaleString()} ر.س</span>
                </div>
                {addOnsPrice > 0 && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm">الإضافات</span>
                    <span className="font-medium">{addOnsPrice.toLocaleString()} ر.س</span>
                  </div>
                )}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground text-sm">ضريبة القيمة المضافة (15%)</span>
                  <span className="font-medium">{vat.toLocaleString()} ر.س</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="font-bold">الإجمالي</span>
                  <span className="font-bold text-primary text-lg">{total.toLocaleString()} ر.س</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {currentStep === 3 && (
          <Card className="p-8 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="font-bold text-foreground text-xl mb-2">تم استلام طلبك بنجاح</h2>
            <p className="text-muted-foreground mb-6">سيتم التواصل معك قريباً لإتمام إجراءات التأمين</p>
            <Button 
              className="rounded-full px-8"
              onClick={() => {
                setCurrentStep(1);
                form.reset();
              }}
              data-testid="button-new-request"
            >
              طلب جديد
            </Button>
          </Card>
        )}

        {currentStep < 3 && (
          <div className="flex gap-3 mt-6">
            {currentStep > 1 && (
              <Button 
                variant="outline"
                className="flex-1 h-12 text-base rounded-full gap-2"
                onClick={goBack}
                data-testid="button-back"
              >
                <ChevronRight className="h-5 w-5" />
                رجوع
              </Button>
            )}
            <Button 
              className={`h-12 text-base rounded-full gap-2 ${currentStep > 1 ? 'flex-1' : 'w-full'}`}
              onClick={form.handleSubmit(onSubmit)}
              disabled={mutation.isPending}
              data-testid="button-continue"
            >
              {mutation.isPending ? "جاري الإرسال..." : currentStep === 1 ? 'متابعة' : 'تأكيد الطلب'}
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-x-4 gap-y-3 justify-center">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={form.watch("carInsurance")}
              onCheckedChange={(checked) => form.setValue("carInsurance", !!checked)}
              id="car-insurance"
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-full h-5 w-5"
              data-testid="checkbox-car-insurance"
            />
            <Label htmlFor="car-insurance" className="text-sm font-normal">تأمين السيارات</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={form.watch("healthInsurance")}
              onCheckedChange={(checked) => form.setValue("healthInsurance", !!checked)}
              id="health-insurance"
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-full h-5 w-5"
              data-testid="checkbox-health-insurance"
            />
            <Label htmlFor="health-insurance" className="text-sm font-normal">تأمين الصحة</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={form.watch("generalInsurance")}
              onCheckedChange={(checked) => form.setValue("generalInsurance", !!checked)}
              id="general-insurance"
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-full h-5 w-5"
              data-testid="checkbox-general-insurance"
            />
            <Label htmlFor="general-insurance" className="text-sm font-normal">تأمين عام</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={form.watch("protectionAndSavings")}
              onCheckedChange={(checked) => form.setValue("protectionAndSavings", !!checked)}
              id="protection-savings"
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-full h-5 w-5"
              data-testid="checkbox-protection-savings"
            />
            <Label htmlFor="protection-savings" className="text-sm font-normal">تأمين حماية و الادخار</Label>
          </div>
        </div>
      </div>
    </div>
  );
}
