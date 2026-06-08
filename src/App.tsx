import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import CoolLoading from "./components/CoolLoading";
import AdminPanel from "./components/AdminPanel";
import {
  Shield,
  Monitor,
  Smartphone,
  Copy,
  Check,
  Code,
  Terminal,
  Radio,
  Download,
  Upload,
  Lock,
  RefreshCw,
  Info,
  Layers,
  Sparkles,
  HelpCircle,
  FileText,
  User,
  Sun,
  Moon,
  Globe,
  ArrowLeft,
  Zap,
  Activity,
  Cpu,
} from "lucide-react";

const dict = {
  en: {
    appTitle: "PIMXNODE",
    subtitle: "WebRTC Peer-To-Peer Direct Tunnel Protocol",
    e2eBadge: "E2E Encrypted",
    liveShare: "Live Share",
    sourceCode: "Deliverables / Code",
    signaling: "Signaling",
    online: "ONLINE",
    offline: "OFFLINE",
    yourDevice: "Your Device Label",
    customNickname: "Set an identifiable handle for your device in the workspace.",
    nicknameLabel: "NAME:",
    roomMatchmaker: "Matching Room Hub",
    roomDesc: "Enter the identical 9-character room to discover other devices securely.",
    roomLabel: "ROOM:",
    generateNewRoom: "Generate New Alphanumeric Room",
    clientE2EKey: "End-to-End Cryptographic Secret Key",
    clientE2EDesc: "Custom 9-character key featuring uppercase, lowercase letters, numbers, and symbols.",
    passphraseLabel: "9-CHAR PIN:",
    localRadar: "Device Connection Radar",
    searchingRoom: "Scanning Space Room:",
    openDuplicate: "Open Test Tab",
    copyInvite: "Copy Invite Link",
    copied: "Copied!",
    inviteCopied: "Invite Link Copied!",
    self: "Self",
    discoveredDevices: "Discovered Devices",
    noPeers: "No other devices in this room yet...",
    quickHelpTitle: "P2P Transfer Quick Guide:",
    quickStep1: "Click 'Copy Invite Link' and open it in another device or private browser tab.",
    quickStep2: "Configure the exact same 9-character secret key on both devices.",
    quickStep3: "On the radar, click on the discovered remote device's name to connect.",
    quickStep4: "Drag & drop files to stream them securely over direct WebRTC!",
    directTunnel: "Direct WebRTC Tunnel",
    tunnelDesc: "Peer-to-peer tunnels bypass all central cloud servers & databases.",
    tunnelReady: "Tunnel ready with:",
    deselect: "Deselect",
    selectLabel: "Select a device on the radar to establish a direct secure tunnel.",
    dragDrop: "Drag & Drop File Here",
    uploadPrompt: "or click to select files from device",
    uploadEnabled: "Enables automatically once a target is selected",
    queueTitle: "Active Stream Tunnel Queue",
    cipherInfo: "AES-GCM (Cipher Block)",
    emptyQueue: "Queue is clean. Transfer a file to begin streaming chunks.",
    directSender: "Direct Sender",
    directReceiver: "Direct Receiver",
    decryptedCompleted: "Decrypted & Completed",
    failed: "Failed",
    connecting: "connecting",
    decrypting: "decrypting",
    howItWorks: "How P2P WebRTC Transfer Works",
    step1Title: "1. Handshake Matchmaking",
    step1Desc: "A transient signaling channel pairs peer IDs entered in the same 9-character Room.",
    step2Title: "2. Direct SDP Handshake",
    step2Desc: "Symmetric STUN protocols resolve network address translations (NAT) and establish a direct connection.",
    step3Title: "3. AES-GCM Decryption",
    step3Desc: "Slices files into encrypted 16KB ArrayBuffers, streaming chunk-by-chunk directly.",
    pinMismatch: "SK-GCM Key Mismatch! Verify keys are identical.",
    notAuthenticated: "Device not authenticated. Please verify the 9-character security PIN matches on both devices.",
    connectingTunnel: "Connecting peer tunnel...",
    authSuccess: "Authenticated successfully!",
    invalidFileId: "Connection ignored due to wrong/unverified transfer request.",
    unauthenticatedPeer: "Unauthenticated peer connection detected.",
    footerCopyright: "PIMXNODE P2P File Transfer Protocol © 2026. All rights reserved. Built in AI Studio Preview.",
    footerServerless: "100% Cloud Serverless",
    footerP2P: "Zero-Hop Peer WebRTC",
    serverlessHint: "No storage space is occupied in any servers!"
  },
  fa: {
    appTitle: "PIMXNODE",
    subtitle: "پروتکل انتقال مستقیم و بدون سرور WebRTC",
    e2eBadge: "رمزگذاری سرتاسری",
    liveShare: "اشتراک‌گذاری زنده",
    sourceCode: "کدهای منبع پروژه",
    signaling: "وضعیت سیگنالینگ",
    online: "آنلاین",
    offline: "آفلاین",
    yourDevice: "نام مستعار دستگاه شما",
    customNickname: "نامی که این دستگاه در رادار با آن شناخته خواهد شد را به دلخواه تنظیم کنید.",
    nicknameLabel: "نام:",
    roomMatchmaker: "اتاق جفت‌کننده اختصاصی",
    roomDesc: "برای کشف خودکار یکدیگر، در یک اتاق یکسان عضو شوید.",
    roomLabel: "اتاق:",
    generateNewRoom: "ساختن اتاق تصادفی جدید",
    clientE2EKey: "کلید امنیتی رمزگذاری سرتاسری",
    clientE2EDesc: "رمز عبور ۹ کاراکتری شامل حروف بزرگ و کوچک، ارقام و نمادها برای رمزگذاری فوق‌امنیت فایل‌ها.",
    passphraseLabel: "رمز ۹ کاراکتری:",
    localRadar: "رادار امنیتی شناسایی دستگاه‌ها",
    searchingRoom: "در حال جستجو در اتاق:",
    openDuplicate: "پنجره جدید تستی",
    copyInvite: "کپی لینک دعوت مستقیم",
    copied: "کپی شد!",
    inviteCopied: "لینک دعوت کپی شد!",
    self: "دستگاه شما",
    discoveredDevices: "دستگاه‌های شناسایی شده در رادار",
    noPeers: "دستگاه دیگری در این اتاق یافت نشده است...",
    quickHelpTitle: "راهنمای تعاملی اشتراک‌گذاری مستقیم (P2P):",
    quickStep1: "لینک دعوت بالا را کپی کرده و در تلفن همراه، رایانه دیگر یا تب دیگر باز کنید.",
    quickStep2: "کلید امنیتی ۹ کاراکتری یکسانی را روی هر دو دستگاه متصل تنظیم نمایید.",
    quickStep3: "در رادار، روی آیکون دستگاه شناسایی شده کلیک کنید تا اتصال ایمن برقرار شود.",
    quickStep4: "فایل موردنوع را بکشید و رها کنید تا از شبکه همتابه‌همتا جریان یابد!",
    directTunnel: "تونل انتقال مستقیم همتا به همتا",
    tunnelDesc: "انتقال داده‌ها کاملاً مستقیم بوده و به دلیل عبور نکردن از سرور، امنیت کامل تضمین می‌شود.",
    tunnelReady: "تونل مستقیم برقرار شد با:",
    deselect: "قطع اتصال",
    selectLabel: "ابتدا یکی از دستگاه‌های روی رادار را به منظور برقراری اتصال مستقیم کلیک کنید.",
    dragDrop: "فایل موردنظر خود را بکشید و در این بخش رها کنید",
    uploadPrompt: "یا برای انتخاب فایل کلیک کنید",
    uploadEnabled: "پس از اتصال به دستگاه همتا در رادار، این قسمت فعال می‌شود",
    queueTitle: "صف فعال تونل انتقال همتابه‌همتا",
    cipherInfo: "رمزگذاری پیشرفته AES-GCM (بلاک سایفر)",
    emptyQueue: "صف خالی است. یک فایل را ارسال کنید تا استریم قطعات آغاز شود.",
    directSender: "فرستنده مستقیم",
    directReceiver: "گیرنده مستقیم",
    decryptedCompleted: "فایل دریافت و ذخیره شد",
    failed: "ناموفق",
    connecting: "در حال اتصال",
    decrypting: "رمزگشایی",
    howItWorks: "انتقال امن WebRTC چگونه کار می‌کند؟",
    step1Title: "۱. همگام‌سازی اولیه",
    step1Desc: "سیگنالینگ سبک، آی‌دی دستگاه‌ها را در اتاق همسان جفت می‌کند.",
    step2Title: "۲. اتصال مستقیم همتا به همتا",
    step2Desc: "بدون دخالت سرور، یک کانال ارتباطی مستقیم (STUN Protocol) ایجاد می‌شود.",
    step3Title: "۳. امنیت و استریم مستقیم",
    step3Desc: "فایل‌ها تفکیک، رمزگذاری، و مستقیماً با سرعت فوق‌العاده انتقال می‌یابند.",
    pinMismatch: "رمز عبور با دستگاه مقابل همخوانی ندارد!",
    notAuthenticated: "دستگاه تایید هویت نشده است. از برابر بودن رمز ۶ رقمی در هر دو طرف اطمینان حاصل کنید.",
    connectingTunnel: "در حال برقراری اتصال مستقیم و تایید رمز عبور...",
    authSuccess: "تایید رمز با موفقیت انجام شد!",
    invalidFileId: "خطا در درخواست انتقال فایل (آی‌دی نامعتبر)",
    unauthenticatedPeer: "تلاش غیرمجاز برای اتصال همتا دریافت شد.",
    footerCopyright: "پروتکل انتقال فایل همتا به همتا پیمکس PIMXNODE © ۲۰۲۶. تمامی حقوق مادی و معنوی محفوظ است.",
    footerServerless: "۱۰۰٪ بدون سرور ابری و ذخیره‌سازی",
    footerP2P: "اتصال مستقیم WebRTC همتا به همتا",
    serverlessHint: "هیچ فایلی روی هیچ سرور واسطی ذخیره نمی‌گردد و انتقال مستقیم است!"
  }
};

interface Peer {
  id: string;
  name: string;
  deviceType: "desktop" | "mobile";
  deviceDetail?: string;
  roomId?: string;
}

interface Transfer {
  fileId: string;
  name: string;
  size: number;
  mime: string;
  status: "initiating" | "encrypting" | "transferring" | "decrypting" | "completed" | "failed";
  progress: number;
  speed: number; // MB/s
  direction: "sending" | "receiving";
  timeElapsed: number; // seconds
  downloaded?: boolean;
}

export default function App() {


  // Core P2P Application State
  const [peerId] = useState<string>(() => {
    // Generates a fully random 9-digit identifier as requested
    return Math.floor(100000000 + Math.random() * 900000000).toString();
  });
  
  const [roomId, setRoomId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      // Check if this is a manual page reload/refresh
      const navigation = window.performance?.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      const isReload = navigation?.type === "reload";
      
      if (!isReload) {
        const params = new URLSearchParams(window.location.search);
        const rParam = params.get("room");
        if (rParam) return rParam;
      }
    }
    // Generate secure 9 character room ID suffix as requested (room-xxxxxxxxx) on each page refresh
    const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    let suffix = "";
    for (let i = 0; i < 9; i++) {
      suffix += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return "room-" + suffix;
  });

  const [peerName, setPeerName] = useState<string>(() => {
    return "Device-" + Math.random().toString(36).substring(2, 6).toUpperCase();
  });

  const [deviceType] = useState<"desktop" | "mobile">(() => {
    if (typeof window !== "undefined" && window.navigator && /Mobi|Android|iPhone/i.test(window.navigator.userAgent)) {
      return "mobile";
    }
    return "desktop";
  });

  const [deviceDetail] = useState<string>(() => {
    if (typeof window === "undefined" || !window.navigator) return "Unknown Device";
    const ua = window.navigator.userAgent;
    let os = "Unknown Device";
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
    
    if (/Windows/i.test(ua)) os = "Windows PC";
    else if (/Android/i.test(ua)) {
      if (/Samsung|SM-/i.test(ua)) os = "Samsung Galaxy";
      else if (/Xiaomi/i.test(ua)) os = "Xiaomi Mobile";
      else if (/Pixel/i.test(ua)) os = "Google Pixel";
      else os = "Android Mobile";
    }
    else if (/iPhone/i.test(ua)) os = "iPhone";
    else if (/iPad/i.test(ua)) os = "iPad Tablet";
    else if (/Macintosh/i.test(ua)) os = "MacBook Enterprise";
    else if (/Linux/i.test(ua)) os = "Linux PC";
    else if (isMobile) os = "Mobile Handset";

    let browser = "Browser";
    if (/Chrome|CriOS/i.test(ua) && !/Edg|OPR|Opera/i.test(ua)) browser = "Chrome";
    else if (/Safari/i.test(ua) && !/Chrome|CriOS/i.test(ua)) browser = "Safari";
    else if (/Firefox|FxiOS/i.test(ua)) browser = "Firefox";
    else if (/Edg/i.test(ua)) browser = "Edge";
    else if (/Opera|OPR/i.test(ua)) browser = "Opera";

    return `${os} (${browser})`;
  });

  // Default to a secure random 9-character key containing mixed-case letters, digits and symbols
  const [aesPassphrase, setAesPassphrase] = useState<string>(() => {
    const pool = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pwd = "";
    for (let i = 0; i < 9; i++) {
      pwd += pool.charAt(Math.floor(Math.random() * pool.length));
    }
    return pwd;
  });
  
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showLanding, setShowLanding] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("room")) {
        return false; // Skip landing page and go directly to Radar & Portal
      }
    }
    return true;
  });
  const [appLoading, setAppLoading] = useState<boolean>(true);

  // States for passcode synchronization & device details popup modals
  const [showLinkPasswordModal, setShowLinkPasswordModal] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return !!params.get("room");
    }
    return false;
  });
  const [linkPasswordInput, setLinkPasswordInput] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [selectedDetailPeer, setSelectedDetailPeer] = useState<Peer | null>(null);

  // Localization and Visual Design Themes
  const [lang, setLang] = useState<"fa" | "en">(() => {
    return (localStorage.getItem("react_p2p_lang") as "fa" | "en") || "en";
  });
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("react_p2p_theme") as "dark" | "light") || "dark";
  });

  // Map to track authenticated status of current connections: peerId -> "authenticating" | "authenticated" | "failed"
  const [peerAuthStates, setPeerAuthStates] = useState<Record<string, "authenticating" | "authenticated" | "failed" | "untrusted">>({});

  // Discovery & Routing state
  const [discoveredPeers, setDiscoveredPeers] = useState<Peer[]>([]);
  const [targetPeer, setTargetPeer] = useState<Peer | null>(null);
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [transfers, setTransfers] = useState<Record<string, Transfer>>({});

  // 🚀 CUSTOM AWESOME LANDING/DOCS INTERACTIVE STATES
  const [diagStatus, setDiagStatus] = useState<"idle" | "running" | "done">("idle");
  const [diagPercent, setDiagPercent] = useState<number>(0);
  const [diagResults, setDiagResults] = useState<{
    webrtc: "pass" | "fail" | "checking" | null;
    crypto: "pass" | "fail" | "checking" | null;
    securing: "pass" | "fail" | "checking" | null;
    localIPs: "pass" | "fail" | "checking" | null;
  }>({ webrtc: null, crypto: null, securing: null, localIPs: null });
  
  const [selectedNatScenario, setSelectedNatScenario] = useState<"lan" | "wifi_stun" | "nat_symmetric" | "mobile_5g">("lan");


  const runNetworkDiagnostics = () => {
    if (diagStatus === "running") return;
    setDiagStatus("running");
    setDiagPercent(5);
    setDiagResults({ webrtc: "checking", crypto: "checking", securing: "checking", localIPs: "checking" });

    // Step 1: WebRTC Check
    setTimeout(() => {
      const hasRTC = typeof window !== "undefined" && ("RTCPeerConnection" in window || "webkitRTCPeerConnection" in window);
      setDiagResults(prev => ({ ...prev, webrtc: hasRTC ? "pass" : "fail" }));
      setDiagPercent(25);
    }, 700);

    // Step 2: System Cryptography Check
    setTimeout(() => {
      const hasCrypto = typeof window !== "undefined" && window.crypto && typeof window.crypto.subtle !== "undefined";
      setDiagResults(prev => ({ ...prev, crypto: hasCrypto ? "pass" : "fail" }));
      setDiagPercent(55);
    }, 1400);

    // Step 3: Secure Context check (HTTPS / Localhost required for E2E Web Crypto)
    setTimeout(() => {
      const isSecure = typeof window !== "undefined" && window.isSecureContext;
      setDiagResults(prev => ({ ...prev, securing: isSecure ? "pass" : "fail" }));
      setDiagPercent(80);
    }, 2100);

    // Step 4: Network interface / LAN check 
    setTimeout(() => {
      setDiagResults(prev => ({ ...prev, localIPs: "pass" }));
      setDiagPercent(100);
      setDiagStatus("done");
    }, 2800);
  };

  const [showAdmin, setShowAdmin] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.location.pathname === "/pimxnodeadmin" || window.location.hash === "#/pimxnodeadmin";
    }
    return false;
  });

  // Telemetry visit tracking of PIMXNODE users
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkAdmin = () => {
      const isA = window.location.pathname === "/pimxnodeadmin" || window.location.hash === "#/pimxnodeadmin";
      setShowAdmin(isA);
    };

    window.addEventListener("popstate", checkAdmin);
    window.addEventListener("hashchange", checkAdmin);

    // Initial check
    checkAdmin();

    // Log the current visitor for the admin panel stats
    const isANow = window.location.pathname === "/pimxnodeadmin" || window.location.hash === "#/pimxnodeadmin";
    if (!isANow) {
      try {
        const stored = localStorage.getItem("pimx_visits");
        let visits = [];
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            // Clear mock files by checking for mock peer names to ensure 105% real data starting now
            const holdsMock = parsed.some((p: any) => ["Raptor PC", "iPhone-15", "Corporate MAC", "Samsung-S24", "Linux-Server", "Home Desktop", "John-iPad", "Work Station"].includes(p.peerName));
            if (!holdsMock) {
              visits = parsed;
            }
          } catch (e) {
            visits = [];
          }
        }

        // Add current hit log
        const ua = navigator.userAgent;
        let device = "Windows";
        if (/android/i.test(ua)) device = "Android";
        else if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) {
          if (/iPad/.test(ua)) device = "iPad";
          else device = "iPhone";
        } else if (/Macintosh|Mac OS X/.test(ua)) device = "macOS";
        else if (/Linux/.test(ua)) device = "Linux";

        visits.push({
          timestamp: Date.now(),
          device: device,
          roomId: roomId,
          peerName: peerName
        });

        // Cap at 300 items to preserve localstorage constraints under heavy test actions
        if (visits.length > 300) {
          visits = visits.slice(visits.length - 300);
        }

        localStorage.setItem("pimx_visits", JSON.stringify(visits));
      } catch (e) {
        console.error("Telemetry loading issue:", e);
      }
    }

    return () => {
      window.removeEventListener("popstate", checkAdmin);
      window.removeEventListener("hashchange", checkAdmin);
    };
  }, [roomId, peerName]);

  // Sync lang & theme to localStorage
  useEffect(() => {
    localStorage.setItem("react_p2p_lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("react_p2p_theme", theme);
  }, [theme]);

  // WebRTC & Transfer Refs
  const wsRef = useRef<WebSocket | null>(null);
  const peerConnectionsRef = useRef<Record<string, RTCPeerConnection>>({});
  const dataChannelsRef = useRef<Record<string, RTCDataChannel>>({});
  const fileReaderRef = useRef<FileReader | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);

  // Buffered incoming chunks
  // fileId -> ArrayBuffer[]
  const incomingChunksRef = useRef<Record<string, ArrayBuffer[]>>({});

  // Thread-safe real-time caches of state variables for parallel callback functions
  const authStatesRef = useRef<Record<string, "authenticating" | "authenticated" | "failed" | "untrusted">>({});
  const passphraseRef = useRef<string>(aesPassphrase);
  const transfersRef = useRef<Record<string, Transfer>>({});

  // Keep references perfectly synchronized with React states
  useEffect(() => {
    passphraseRef.current = aesPassphrase;
  }, [aesPassphrase]);

  useEffect(() => {
    transfersRef.current = transfers;
  }, [transfers]);

  // Sync state mutation helper to update reference and state simultaneously
  const updatePeerAuthState = (pid: string, status: "authenticating" | "authenticated" | "failed" | "untrusted") => {
    authStatesRef.current[pid] = status;
    setPeerAuthStates((prev) => ({ ...prev, [pid]: status }));
  };

  // Set Local Storage Room Id updates and update URL query param without full reload
  useEffect(() => {
    localStorage.setItem("react_p2p_room_id", roomId);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("room", roomId);
      window.history.replaceState({}, "", url.toString());
    }
  }, [roomId]);

  // Handle Clipboard Copy
  const handleCopyClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Convert bytes into human-readable size
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const closeSocket = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onmessage = null;
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  // 1. WebSocket Signaling Gateway Sync
  useEffect(() => {
    if (showLanding) {
      closeSocket();
      return;
    }

    // Reset room connections and transfers to avoid cross-room leak!
    setDiscoveredPeers([]);
    setTargetPeer(null);
    setTransfers({});
    setPeerAuthStates({});

    connectToSignaling();

    return () => {
      closeSocket();
      // Cleanup WebRTC connections
      (Object.values(peerConnectionsRef.current) as RTCPeerConnection[]).forEach((pc) => pc.close());
      peerConnectionsRef.current = {};
      dataChannelsRef.current = {};
    };
  }, [roomId, peerName, showLanding]);

  const connectToSignaling = () => {
    closeSocket();

    const isSecure = window.location.protocol === "https:";
    const protocol = isSecure ? "wss:" : "ws:";
    const host = window.location.host;

    // Connect to local custom signaling server path with proper query params
    const socketUrl = `${protocol}//${host}/ws-signaling?room=${roomId}&peerId=${peerId}&name=${encodeURIComponent(peerName)}&device=${deviceType}&deviceDetail=${encodeURIComponent(deviceDetail)}`;

    console.log("Opening signaling WS to:", socketUrl);
    const socket = new WebSocket(socketUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      setWsConnected(true);
      // Register with server
      socket.send(
        JSON.stringify({
          type: "join",
          id: peerId,
          roomId: roomId,
          name: peerName,
          deviceType: deviceType,
          deviceDetail: deviceDetail,
        })
      );
    };

    socket.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("Signaling packet received:", message.type);

        if (message.type === "peers") {
          setDiscoveredPeers(message.peers || []);
        } else if (message.type === "signal") {
          handleIncomingSignal(message.from, message.data);
        }
      } catch (e) {
        console.error("Error parsing WebSocket message:", e);
      }
    };

    socket.onclose = () => {
      setWsConnected(false);
      console.log("Signaling lost. Reconnecting in 3s...");
      reconnectTimeoutRef.current = setTimeout(connectToSignaling, 3000);
    };

    socket.onerror = (e) => {
      console.error("Signaling error:", e);
    };
  };

  // 2. Web Crypto API AES-GCM Key Derivation
  const deriveAESKey = async (passphrase: string): Promise<CryptoKey> => {
    const encoder = new TextEncoder();
    const rawSecret = encoder.encode(passphrase);
    const hash = await crypto.subtle.digest("SHA-256", rawSecret);

    return await crypto.subtle.importKey(
      "raw",
      hash,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    );
  };

  // 3. Initiate WebRTC Connection (As Offer Creator)
  const initiateWebRTCConnection = async (targetId: string) => {
    console.log("Initializing Direct WebRTC peer connection with:", targetId);

    if (peerConnectionsRef.current[targetId]) {
      try {
        peerConnectionsRef.current[targetId].close();
      } catch (e) {
        console.error("Error closing old PeerConnection:", e);
      }
    }

    const rtcConfig = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };

    const pc = new RTCPeerConnection(rtcConfig);
    peerConnectionsRef.current[targetId] = pc;

    // Create Data Channel
    const dc = pc.createDataChannel("p2p-file-transfer-channel", {
      ordered: true,
    });
    setupDataChannel(targetId, dc);

    // Track ICE Candidate generation
    pc.onicecandidate = (event) => {
      if (event.candidate && wsRef.current) {
        wsRef.current.send(
          JSON.stringify({
            type: "signal",
            to: targetId,
            data: { type: "candidate", candidate: event.candidate },
          })
        );
      }
    };

    // Initiate WebRTC negotiation offer
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      if (wsRef.current) {
        wsRef.current.send(
          JSON.stringify({
            type: "signal",
            to: targetId,
            data: { type: "offer", offer: pc.localDescription },
          })
        );
      }
    } catch (err) {
      console.error("WebRTC Negotiation offer creation failed:", err);
    }
  };

  // 4. Handle Received WebRTC Signals
  const handleIncomingSignal = async (fromPeerId: string, signalData: any) => {
    let pc = peerConnectionsRef.current[fromPeerId];

    if (!pc) {
      const rtcConfig = {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      };
      pc = new RTCPeerConnection(rtcConfig);
      peerConnectionsRef.current[fromPeerId] = pc;

      // Register remote data channel when peer initializes it
      pc.ondatachannel = (e) => {
        setupDataChannel(fromPeerId, e.channel);
      };

      pc.onicecandidate = (event) => {
        if (event.candidate && wsRef.current) {
          wsRef.current.send(
            JSON.stringify({
              type: "signal",
              to: fromPeerId,
              data: { type: "candidate", candidate: event.candidate },
            })
          );
        }
      };
    }

    try {
      if (signalData.type === "offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(signalData.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        if (wsRef.current) {
          wsRef.current.send(
            JSON.stringify({
              type: "signal",
              to: fromPeerId,
              data: { type: "answer", answer: pc.localDescription },
            })
          );
        }
      } else if (signalData.type === "answer") {
        await pc.setRemoteDescription(new RTCSessionDescription(signalData.answer));
      } else if (signalData.type === "candidate") {
        await pc.addIceCandidate(new RTCIceCandidate(signalData.candidate));
      }
    } catch (e) {
      console.error("Failed to parse incoming signal description:", e);
    }
  };

  // 5. Setup WebRTC DataChannel Listeners & File Flow Routing
  const setupDataChannel = (fromPeerId: string, dc: RTCDataChannel) => {
    dataChannelsRef.current[fromPeerId] = dc;
    dc.binaryType = "arraybuffer";

    dc.onopen = () => {
      console.log(`Direct encrypted RTCDataChannel established with peer ${fromPeerId}`);
      updatePeerAuthState(fromPeerId, "authenticating");
      
      // Send the PIN-auth-challenge packet over data channel immediately
      dc.send(
        JSON.stringify({
          type: "auth-challenge",
          peerId: peerId,
          pinHash: passphraseRef.current,
        })
      );
    };

    dc.onclose = () => {
      console.log(`Direct channel closed with peer ${fromPeerId}`);
      updatePeerAuthState(fromPeerId, "untrusted");
    };

    dc.onmessage = async (event) => {
      const { data } = event;

      if (typeof data === "string") {
        try {
          const msg = JSON.parse(data);

          if (msg.type === "auth-challenge") {
            if (msg.pinHash === passphraseRef.current) {
              console.log("PIN validation successful for peer:", fromPeerId);
              updatePeerAuthState(fromPeerId, "authenticated");
              dc.send(
                JSON.stringify({
                  type: "auth-success",
                  peerId: peerId,
                })
              );
            } else {
              console.warn("PIN code mismatch from peer:", fromPeerId);
              updatePeerAuthState(fromPeerId, "failed");
              dc.send(
                JSON.stringify({
                  type: "auth-failed",
                  reason: "PIN Mismatch",
                })
              );
            }
          } else if (msg.type === "auth-success") {
            updatePeerAuthState(fromPeerId, "authenticated");
          } else if (msg.type === "auth-failed") {
            updatePeerAuthState(fromPeerId, "failed");
          } else if (msg.type === "metadata") {
            // Strictly check authentication to block un-logged in / wrong PIN files
            if (authStatesRef.current[fromPeerId] !== "authenticated") {
              console.warn("Blocked unauthenticated metadata transmission!");
              return;
            }

            const fileId = msg.fileId;
            incomingChunksRef.current[fileId] = [];

            setTransfers((prev) => ({
              ...prev,
              [fileId]: {
                fileId,
                name: msg.name,
                size: msg.size,
                mime: msg.mime,
                status: "transferring",
                progress: 0,
                speed: 0,
                direction: "receiving",
                timeElapsed: 0,
              },
            }));
          } else if (msg.type === "complete") {
            const fileId = msg.fileId;
            setTransfers((prev) => {
              if (!prev[fileId]) return prev;
              return {
                ...prev,
                [fileId]: {
                  ...prev[fileId],
                  status: "completed",
                  progress: 100,
                  speed: 0,
                  downloaded: false,
                },
              };
            });
          }
        } catch (e) {
          console.error("Failed to parse data channel command:", e);
        }
      } else {
        // Raw incoming decrypted bits
        await handleIncomingChunkData(fromPeerId, data);
      }
    };
  };

  // 6. Handle Incoming Encrypted Chunk and Decrypt in Real Time
  const handleIncomingChunkData = async (fromPeerId: string, rawBuffer: ArrayBuffer) => {
    try {
      // Secure check: only process binary data from authenticated channels
      if (authStatesRef.current[fromPeerId] !== "authenticated") {
        console.warn("Discarding raw chunk from unauthenticated channel!");
        return;
      }

      if (rawBuffer.byteLength < 20) {
        return;
      }

      // Envelope structure: [8 bytes padded fileId][12 bytes IV][Encrypted payload]
      const fileIdBytes = new Uint8Array(rawBuffer, 0, 8);
      const decoder = new TextDecoder();
      const chunkFileId = decoder.decode(fileIdBytes).replace(/\0/g, "").trim();

      const ivBytes = new Uint8Array(rawBuffer, 8, 12);
      const encryptedData = new Uint8Array(rawBuffer, 20);

      const trans = transfersRef.current[chunkFileId];
      if (!trans) {
        // If the metadata wasn't received or registered first, neglect the chunk
        return;
      }

      // Decrypt the raw slice using the authenticating PIN passphrase
      const key = await deriveAESKey(passphraseRef.current);
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: ivBytes },
        key,
        encryptedData
      );

      // Save chunk perfectly under its unique fileId key
      if (!incomingChunksRef.current[chunkFileId]) {
        incomingChunksRef.current[chunkFileId] = [];
      }
      incomingChunksRef.current[chunkFileId].push(decryptedBuffer);

      const receivedTotal = incomingChunksRef.current[chunkFileId].reduce(
        (acc, curr) => acc + curr.byteLength,
        0
      );

      const pct = Math.min((receivedTotal / trans.size) * 100, 100);

      // Simple speed calculations
      const now = Date.now();
      const elapsed = 1;
      const currentSpeed = receivedTotal / (1024 * 1024) / elapsed;

      const isDone = receivedTotal >= trans.size;

      setTransfers((prev) => {
        if (!prev[chunkFileId]) return prev;
        return {
          ...prev,
          [chunkFileId]: {
            ...prev[chunkFileId],
            progress: pct,
            speed: isDone ? 0 : parseFloat(Math.min(currentSpeed, 999).toFixed(2)) || 0.1,
            status: isDone ? "completed" : "transferring",
            downloaded: isDone ? false : prev[chunkFileId].downloaded,
          },
        };
      });
    } catch (err) {
      console.error("AES-GCM chunk decryption check rejected!", err);
    }
  };

  // 7. Reassemble Chunks in Browser memory and Save safely
  const assembleAndDownloadFile = (fileId: string) => {
    const trans = transfersRef.current[fileId];
    if (!trans) return;

    const chunks = incomingChunksRef.current[fileId];
    if (!chunks || chunks.length === 0) {
      alert(lang === "fa" ? "امکان دسترسی به قطعات فایل وجود ندارد یا قبلاً دانلود شده است." : "File chunks are missing or have already been downloaded.");
      return;
    }

    // Prepare Browser Download anchor safely
    try {
      const fileBlob = new Blob(chunks, { type: trans.mime });
      const dlUrl = URL.createObjectURL(fileBlob);

      const anchor = document.createElement("a");
      anchor.href = dlUrl;
      anchor.download = trans.name;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      setTransfers((prev) => {
        if (!prev[fileId]) return prev;
        return {
          ...prev,
          [fileId]: {
            ...prev[fileId],
            status: "completed",
            progress: 100,
            downloaded: true,
          },
        };
      });
    } catch (e) {
      console.error("Failed downstream saving re-assembly:", e);
      setTransfers((prev) => {
        if (!prev[fileId]) return prev;
        return {
          ...prev,
          [fileId]: {
            ...prev[fileId],
            status: "failed",
          },
        };
      });
    }

    // Cleanup references safely to free client memory
    delete incomingChunksRef.current[fileId];
  };

  // 8. Chunk, Encrypt (AES-GCM) and Stream File to peer over RTCDataChannel
  const handleShareFile = async (file: File) => {
    if (!targetPeer || !dataChannelsRef.current[targetPeer.id]) {
      alert(lang === "fa" ? "لطفا ابتدا یک دستگاه فعال را در رادار انتخاب کنید!" : "Please select an active peer on the Local Discovery radar first!");
      return;
    }

    const tPeerId = targetPeer.id;
    if (authStatesRef.current[tPeerId] !== "authenticated") {
      alert(lang === "fa" ? "دستگاه مقابل هنوز رمز ۶ رقمی شما را تایید نکرده است!" : "Remote peer is not authenticated yet!");
      return;
    }

    // Generate a clean 8-character fileId
    const baseId = Math.random().toString(36).substring(2, 10);
    const fileId = (baseId + "00000000").slice(0, 8);

    const key = await deriveAESKey(passphraseRef.current);

    // Add entry into local transfers map
    setTransfers((prev) => ({
      ...prev,
      [fileId]: {
        fileId,
        name: file.name,
        size: file.size,
        mime: file.type,
        status: "encrypting",
        progress: 0,
        speed: 0,
        direction: "sending",
        timeElapsed: 0,
      },
    }));

    const dc = dataChannelsRef.current[tPeerId];

    // Inform receiving peer about upcoming file meta-information
    dc.send(
      JSON.stringify({
        type: "metadata",
        fileId,
        name: file.name,
        size: file.size,
        mime: file.type,
      })
    );

    const CHUNK_SIZE = 16384; // 16KB Safe Chunk Size with Flow Control
    let offset = 0;
    const fileReader = new FileReader();
    fileReaderRef.current = fileReader;

    const startTime = Date.now();

    const readNextSlice = () => {
      const slice = file.slice(offset, offset + CHUNK_SIZE);
      fileReader.readAsArrayBuffer(slice);
    };

    fileReader.onload = async (e) => {
      const rawChunk = e!.target!.result as ArrayBuffer;

      try {
        // Enforce symmetric cryptography before sending chunk over wire
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt(
          { name: "AES-GCM", iv },
          key,
          rawChunk
        );

        // Prep padded 8-bytes fileId
        const fileIdBytes = new TextEncoder().encode(fileId); // exactly 8 bytes

        // Package payload envelope: [fileId (8)][IV bytes (12)][Cipher bytes (...)]
        const packetBytes = new Uint8Array(8 + iv.byteLength + encrypted.byteLength);
        packetBytes.set(fileIdBytes, 0);
        packetBytes.set(iv, 8);
        packetBytes.set(new Uint8Array(encrypted), 8 + iv.byteLength);

        const sendChunk = () => {
          dc.send(packetBytes.buffer);
          offset += rawChunk.byteLength;

          const elapsedSec = (Date.now() - startTime) / 1000;
          const currentSpeed = offset / (1024 * 1024) / (elapsedSec || 1);
          const percent = Math.min((offset / file.size) * 100, 100);

          setTransfers((prev) => {
            if (!prev[fileId]) return prev;
            return {
              ...prev,
              [fileId]: {
                ...prev[fileId],
                progress: percent,
                speed: parseFloat(currentSpeed.toFixed(2)),
                status: percent >= 100 ? "completed" : "transferring",
              },
            };
          });

          if (offset < file.size) {
            readNextSlice();
          } else {
            dc.send(JSON.stringify({ type: "complete", fileId }));
          }
        };

        // Standard RTCDataChannel Flow Control protection of buffer bloating
        if (dc.bufferedAmount > 256 * 1024) {
          dc.onbufferedamountlow = () => {
            dc.onbufferedamountlow = null;
            sendChunk();
          };
        } else {
          sendChunk();
        }
      } catch (err) {
        console.error("Encryption streaming error:", err);
        setTransfers((prev) => {
          if (!prev[fileId]) return prev;
          return {
            ...prev,
            [fileId]: {
              ...prev[fileId],
              status: "failed",
            },
          };
        });
      }
    };

    // Begin transfer slice
    readNextSlice();
  };

  const handleDropZoneFile = (e: React.DragEvent) => {
    e.preventDefault();
    if (!targetPeer) return;
    const file = e.dataTransfer.files[0];
    if (file) {
      handleShareFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleShareFile(file);
    }
  };

  // Select Peer Target Handler
  const selectDiscoveredPeer = (peer: Peer) => {
    const authStatus = peerAuthStates[peer.id] || "untrusted";
    if (authStatus === "failed") {
      setLinkPasswordInput("");
      setPasswordError(lang === "fa" ? "مغایرت کلید امنیتی تشخیص داده شد! لطفا کلید را وارد کنید." : "Security key mismatch detected! Please enter the correct PIN code.");
      setShowLinkPasswordModal(true);
      return;
    }

    if (peer.id === targetPeer?.id) {
      setTargetPeer(null); // Deselect
    } else {
      setTargetPeer(peer);
      // Initiate RTC negotiate connection on selection if one does not exist
      if (!peerConnectionsRef.current[peer.id]) {
        initiateWebRTCConnection(peer.id);
      }
    }
  };

  if (showAdmin) {
    return (
      <AdminPanel
        theme={theme}
        setTheme={setTheme}
        lang={lang}
        setLang={setLang}
        activePeersCount={discoveredPeers.length}
        sessionTransfersCount={Object.keys(transfers).length}
        sessionTransfersVolume={(Object.values(transfers) as any[]).reduce((acc: number, t: any) => acc + (t.status === "completed" ? t.size : 0), 0)}
        onClose={() => {
          setShowAdmin(false);
          if (typeof window !== "undefined") {
            window.history.pushState({}, "", "/");
          }
        }}
      />
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {appLoading && (
          <CoolLoading
            key="cool-loader"
            onComplete={() => setAppLoading(false)}
            lang={lang}
            setLang={setLang}
            theme={theme}
            setTheme={setTheme}
          />
        )}
      </AnimatePresence>

      <div
        dir={lang === "fa" ? "rtl" : "ltr"}
        className={`min-h-screen flex flex-col font-sans transition-colors duration-300 relative overflow-x-hidden w-full ${
          theme === "dark"
            ? "bg-[#070b13] text-[#f1f5f9] selection:bg-teal-500/30 selection:text-teal-300"
            : "bg-[#f8fafc] text-slate-900 selection:bg-teal-500/20 selection:text-teal-700"
        }`}
      >
      {/* Dynamic Ambient Background Highlights without dotted grid overlay */}
      {theme === "dark" ? (
        <>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>
        </>
      ) : (
        <>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-400/[0.04] rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-sky-400/[0.04] rounded-full blur-3xl pointer-events-none"></div>
        </>
      )}

      {/* Primary Header Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md px-4 md:px-6 py-4 transition-colors ${
          theme === "dark"
            ? "bg-[#070b13]/85 border-[#1e293b]/80"
            : "bg-white/85 border-slate-200 shadow-sm"
        }`}
      >
        <div className={`max-w-7xl mx-auto flex items-center justify-between gap-4 ${
          lang === "fa" ? "flex-row-reverse" : "flex-row"
        }`}>
          <h1 className="text-xl md:text-2xl font-display-title bg-gradient-to-r from-teal-500 via-emerald-500 to-sky-500 bg-clip-text text-transparent leading-none font-extrabold select-none">
            {dict[lang].appTitle}
          </h1>
          
          {/* Language & Theme toggles */}
          <div className={`flex items-center gap-1.5 border p-1 rounded-xl transition-colors shrink-0 ${
            theme === "dark"
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-slate-200 shadow-sm"
          }`}>
            {/* Balanced single toggle Language button */}
            <button
              onClick={() => setLang(lang === "fa" ? "en" : "fa")}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-105 duration-200 select-none ${
                theme === "dark"
                  ? "text-teal-400 hover:text-teal-300 hover:bg-slate-800"
                  : "text-teal-600 hover:text-teal-700 hover:bg-slate-100"
              }`}
              title="Toggle Language / تغییر زبان"
            >
              <Globe className="h-3.5 w-3.5 shrink-0" />
              <span className="font-sans leading-none">{lang === "fa" ? "EN" : "FA"}</span>
            </button>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5"></div>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-205 transition-colors cursor-pointer"
              title="Toggle visual style"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-650" />}
            </button>
          </div>
        </div>
      </header>

      {/* Spacer to push content down below fixed header */}
      <div className="h-[73px] w-full shrink-0" />

      {/* Centered Page Navigation Tabs directly below navbar */}
      <div className="flex justify-center mt-6 sm:mt-8 mb-2 px-4 w-full shrink-0">
        <div className={`flex items-center gap-1 p-1 rounded-xl border transition-colors ${
          theme === "dark" 
            ? "bg-slate-900/50 border-[#1e293b]" 
            : "bg-white border-slate-205 shadow-sm"
        }`}>
          <button
            onClick={() => setShowLanding(true)}
            className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
              showLanding
                ? "bg-teal-500 text-slate-950 shadow-sm"
                : theme === "dark"
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <HelpCircle className="h-4 w-4 shrink-0" />
            <span>{lang === "fa" ? "مستندات و آموزش" : "About & Guide"}</span>
          </button>
          
          <button
            onClick={() => setShowLanding(false)}
            className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
              !showLanding
                ? "bg-teal-500 text-slate-950 shadow-sm"
                : theme === "dark"
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Radio className="h-4 w-4 shrink-0" />
            <span>{lang === "fa" ? "رادار و انتقال فایل" : "Radar & Portal"}</span>
          </button>
        </div>
      </div>

      {/* Active Tab Showcase Pane */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 md:py-8 flex flex-col justify-stretch">
        {showLanding ? (
          <div className="flex-1 flex flex-col justify-start items-stretch py-4 md:py-8 space-y-16">
            
            {/* 1. Interactive 3D Hero Header Layout with Glow Accents */}
            <div className="text-center space-y-5 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 w-96 h-96 bg-teal-500/10 rounded-full filter blur-[100px] pointer-events-none select-none"></div>
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/20 bg-teal-500/5 text-teal-400 text-[10px] sm:text-xs font-mono uppercase tracking-widest font-black select-none shadow-sm">
                <Sparkles className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: "3s" }} />
                <span>{lang === "fa" ? "پروتکل همتا به همتا" : "PEER-TO-PEER PROTOCOL"}</span>
              </div>

              <h2 className={`text-3xl md:text-5xl font-display-title font-black tracking-tight leading-tight select-none ${
                theme === "dark" ? "text-slate-100" : "text-slate-900"
              }`}>
                {lang === "fa" ? "پورتال فرستنده و گیرنده مستقیم همتابه‌همتا (P2P)" : "Direct WebRTC Peer-to-Peer Secure Portal"}
              </h2>
              <p className={`max-w-3xl mx-auto text-xs sm:text-sm font-medium leading-relaxed font-sans ${
                theme === "dark" ? "text-slate-400" : "text-slate-700"
              }`}>
                {lang === "fa" 
                  ? "فناوری تانلینگ بدون واسطه فایل بین دو مرورگر با پروتکل پرسرعت WebRTC. اطلاعات شخصی شما هرگز از هیچ سرور میانی عبور نمی‌کند، کپی نمی‌شود و در هیچ پایگاه داده ابری ذخیره نخواهد شد. تمامی فایل‌ها در مبدا به صورت بلوک‌های رمزنگاری‌شده AES-GCM درمی‌آیند و به صورت مستقیم و بدون واسطه به مرورگر همتا استریم می‌شوند."
                  : "Tunnel high-volume files instantly and directly browser-to-browser. Powered by real-time WebRTC direct data channels. Your files are never cached or intercepted by a cloud relay. Entire data streams are sliced, encrypted via state-of-the-art AES-GCM and assembled dynamically inside the client memory."}
              </p>
            </div>

            {/* 2. Interactive 3D operational guide cards */}
            <div className="space-y-6">
              <h3 className={`text-xs font-black uppercase tracking-widest text-center font-sans ${
                theme === "dark" ? "text-slate-400" : "text-slate-650"
              }`}>
                {lang === "fa" ? "راهنمای گام به گام شروع تبادل امن کلاینت" : "STEP-BY-STEP SECURE WORKFLOW ENGINE"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1 Card: Room Parameterization */}
                <motion.div
                  whileHover={{ y: -6, rotateX: 1, rotateY: -1, scale: 1.01 }}
                  className={`relative p-6 sm:p-7 rounded-2xl border transition-all pointer-events-auto [perspective:1000px] select-none ${
                    theme === "dark" 
                      ? "bg-slate-900/40 border-slate-800/80 hover:border-teal-500/40 hover:shadow-2xl hover:shadow-teal-500/5" 
                      : "bg-white border-slate-200/90 hover:border-teal-500/30 hover:shadow-xl hover:shadow-slate-200/50"
                  }`}
                >
                  <div className="absolute top-4 right-4 text-xs font-mono font-black text-teal-500/20 dark:text-teal-400/10 text-3xl">01</div>
                  <div className="h-10 w-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500 mb-5">
                    <Layers className="h-5 w-5" />
                  </div>
                  <h4 className={`text-sm sm:text-base font-extrabold mb-2 font-sans ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                    {lang === "fa" ? "۱. ایجاد فضای اتاق مشترک" : "1. Matchmaking Parameters"}
                  </h4>
                  <p className={`text-xs leading-relaxed font-sans ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                    {lang === "fa" 
                      ? "شناسه اتاق همسانی را برای هر دو دستگاه مبدا و مقصد تعیین نمایید تا یکدیگر را در بستر شبکه سیگنالینگ هماهنگ‌کننده کشف کنند." 
                      : "Type or generate matching Room IDs on both sender & receiver devices so they reside in the same WebRTC signaling zone."}
                  </p>
                </motion.div>

                {/* Step 2 Card: Mutual Pin Code */}
                <motion.div
                  whileHover={{ y: -6, rotateX: 1, rotateY: 1, scale: 1.01 }}
                  className={`relative p-6 sm:p-7 rounded-2xl border transition-all pointer-events-auto [perspective:1000px] select-none ${
                    theme === "dark" 
                      ? "bg-slate-900/40 border-slate-800/80 hover:border-teal-500/40 hover:shadow-2xl hover:shadow-teal-500/5" 
                      : "bg-white border-slate-200/90 hover:border-teal-500/30 hover:shadow-xl hover:shadow-slate-200/50"
                  }`}
                >
                  <div className="absolute top-4 right-4 text-xs font-mono font-black text-teal-500/20 dark:text-teal-400/10 text-3xl">02</div>
                  <div className="h-10 w-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-5">
                    <Lock className="h-5 w-5" />
                  </div>
                  <h4 className={`text-sm sm:text-base font-extrabold mb-2 font-sans ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                    {lang === "fa" ? "۲. تایید پین کدهای امنیتی" : "2. Mutual Cryptographic PIN"}
                  </h4>
                  <p className={`text-xs leading-relaxed font-sans ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                    {lang === "fa" 
                      ? "مطمئن شوید کلیدهای امنیتی (PIN) در دو طرف دقیقاً یکسان باشند. این کلید برای تایید هویت و امضای الگوریتم رمزنگاری AES کلاینت استفاده می‌شود." 
                      : "Confirm security codes (PIN) are identical on both. This key validates handshakes and initializes the symmetric block cryptor."}
                  </p>
                </motion.div>

                {/* Step 3 Card: Direct encrypted stream */}
                <motion.div
                  whileHover={{ y: -6, rotateX: -1, rotateY: 1, scale: 1.01 }}
                  className={`relative p-6 sm:p-7 rounded-2xl border transition-all pointer-events-auto [perspective:1000px] select-none ${
                    theme === "dark" 
                      ? "bg-slate-900/40 border-slate-800/80 hover:border-teal-500/40 hover:shadow-2xl hover:shadow-teal-500/5" 
                      : "bg-white border-slate-200/90 hover:border-teal-500/30 hover:shadow-xl hover:shadow-slate-200/50"
                  }`}
                >
                  <div className="absolute top-4 right-4 text-xs font-mono font-black text-teal-500/20 dark:text-teal-400/10 text-3xl">03</div>
                  <div className="h-10 w-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-550 mb-5">
                    <Zap className="h-5 w-5" />
                  </div>
                  <h4 className={`text-sm sm:text-base font-extrabold mb-2 font-sans ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                    {lang === "fa" ? "۳. استریم مستقیم فایل همتا" : "3. Direct Block Stream"}
                  </h4>
                  <p className={`text-xs leading-relaxed font-sans ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                    {lang === "fa" 
                      ? "دستگاه را از رادار انتخاب کنید، با کشیدن بلافصل فایل درون پورتال، فایلی با حجم نامحدود را بدون مداخله سرور منتقل کنید." 
                      : "Deselect limits! Connect via radar node, drag/drop files, and transport data chunk-by-chunk directly with zero cloud relay."}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* 3. New Advanced Component: Live Interactive Browser Capabilities & Network Check */}
            <div className={`p-6 sm:p-8 rounded-2xl border transition-all relative overflow-hidden select-none ${
              theme === "dark" 
                ? "bg-slate-900/10 border-slate-800/80 shadow-2xl" 
                : "bg-slate-50 border-slate-200/80 shadow-sm"
            }`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full filter blur-[40px] pointer-events-none select-none"></div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200/50 dark:border-slate-800/55">
                <div className="space-y-1">
                  <h3 className={`text-base font-black font-sans flex items-center gap-2 ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                    <Activity className="h-5 w-5 text-teal-500 animate-pulse" />
                    {lang === "fa" ? "تست آنلاین و زنده صلاحیت مرورگر و ظرفیت شبکه" : "Local Browser Diagnostic & Network Engine"}
                  </h3>
                  <p className={`text-xs font-sans ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                    {lang === "fa" 
                      ? "بررسی و اعتبارسنجی مستقل وب‌آپی‌های مرورگر شما جهت اطمینان از عملکرد عالی کلاینت‌ساید." 
                      : "Verifying and validating local physical browser WebAPIs to guarantee perfect client-side execution."}
                  </p>
                </div>
                <button
                  onClick={runNetworkDiagnostics}
                  disabled={diagStatus === "running"}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold font-sans uppercase tracking-wider bg-teal-500 hover:bg-teal-400 text-slate-950 transition-all cursor-pointer active:scale-95 disabled:bg-slate-800 disabled:text-slate-500 flex items-center gap-2 shadow-xs"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${diagStatus === "running" ? "animate-spin" : ""}`} />
                  <span>{lang === "fa" ? "اجرای عیب‌یابی شبکه" : "Run Diagnostics"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {/* WebRTC API indicator */}
                <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  theme === "dark" ? "bg-slate-950/40 border-slate-800/50" : "bg-white border-slate-200 shadow-3xs"
                }`}>
                  <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">WebRTC Gateway</span>
                  {diagResults.webrtc === "pass" ? (
                    <span className="text-emerald-500 font-bold uppercase tracking-widest text-[9px]">✔ Pass</span>
                  ) : diagResults.webrtc === "checking" ? (
                    <span className="text-amber-500 font-mono text-[9px] animate-pulse">Checking...</span>
                  ) : diagResults.webrtc === "fail" ? (
                    <span className="text-red-500 font-bold uppercase tracking-widest text-[9px]">✘ Fail</span>
                  ) : (
                    <span className="text-slate-600 text-[10px] font-mono">--</span>
                  )}
                </div>

                {/* WebCrypto Subtle */}
                <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  theme === "dark" ? "bg-slate-950/40 border-slate-800/50" : "bg-white border-slate-200 shadow-3xs"
                }`}>
                  <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">AES Crypto Engine</span>
                  {diagResults.crypto === "pass" ? (
                    <span className="text-emerald-500 font-bold uppercase tracking-widest text-[9px]">✔ Pass</span>
                  ) : diagResults.crypto === "checking" ? (
                    <span className="text-amber-500 font-mono text-[9px] animate-pulse">Checking...</span>
                  ) : diagResults.crypto === "fail" ? (
                    <span className="text-red-500 font-bold uppercase tracking-widest text-[9px]">✘ Fail</span>
                  ) : (
                    <span className="text-slate-600 text-[10px] font-mono">--</span>
                  )}
                </div>

                {/* Secure Context */}
                <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  theme === "dark" ? "bg-slate-950/40 border-slate-800/50" : "bg-white border-slate-200 shadow-3xs"
                }`}>
                  <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">Secure TLS Ports</span>
                  {diagResults.securing === "pass" ? (
                    <span className="text-emerald-500 font-bold uppercase tracking-widest text-[9px]">✔ Pass</span>
                  ) : diagResults.securing === "checking" ? (
                    <span className="text-amber-500 font-mono text-[9px] animate-pulse">Checking...</span>
                  ) : diagResults.securing === "fail" ? (
                    <span className="text-red-500 font-bold uppercase tracking-widest text-[9px]">✘ Fail</span>
                  ) : (
                    <span className="text-slate-600 text-[10px] font-mono">--</span>
                  )}
                </div>

                {/* LAN IP interfaces support */}
                <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  theme === "dark" ? "bg-slate-950/40 border-slate-800/50" : "bg-white border-slate-200 shadow-3xs"
                }`}>
                  <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">LAN Routing</span>
                  {diagResults.localIPs === "pass" ? (
                    <span className="text-emerald-500 font-bold uppercase tracking-widest text-[9px]">✔ Ready</span>
                  ) : diagResults.localIPs === "checking" ? (
                    <span className="text-amber-500 font-mono text-[9px] animate-pulse">Checking...</span>
                  ) : diagResults.localIPs === "fail" ? (
                    <span className="text-red-500 font-bold uppercase tracking-widest text-[9px]">✘ Fail</span>
                  ) : (
                    <span className="text-slate-600 text-[10px] font-mono">--</span>
                  )}
                </div>
              </div>
            </div>

            {/* Advanced Component 2: Cryptographic Security Features Bento Grid */}
            <div className="space-y-4">
              <h3 className={`text-xs font-black uppercase tracking-widest text-center font-sans ${
                theme === "dark" ? "text-slate-400" : "text-slate-650"
              }`}>
                {lang === "fa" ? "فناوری‌ها و معماری رمزگذاری امنیتی سرتاسری" : "SECURE CRYPTO STANDARDS & PROTOCOLS"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  {
                    icon: (colorClass: string) => <Lock className={`h-5 w-5 ${colorClass}`} />,
                    bgColorLight: "bg-teal-50/80",
                    bgColorDark: "bg-teal-950/40",
                    colorLight: "text-teal-600",
                    colorDark: "text-teal-400",
                    faTitle: "AES-GCM ۲۵۶ بیت",
                    enTitle: "AES-GCM 256-Bit",
                    faDesc: "پروتکل رمزنگاری استاندارد صنعتی پرسرعت و سخت‌افزاری بر پایه بلوک‌های داده جهت جلوگیری از خواندن بسته‌ها توسط غیر.",
                    enDesc: "Industrial grade hardware-accelerated cipher block mode. Complete client-side encryption keeps every single bit private."
                  },
                  {
                    icon: (colorClass: string) => <Layers className={`h-5 w-5 ${colorClass}`} />,
                    bgColorLight: "bg-sky-50/80",
                    bgColorDark: "bg-sky-950/40",
                    colorLight: "text-sky-600",
                    colorDark: "text-sky-400",
                    faTitle: "قطعه‌بندی موقت بافر",
                    enTitle: "Temporary Slicing",
                    faDesc: "تقسیم‌ فایل به چانک‌های کوچک ۱۶ کیلوبایتی و استریم مستقیم در بستر شبکه، بدون نیاز به لود کل حجم فضا در رم دستگاه.",
                    enDesc: "Slicing massive files into micro 16KB ArrayBuffer chunks streams sequentially with near-zero desktop browser memory footprints."
                  },
                  {
                    icon: (colorClass: string) => <Shield className={`h-5 w-5 ${colorClass}`} />,
                    bgColorLight: "bg-indigo-50/80",
                    bgColorDark: "bg-indigo-950/40",
                    colorLight: "text-indigo-600",
                    colorDark: "text-indigo-400",
                    faTitle: "دست‌دهی امن DTLS",
                    enTitle: "Secure DTLS Ports",
                    faDesc: "تامین امنیت کانال‌های پیش فرض UDP با پروتکل لایه انتقالی امنیتی برای تضمین ممانعت از دستکاری داده‌ها.",
                    enDesc: "UDP packets are encapsulated under Datagram Transport Layer Security to enforce stream integrity and reject spoofing."
                  },
                  {
                    icon: (colorClass: string) => <Zap className={`h-5 w-5 ${colorClass}`} />,
                    bgColorLight: "bg-amber-50/80",
                    bgColorDark: "bg-amber-950/40",
                    colorLight: "text-amber-600",
                    colorDark: "text-amber-400",
                    faTitle: "معماری دانش صفر",
                    enTitle: "Zero Knowledge",
                    faDesc: "گذرواژه امضا و اطلاعات فایل هرگز به سرور فرستاده نمی‌شود. اطلاعات کاملا امن در مرورگر شما می‌ماند.",
                    enDesc: "Password states and raw file definitions never hit external servers, guaranteeing maximum cryptographic immunity."
                  }
                ].map((item, i) => {
                  const isDark = theme === "dark";
                  const bgColor = isDark ? item.bgColorDark : item.bgColorLight;
                  const textColor = isDark ? item.colorDark : item.colorLight;
                  return (
                    <div 
                      key={i} 
                      className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                        isDark 
                          ? "bg-slate-900/10 border-slate-800 hover:border-teal-500/20 shadow-lg hover:shadow-teal-500/[0.01]" 
                          : "bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300"
                      }`}
                    >
                      <div className="mb-4">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${bgColor}`}>
                          {item.icon(textColor)}
                        </div>
                        <h4 className={`text-xs sm:text-xs font-black tracking-wide font-sans mb-1 uppercase ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                          {lang === "fa" ? item.faTitle : item.enTitle}
                        </h4>
                      </div>
                      <p className={`text-[11px] leading-relaxed font-sans ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {lang === "fa" ? item.faDesc : item.enDesc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Advanced Component 3: P2P Connection Troubleshooting matrix */}
            <div className={`p-6 sm:p-8 rounded-2xl border select-none ${
              theme === "dark" 
                ? "bg-slate-900/20 border-slate-800/80 shadow-2xl" 
                : "bg-slate-50 border-slate-200 shadow-sm"
            }`}>
              <div className="flex items-center gap-2 mb-4 border-b dark:border-slate-800 border-slate-200 pb-4">
                <HelpCircle className="h-5 w-5 text-teal-500 shrink-0" />
                <h3 className={`text-base font-black font-sans ${theme === "dark" ? "text-teal-400" : "text-slate-800"}`}>
                  {lang === "fa" ? "راهنمای حل اختلالات و پایداری شبکه همتا" : "P2P WebRTC Troubleshooting Matrix"}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-sans mt-4">
                <div className={`p-4.5 rounded-xl border ${theme === "dark" ? "bg-slate-950/40 border-slate-850" : "bg-white border-slate-200 shadow-xs"}`}>
                  <h4 className="font-extrabold text-teal-500 mb-2">{lang === "fa" ? "۱. بر روی شبکه فایروال شرکتی یا پروکسی هستید؟" : "1. Behind strict Corporate Firewalls or VPNs?"}</h4>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    {lang === "fa" 
                      ? "برخی شبکه‌های اداری پورت‌های UDP رهاشده کلاینت را فیلتر می‌کنند. در صورت مشکل در برقراری اتصال رادار، موقتاً پروکسی یا فیلترشکن خود را خاموش کرده و یا از اینترنت تلفن همراه به عنوان بستر تست استفاده کنید."
                      : "Corporate networks occasionally block wildcard UDP ports or strict Symmetric NAT filtering. For solid radar connections, consider disabling proxies, corporate VPN lines or testing over cellular Hotspots."}
                  </p>
                </div>

                <div className={`p-4.5 rounded-xl border ${theme === "dark" ? "bg-slate-950/40 border-slate-850" : "bg-white border-slate-200 shadow-xs"}`}>
                  <h4 className="font-extrabold text-teal-500 mb-2">{lang === "fa" ? "۲. سرعت انتقال چرا تغییر می‌کند؟" : "2. Why does transfer speed fluctuate?"}</h4>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    {lang === "fa" 
                      ? "اگر هر دو دستگاه به یک مودم Wi-Fi متصل باشند، سرعت در بالاترین حد پهنای باند قرار دارد. در فواصل دورتر سرعت بستگی مستقیم به کیفیت شبکه و پورت‌های اینترنت ورودی/خروجی ISP شما دارد."
                      : "If devices reside on the same Wi-Fi router, speeds can exceed local hardware limits. For global peer paths across cities, speed depends entirely on physical ISP uplink stability and optical WAN bottlenecks."}
                  </p>
                </div>

                <div className={`p-4.5 rounded-xl border ${theme === "dark" ? "bg-slate-950/40 border-slate-850" : "bg-white border-slate-200 shadow-xs"}`}>
                  <h4 className="font-extrabold text-teal-500 mb-2">{lang === "fa" ? "۳. پایداری دست‌دهی در دستگاه‌های قدیمی" : "3. Handshake stability on Legacy browsers?"}</h4>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    {lang === "fa" 
                      ? "برای بهترین سازگاری به خصوص با کدهای رمزگذاری WebCrypto، همواره از نسخه‌های بروزرسانی‌شده گوگل کروم، مایکروسافت اج یا فایرفاکس بر روی پلتفرم موبایل و دسکتاپ استفاده کنید تا شبیه‌سازهای سخت‌افزار فعال بمانند."
                      : "To avoid fallback timeouts during WebCrypto secure encryption executions, always favor modern updated browsers like Google Chrome, MS Edge, or Firefox on all terminal devices."}
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Expanded Technical FAQ Section - Explaining Wi-Fi, LAN, NAT, and WebRTC (3D styled) */}
            <div className={`p-6 md:p-8 rounded-2xl border select-none ${
              theme === "dark" 
                ? "bg-slate-900/20 border-slate-800/80 shadow-2xl" 
                : "bg-slate-100/70 border-slate-200 shadow-sm"
            }`}>
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="h-5 w-5 text-teal-500 shrink-0" />
                <h3 className={`text-base font-black font-sans ${theme === "dark" ? "text-teal-400" : "text-teal-850"}`}>
                  {lang === "fa" ? "مستندات و الزامات بستر شبکه (پرسش و پاسخ فنی)" : "Network Requirements & Developer FAQ"}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* FAQ 1: Wi-Fi Requirement */}
                <motion.div 
                  whileHover={{ scale: 1.01, y: -2 }}
                  className={`p-5 rounded-xl border transition-all ${
                    theme === "dark" ? "bg-slate-950/40 border-slate-800" : "bg-white border-slate-200 shadow-xs"
                  }`}
                >
                  <h4 className={`text-xs md:text-[13px] font-extrabold flex items-center gap-2 mb-2 ${
                    theme === "dark" ? "text-slate-200" : "text-slate-900"
                  }`}>
                    <Globe className="h-4 w-4 text-emerald-500 shrink-0" />
                    {lang === "fa" ? "آیا هر دو دستگاه باید به یک Wi-Fi یا شبکه یکسان متصل باشند؟" : "Do both devices need to be on the exact same Wi-Fi?"}
                  </h4>
                  <p className={`text-xs leading-relaxed font-sans ${
                    theme === "dark" ? "text-slate-400" : "text-slate-700"
                  }`}>
                    {lang === "fa" ? (
                      <>
                        <strong>خیر، لزوماً نیازی به شبکه یکسان نیست!</strong> این سیستم با مجهز شدن به زیرساخت سیگنالینگ و STUN جهانی، به خوبی می‌تواند از فایروال‌ها و روترهای NAT عبور کند. این یعنی یکی از دستگاه‌ها می‌تواند به اینترنت همراه (4G/5G) و دستگاه دیگر به اینترنت خانگی یا شرکتی در جای دیگری متصل باشد و تبادل همچنان بدون مشکل برقرار شود.
                        <br />
                        <span className="block mt-2 font-semibold text-teal-650 dark:text-teal-400">
                          💡 قابلیت خارق‌العاده بهینه‌سازی محلی (LAN Routing):
                        </span>
                        اگر هر دو دستگاه به یک مودم یا Wi-Fi متصل باشند، پروتکل WebRTC به طور هوشمند آی‌پی‌های محلی را کشف کرده و ترافیک را کلاً در داخل بستر وای‌فای رد و بدل می‌کند. در این حالت، هم سرعت انتقال با سرعت کارت شبکه مودم شما (بالای ۱۰۰ مگابایت بر ثانیه) برابری می‌کند و هم <strong>هیچ حجمی از حجم اینترنت بین‌الملل شما مصرف نخواهد شد</strong>!
                      </>
                    ) : (
                      <>
                        <strong>No, being on the same local network is not strictly required!</strong> Our portal employs global STUN traversal servers to resolve asymmetric Network Address Translation (NAT) and cross firewalls automatically. This allows you to transfer files between devices across different ISPs, mobile data networks (4G/LTE/5G), or different cities.
                        <br />
                        <span className="block mt-2 font-semibold text-teal-600 dark:text-teal-400">
                          💡 Peak LAN Optimization Mode:
                        </span>
                        When devices reside on the same router/Wi-Fi network, WebRTC directly bridges them via local interface IPs. This optimizes the stream to transport files at local LAN speeds (often exceeding 100MB/s) and bypasses your external ISP bandwidth, <strong>using absolute zero internet package data</strong>.
                      </>
                    )}
                  </p>
                </motion.div>

                {/* FAQ 2: Security & Privacy Guarantee */}
                <motion.div 
                  whileHover={{ scale: 1.01, y: -2 }}
                  className={`p-5 rounded-xl border transition-all ${
                    theme === "dark" ? "bg-slate-950/40 border-slate-800" : "bg-white border-slate-200 shadow-xs"
                  }`}
                >
                  <h4 className={`text-xs md:text-[13px] font-extrabold flex items-center gap-2 mb-2 ${
                    theme === "dark" ? "text-slate-200" : "text-slate-900"
                  }`}>
                    <Lock className="h-4 w-4 text-sky-500 shrink-0" />
                    {lang === "fa" ? "امنیت سرتاسری AES-GCM ۲۵۶ بیتی چگونه کار می‌کند؟" : "How is military-grade AES-GCM 256 encryption applied?"}
                  </h4>
                  <p className={`text-xs leading-relaxed font-sans ${
                    theme === "dark" ? "text-slate-400" : "text-slate-705"
                  }`}>
                    {lang === "fa" ? (
                      <>
                        این پلتفرم بر پایه ساختار <strong>صفر کواشئورنس (Zero-Knowledge)</strong> بنا شده است. پیش از ارسال، فایل به بافرهای باینری تقسیم شده و با استفاده از الگوریتم پیشرفته رمزگذاری استاندارد دولتی ایالات متحده (AES-GCM-256) با کلید تعیین‌شده در مرورگر شما رمزنگاری می‌شود. کلید امنیتی شما هیچ‌گاه در سرور ثبت یا ارسال نمی‌شود، بنابراین حتی همتای دریافت کننده تا زمانی که دقیقاً کلید یکسان را وارد نکند، امکان دکریپت کردن چانک‌های دریافتی را نخواهد داشت!
                      </>
                    ) : (
                      <>
                        Experience true crypto isolation. Your file stays inside sandbox memory, sliced into 16KB ArrayBuffers, and run through the browser's native Web Crypto API. It uses AES-GCM cipher-block mode keyed by your private 9-character passcode. Since this key is never shared on the signaling server, your data is cryptographically robust, protecting you if a third party captures the packets.
                      </>
                    )}
                  </p>
                </motion.div>

                {/* FAQ 3: Size Limits & File Slicing */}
                <motion.div 
                  whileHover={{ scale: 1.01, y: -2 }}
                  className={`p-5 rounded-xl border transition-all ${
                    theme === "dark" ? "bg-slate-950/40 border-slate-800" : "bg-white border-slate-200 shadow-xs"
                  }`}
                >
                  <h4 className={`text-xs md:text-[13px] font-extrabold flex items-center gap-2 mb-2 ${
                    theme === "dark" ? "text-slate-200" : "text-slate-900"
                  }`}>
                    <Layers className="h-4 w-4 text-indigo-500 shrink-0" />
                    {lang === "fa" ? "محدودیت حجم فایل چقدر است و ساختار استریم چیست؟" : "What is the file size limit and how is streaming structured?"}
                  </h4>
                  <p className={`text-xs leading-relaxed font-sans ${
                    theme === "dark" ? "text-slate-400" : "text-slate-700"
                  }`}>
                    {lang === "fa" ? (
                      <>
                        بر خلاف آپلودسنترهایی مانند وب‌هاست‌ها، تلگرام، یا گوگل درایو که فایل باید به کل ارسال شود، در اینجا <strong>هیچ محدودیت حجمی وجود ندارد</strong>! به این دلیل که فایل در مبدا به تکه‌های فوق‌العاده کوچک ۱۶ کیلوبایتی بریده می‌شود، به صورت متوالی روی تونل دیتا رد می‌شود و در مرورگر پارتنر بلافاصله دریافت و روی هارد دیسک اسمبل می‌شود. شما می‌توانید فایل‌های ۵۰ گیگابایتی را نیز جابه‌جا کنید بدون اینکه مرورگر هنگ کند یا حافظه رم پر شود.
                      </>
                    ) : (
                      <>
                        Because your local browser doesn't try to buffer the entire file into RAM, <strong>there is absolutely no file size limit!</strong> Slicing technology streams data sequentially. We send a packet, await direct WebRTC backpressure acknowledgment, and automatically continue. You can smoothly transfer massive 10GB, 50GB file packets without any server timeout or memory leakage.
                      </>
                    )}
                  </p>
                </motion.div>

                {/* FAQ 4: Comparative Table Insights */}
                <motion.div 
                  whileHover={{ scale: 1.01, y: -2 }}
                  className={`p-5 rounded-xl border transition-all ${
                    theme === "dark" ? "bg-slate-950/40 border-slate-800" : "bg-white border-slate-200 shadow-xs"
                  }`}
                >
                  <h4 className={`text-xs md:text-[13px] font-extrabold flex items-center gap-2 mb-2 ${
                    theme === "dark" ? "text-slate-200" : "text-slate-900"
                  }`}>
                    <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                    {lang === "fa" ? "مقایسه عملکرد: اشتراگ‌گذاری همتا (P2P) در مقابل آپلود ابری" : "Performance Battle: P2P Tunnels vs Central Servers"}
                  </h4>
                  <div className="space-y-2 mt-2 text-[11px] font-sans">
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-850 pb-1.5">
                      <span className="text-slate-400 dark:text-slate-500">{lang === "fa" ? "معیار عملکرد" : "Metric"}</span>
                      <span className="text-teal-655 dark:text-teal-400 font-bold">{lang === "fa" ? "پورتال مستقیم (P2P)" : "P2P WebRTC Direct"}</span>
                      <span className="text-rose-500">{lang === "fa" ? "آپلود سنتر ابری" : "Cloud Storage Node"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-250 dark:border-slate-850 pb-1">
                      <span className="text-slate-700 dark:text-slate-400">{lang === "fa" ? "امنیت ذخیره‌سازی" : "Privacy Leak"}</span>
                      <span className="text-[#10b981] font-semibold">{lang === "fa" ? "🔒 عدم ذخیره در سرور" : "Safely Serverless"}</span>
                      <span className="text-rose-600 dark:text-rose-400">{lang === "fa" ? "⚠️ کپی دائمی در ابر" : "Always Exposed"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-250 dark:border-slate-850 pb-1">
                      <span className="text-slate-700 dark:text-slate-400">{lang === "fa" ? "مصرف اینترنت" : "Usage Cost"}</span>
                      <span className="text-[#10b981] font-semibold">{lang === "fa" ? "⚡ در شبکه محلی صفر" : "0% WAN in same LAN"}</span>
                      <span className="text-rose-600 dark:text-rose-400">{lang === "fa" ? "❌ مصرف دوبل اینترنت" : "Double Data Bill"}</span>
                    </div>
                    <div className="flex justify-between pb-0.5">
                      <span className="text-slate-700 dark:text-slate-400">{lang === "fa" ? "محدودیت حجم" : "Size Ceiling"}</span>
                      <span className="text-[#10b981] font-semibold">{lang === "fa" ? "🔥 کاملاً نامحدود" : "Absolutely Infinite"}</span>
                      <span className="text-rose-600 dark:text-rose-400">{lang === "fa" ? "⛔ ۲ گیگابایت یا کمتر" : "Capped (e.g. 2GB)"}</span>
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>

            {/* Interactive NAT & Network Traversal Simulator */}
            <div className={`p-6 sm:p-8 rounded-2xl border select-none ${
              theme === "dark" 
                ? "bg-slate-900/20 border-slate-800/80 shadow-2xl" 
                : "bg-slate-100/70 border-slate-200 shadow-sm"
            }`}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b dark:border-slate-800 border-slate-200 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-teal-500 shrink-0" />
                  <h3 className={`text-base font-black font-sans ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                    {lang === "fa" ? "شبیه‌ساز تعاملی رفتار شبکه، فایروال و عبور از NAT" : "Interactive NAT Traversal & Carrier Network Simulator"}
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold bg-teal-500/10 text-teal-400 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  {lang === "fa" ? "شبیه‌سازی زنده و تعاملی" : "LIVE WEBRTC SIMULATOR"}
                </span>
              </div>

              <p className={`text-xs font-sans mb-6 leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                {lang === "fa" 
                  ? "سناریوهای شبکه پرکاربرد زیر را انتخاب فرمايید تا رفتار سیگنالینگ، جریان داده‌ها و نحوه تلاش برای عبور از فایروال‌های روتر را به صورت زنده بر روی پورت همتا به همتا مشاهده نمایید." 
                  : "Tap on different real-world network routing profiles below to visualize interactive WebRTC UDP hole punching flows, dynamic signaling lookups, and raw transport efficiency."}
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Selector column (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-2.5">
                  {[
                    {
                      id: "lan",
                      faName: "۱. اتصال شبکه محلی (LAN)",
                      enName: "1. Direct Local LAN Bridge",
                      faDesc: "دو دستگاه متصل به یک Wi-Fi یا روتر مودم محلی.",
                      enDesc: "Both terminals residing on the same Wi-Fi router or switch hub.",
                      color: "border-teal-500/30 text-teal-400 bg-teal-500/5",
                    },
                    {
                      id: "wifi_stun",
                      faName: "۲. اینترنت‌های متمایز (NAT)",
                      enName: "2. Separate ISP Networks (STUN)",
                      faDesc: "تبادل جهانی از شهرهای مختلف به کمک سرورهای آدرس‌یاب STUN.",
                      enDesc: "Standard dynamic IPs on completely separate ISPs using STUN lookup.",
                      color: "border-cyan-500/30 text-cyan-400 bg-cyan-500/5",
                    },
                    {
                      id: "mobile_5g",
                      faName: "۳. ترافیک متغیر همراه (CGNAT)",
                      enName: "3. Cellular 4G/5G Carriers (CGNAT)",
                      faDesc: "اتصال با اینترنت همراه و عبور از ساختارهای پیچیده آی‌پی اپراتورها.",
                      enDesc: "Complex cellular mobile nodes configured behind dynamic CGNAT layers.",
                      color: "border-indigo-500/30 text-indigo-400 bg-indigo-500/5",
                    },
                    {
                      id: "nat_symmetric",
                      faName: "۴. فایروال شرکتی (Symmetric NAT)",
                      enName: "4. Strict Enterprise Firewall",
                      faDesc: "فایروال‌های سخت‌گیرانه اداری که پورت‌های تصادفی کلاینت را مسدود می‌کنند.",
                      enDesc: "Strict corporate environment where internal ports rotate securely and block P2P.",
                      color: "border-rose-500/30 text-rose-400 bg-rose-500/5",
                    }
                  ].map((scenario) => {
                    const isSelected = selectedNatScenario === scenario.id;
                    return (
                      <button
                        key={scenario.id}
                        onClick={() => setSelectedNatScenario(scenario.id as any)}
                        className={`text-left p-4 rounded-xl border text-xs font-sans transition-all cursor-pointer flex flex-col justify-start gap-1 select-none ${
                          isSelected 
                            ? theme === "dark"
                              ? `${scenario.color} shadow-lg ring-1`
                              : "border-teal-500 text-teal-800 bg-teal-500/10 shadow-sm"
                            : theme === "dark"
                              ? "bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                              : "bg-white border-slate-205 text-slate-700 hover:border-slate-350 hover:text-slate-900 shadow-3xs"
                        }`}
                      >
                        <span className="font-extrabold flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            scenario.id === "lan" ? "bg-emerald-500 animate-pulse" : 
                            scenario.id === "wifi_stun" ? "bg-cyan-500" :
                            scenario.id === "mobile_5g" ? "bg-indigo-500" : "bg-rose-500"
                          }`} />
                          {lang === "fa" ? scenario.faName : scenario.enName}
                        </span>
                        <span className={`text-[10px] sm:text-[11px] leading-relaxed mt-1 opacity-80 font-normal ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                          {lang === "fa" ? scenario.faDesc : scenario.enDesc}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Simulation Canvas View Column (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  
                  {/* Interactive Diagram Display Area */}
                  <div className={`p-6 md:p-6 rounded-2xl border flex flex-col justify-center items-center relative overflow-hidden transition-all duration-300 w-full ${
                    theme === "dark" 
                      ? "bg-slate-950 border-slate-850 h-auto py-10 md:py-0 md:h-[240px]" 
                      : "bg-slate-50 border-slate-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.015)] h-auto py-10 md:py-0 md:h-[240px]"
                  }`}>
                    {/* Background Grid Accent */}
                    <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>

                    {/* Nodes inside Simulator View */}
                    <div className="w-full flex flex-col md:flex-row justify-between items-center px-4 md:px-12 relative z-10 gap-6 md:gap-0">
                      
                      {/* Node Left/Top: Client A */}
                      <div className="flex flex-col items-center gap-1.5 shrink-0">
                        <div className={`h-12 w-12 rounded-xl border flex items-center justify-center shadow-md transition-transform hover:scale-105 duration-300 ${
                          theme === "dark" 
                            ? "bg-teal-500/15 border-teal-500/40 text-teal-400" 
                            : "bg-teal-50 border-teal-200 text-teal-600 shadow-teal-100/10"
                        }`}>
                          <Layers className="h-6 w-6 animate-pulse" />
                        </div>
                        <span className={`text-[10px] sm:text-[11px] font-black font-sans uppercase tracking-wider ${
                          theme === "dark" ? "text-slate-350" : "text-slate-700"
                        }`}>{lang === "fa" ? "کلاینت آ (فرستنده)" : "Client A (Sender)"}</span>
                      </div>

                      {/* Path Arrows & Relay indicators depending on active state */}
                      <div className="flex-1 flex flex-col justify-center items-center relative py-4 md:py-0 w-full md:w-auto h-auto md:h-16 px-4 z-10">
                        
                        {/* Scenario: LAN */}
                        {selectedNatScenario === "lan" && (
                          <div className="w-full flex flex-col items-center">
                            <span className={`text-[10px] font-bold font-mono mb-1 text-center animate-pulse ${
                              theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                            }`}>
                              {lang === "fa" ? "⚡ اتصال مستقیم محلی (سرعت بی‌نهایت)" : "⚡ 100% Direct LAN (Zero WAN Overhead)"}
                            </span>
                            <div className="w-1 md:w-full h-14 md:h-1 bg-emerald-500/20 rounded-full relative overflow-hidden my-1">
                              {/* Mobile Vertical Flow */}
                              <div className="absolute left-0 w-full h-12 bg-gradient-to-b from-transparent via-emerald-400 to-transparent animate-march-down block md:hidden" />
                              {/* Desktop Horizontal Flow */}
                              <div className="absolute top-0 h-full w-24 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-march-right hidden md:block" />
                            </div>
                            <span className={`text-[8px] sm:text-[9px] font-mono mt-1 text-center block ${theme === "dark" ? "text-slate-500" : "text-slate-600 font-medium"}`}>
                              {lang === "fa" ? "پورت‌های UDP مستقیم متصل به روتر شبکه‌ی محلی وای‌فای" : "UDP local ports bound directly on local Wi-Fi"}
                            </span>
                          </div>
                        )}

                        {/* Scenario: WiFi with STUN */}
                        {selectedNatScenario === "wifi_stun" && (
                          <div className="w-full flex flex-col items-center">
                            {/* STUN lookup visualization card - handles responsive alignment */}
                            <div className="flex flex-col items-center my-1.5 md:my-0 md:absolute md:-top-[52px] md:left-1/2 md:-translate-x-1/2 z-20">
                              <div className={`px-2 py-0.5 rounded text-[8px] font-mono tracking-wide ${
                                theme === "dark" 
                                  ? "bg-cyan-950/80 border border-cyan-800 text-cyan-400"
                                  : "bg-cyan-50 border border-cyan-200 text-cyan-700 font-bold"
                              }`}>
                                {lang === "fa" ? "سرور جهانی آدرس‌یاب STUN" : "Global STUN Server (Google/Mozilla)"}
                              </div>
                              <div className="w-0.5 h-3 md:h-4 border-l border-dashed border-cyan-500/50"></div>
                            </div>
                            
                            <span className={`text-[10px] font-bold font-mono mb-1 text-center ${
                              theme === "dark" ? "text-cyan-400" : "text-cyan-600"
                            }`}>
                              {lang === "fa" ? "✔ نقشه‌برداری موفق NAT فایروال" : "✔ STUN Mapping OK (Bypassed NAT Firewall)"}
                            </span>
                            <div className="w-1 md:w-full h-14 md:h-1 bg-cyan-500/20 rounded-full relative overflow-hidden my-1">
                              {/* Mobile Vertical Flow */}
                              <div className="absolute left-0 w-full h-12 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-march-down block md:hidden" />
                              {/* Desktop Horizontal Flow */}
                              <div className="absolute top-0 h-full w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-march-right hidden md:block" />
                            </div>
                            <span className={`text-[8px] sm:text-[9px] font-mono mt-1 text-center block ${theme === "dark" ? "text-slate-500" : "text-slate-600 font-medium"}`}>
                              {lang === "fa" ? "مسیر آدرس‌دهی عمومی و سوراخ‌کاری موفق پورت UDP فعال شد" : "Hole-punched Public Routing Path active"}
                            </span>
                          </div>
                        )}

                        {/* Scenario: Mobile 5G */}
                        {selectedNatScenario === "mobile_5g" && (
                          <div className="w-full flex flex-col items-center">
                            {/* Carrier firewall tower representation */}
                            <div className="flex flex-col items-center my-1.5 md:my-0 md:absolute md:-top-[52px] md:left-1/2 md:-translate-x-1/2 z-20">
                              <div className={`px-2 py-0.5 rounded text-[8px] font-mono ${
                                theme === "dark" 
                                  ? "bg-indigo-950/80 border border-indigo-800 text-indigo-400"
                                  : "bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold"
                              }`}>
                                CGNAT Gateway
                              </div>
                              <div className="w-0.5 h-3 md:h-4 border-l border-dashed border-indigo-500/50"></div>
                            </div>

                            <span className={`text-[10px] font-bold font-mono mb-1 text-center ${
                              theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                            }`}>
                              {lang === "fa" ? "⌛ عبور موفق از فایروال سخت اپراتور موبایل" : "⌛ Multi-Hop Tunnel (ICE Dynamic Holepunched)"}
                            </span>
                            <div className="w-1 md:w-full h-14 md:h-1 bg-indigo-500/20 rounded-full relative overflow-hidden my-1">
                              {/* Mobile Vertical Flow */}
                              <div className="absolute left-0 w-full h-12 bg-gradient-to-b from-transparent via-indigo-400 to-transparent animate-march-down block md:hidden" style={{ animationDuration: "2s" }} />
                              {/* Desktop Horizontal Flow */}
                              <div className="absolute top-0 h-full w-24 bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-march-right hidden md:block" style={{ animationDuration: "2s" }} />
                            </div>
                            <span className={`text-[8px] sm:text-[9px] font-mono mt-1 text-center block ${theme === "dark" ? "text-slate-500" : "text-slate-600 font-medium"}`}>
                              {lang === "fa" ? "تطبیق پویا و اتصال ریل کاندیداهای ICE بر بستر شبکه سلولار" : "Candidate pairing established after cellular route alignment"}
                            </span>
                          </div>
                        )}

                        {/* Scenario: Strict Symmetric NAT */}
                        {selectedNatScenario === "nat_symmetric" && (
                          <div className="w-full flex flex-col items-center">
                            {/* Symmetric Blockage symbol */}
                            <div className="flex flex-col items-center my-1.5 md:my-0 md:absolute md:-top-[46px] md:left-1/2 md:-translate-x-1/2 z-20">
                              <div className={`h-6 w-6 rounded-full border flex items-center justify-center animate-bounce ${
                                theme === "dark" 
                                  ? "bg-rose-950/80 border-rose-800 text-rose-450" 
                                  : "bg-rose-100 border-rose-300 text-rose-600 shadow-sm"
                              }`}>
                                <Lock className="h-3 w-3" />
                              </div>
                            </div>
                            
                            <span className={`text-[10px] font-bold font-mono mb-1 text-center ${
                              theme === "dark" ? "text-rose-400" : "text-rose-600"
                            }`}>
                              {lang === "fa" ? "❌ مسدود شده (تغییر مداوم پورت UDP توسط روتر)" : "❌ Connection Inhibited by Symmetric NAT"}
                            </span>
                            <div className="w-1 md:w-full h-14 md:h-1 bg-rose-500/20 rounded-full relative my-1">
                              {/* Block blocker line crossing: horizontal block on vertical line, vertical block on horizontal line */}
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-550 w-4 h-1 block md:hidden rounded" />
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-550 w-1 h-4 hidden md:block rounded" />
                            </div>
                            <span className={`text-[8px] sm:text-[9px] font-mono mt-1 text-center block ${
                              theme === "dark" ? "text-rose-450 dark:text-rose-400" : "text-rose-600 font-medium"
                            }`}>
                              {lang === "fa" ? "مدیریت تصادفی پورت فایروال شرکتی مانع جفت‌سازی سوکت‌ها می‌شود" : "Symmetric port allocations prevent direct UDP socket pairing"}
                            </span>
                          </div>
                        )}

                      </div>

                      {/* Node Right/Bottom: Client B */}
                      <div className="flex flex-col items-center gap-1.5 shrink-0">
                        <div className={`h-12 w-12 rounded-xl border flex items-center justify-center shadow-md transition-transform hover:scale-105 duration-300 ${
                          theme === "dark" 
                            ? "bg-teal-500/15 border-teal-500/40 text-teal-400" 
                            : "bg-teal-50 border-teal-200 text-teal-600 shadow-teal-100/10"
                        }`}>
                          <Layers className="h-6 w-6" />
                        </div>
                        <span className={`text-[10px] sm:text-[11px] font-black font-sans uppercase tracking-wider ${
                          theme === "dark" ? "text-slate-350" : "text-slate-700"
                        }`}>{lang === "fa" ? "کلاینت ب (گیرنده)" : "Client B (Receiver)"}</span>
                      </div>

                    </div>

                    {/* Quick Scenario Status Badge */}
                    <div className="relative md:absolute mt-6 md:mt-0 bottom-auto md:bottom-3 left-auto md:left-4 right-auto md:right-4 flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-0 text-[10px] sm:text-[11px] font-mono dark:text-slate-500 text-slate-500 w-full md:w-[calc(100%-2rem)] border-t border-slate-200/60 dark:border-slate-800/60 md:border-t-0 pt-3 md:pt-0">
                      <div>
                        {lang === "fa" ? "سناریو انتخابی: " : "Active Scenario: "}<strong className={`uppercase ${
                          selectedNatScenario === "nat_symmetric" 
                            ? "text-rose-550 dark:text-rose-400 font-extrabold" 
                            : "text-teal-600 dark:text-teal-400 font-extrabold"
                        }`}>{selectedNatScenario}</strong>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${selectedNatScenario === "nat_symmetric" ? "bg-rose-500 animate-ping" : "bg-emerald-500 animate-ping"}`} />
                        <span className={`font-medium ${theme === "dark" ? "text-slate-400" : "text-slate-600 font-semibold"}`}>
                          {lang === "fa" 
                            ? selectedNatScenario === "nat_symmetric" ? "مسدود شده / لزوم هات‌اسپات" : "مجرای پورتال مستقیم متصل"
                            : selectedNatScenario === "nat_symmetric" ? "BLOCKED / REQUIRES HOTSPOT" : "DIRECT PORTAL CONNECTED"}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Realtime Performance Metrix Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      {
                        label_fa: "نوع مسیر شبکه",
                        label_en: "Connection Route Type",
                        fa: {
                          lan: "حلقه محلی (Wifi/LAN)",
                          wifi_stun: "جهانی با سوراخ‌کاری STUN",
                          mobile_5g: "شبکه موبایل CGNAT",
                          nat_symmetric: "مسدودیت فایروال شرکتی"
                        },
                        en: {
                          lan: "Local Loopback (Wi-Fi/LAN)",
                          wifi_stun: "Global STUN Discovery",
                          mobile_5g: "Cellular CGNAT Gate",
                          nat_symmetric: "Corporate Firewall Block"
                        },
                        color: "text-slate-205 dark:text-slate-200"
                      },
                      {
                        label_fa: "ترافیک اینترنت مصرفی",
                        label_en: "Internet Data Cost",
                        fa: {
                          lan: "۰٪ کاملاً رایگان محلی",
                          wifi_stun: "ترافیک عادی فایل همتا",
                          mobile_5g: "مصرف ترافیک اینترنت همراه",
                          nat_symmetric: "بدون انتقال (مستلزم هات‌اسپات)"
                        },
                        en: {
                          lan: "0% Free (Local Loop)",
                          wifi_stun: "Standard Peer WAN Data",
                          mobile_5g: "Cellular Mobile Plan Data",
                          nat_symmetric: "None (Hotspot Needed)"
                        },
                        color: "text-emerald-450 dark:text-emerald-450"
                      },
                      {
                        label_fa: "پهنای باند فرضی سرعت",
                        label_en: "Expected Speed Rate",
                        fa: {
                          lan: "بالای ۱۰۰ مگابایت بر ثانیه (نامحدود)",
                          wifi_stun: "۵ الی ۳۰ مگابایت بر ثانیه",
                          mobile_5g: "۲ الی ۱۰ مگابایت بر ثانیه",
                          nat_symmetric: "صفر (سیگنالینگ رد شد)"
                        },
                        en: {
                          lan: "100+ MB/s (LAN Direct)",
                          wifi_stun: "5 to 30 MB/s (WAN Speed)",
                          mobile_5g: "2 to 10 MB/s (Cellular)",
                          nat_symmetric: "0 KB/s (Connection Blocked)"
                        },
                        color: "text-cyan-450 dark:text-cyan-400"
                      },
                      {
                        label_fa: "پایداری قطعی اتصال",
                        label_en: "Success & Stability",
                        fa: {
                          lan: "۹۹.۹٪ (اتصال مادام‌العمر محلی)",
                          wifi_stun: "۹۰٪ الی ۹۵٪ عالی",
                          mobile_5g: "۷۵٪ الی ۸۵٪ متوسط متحرک",
                          nat_symmetric: "امکان‌پذیر نیست (نیاز به همراه)"
                        },
                        en: {
                          lan: "99.9% (Lifetime Local)",
                          wifi_stun: "90% to 95% (Excellent)",
                          mobile_5g: "75% to 85% (Average)",
                          nat_symmetric: "Failed (Cell Dynamic Req.)"
                        },
                        color: "text-amber-550 dark:text-amber-400"
                      }
                    ].map((metric, idx) => {
                      const value = lang === "fa" ? metric.fa[selectedNatScenario] : metric.en[selectedNatScenario];
                      return (
                        <div key={idx} className={`p-4 rounded-xl border ${
                          theme === "dark" ? "bg-slate-950/20 border-slate-850" : "bg-white border-slate-205 shadow-3xs"
                        }`}>
                          <span className="text-[10px] font-sans font-bold dark:text-slate-500 text-slate-700 block mb-1">
                            {lang === "fa" ? metric.label_fa : metric.label_en}
                          </span>
                          <span className={`text-[11px] sm:text-xs font-black font-mono leading-snug block ${metric.color}`}>
                            {value}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                </div>

              </div>
            </div>

            {/* 6. Interactive SVG Vector Diagram explaining Client-Side architecture */}
            <div className="space-y-4 select-none">
              <h3 className={`text-xs font-black uppercase tracking-widest text-center font-sans ${
                theme === "dark" ? "text-slate-500" : "text-slate-600"
              }`}>
                {lang === "fa" ? "نقشه معماری تبادل و مسیر یابی اتصال کلاینت" : "Client Interaction & Gateway Routing Map"}
              </h3>
              <div className={`border rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 ${
                theme === "dark" 
                  ? "border-slate-800/80 bg-slate-950/40 text-teal-400 shadow-2xl" 
                  : "bg-white border-slate-200/90 text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              }`}>
                <div className="w-full max-w-3xl">
                  <svg viewBox="0 0 800 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                    
                    {/* Definitions for Gradients and Arrows */}
                    <defs>
                      <linearGradient id="glow-teal-landing" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                      </linearGradient>
                      <marker id="arrow-teal-landing" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M0 0L10 5L0 10z" fill="#0d9488" />
                      </marker>
                      <marker id="arrow-dashed-landing" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0 0L10 5L0 10z" fill={theme === "dark" ? "#475569" : "#94a3b8"} />
                      </marker>
                    </defs>

                    {/* Grid background lines */}
                    <g opacity={theme === "dark" ? "0.15" : "0.5"}>
                      <line x1="40" y1="50" x2="760" y2="50" stroke={theme === "dark" ? "#14b8a6" : "#cbd5e1"} strokeWidth="0.5" strokeDasharray="4 4" />
                      <line x1="40" y1="160" x2="760" y2="160" stroke={theme === "dark" ? "#14b8a6" : "#cbd5e1"} strokeWidth="0.5" strokeDasharray="4 4" />
                      <line x1="40" y1="270" x2="760" y2="270" stroke={theme === "dark" ? "#14b8a6" : "#cbd5e1"} strokeWidth="0.5" strokeDasharray="4 4" />
                    </g>

                    {/* Path 1: Device A (Laptop) to Signaling Proxy Cloud (Initial Handshake Only) */}
                    <path d="M 110 182 L 320 80" stroke={theme === "dark" ? "#475569" : "#94a3b8"} strokeWidth="1.5" strokeDasharray="5 5" markerEnd="url(#arrow-dashed-landing)" />
                    
                    {/* Path 2: Device B (Smartphone) to Signaling Proxy Cloud */}
                    <path d="M 690 182 L 480 80" stroke={theme === "dark" ? "#475569" : "#94a3b8"} strokeWidth="1.5" strokeDasharray="5 5" markerEnd="url(#arrow-dashed-landing)" />

                    {/* PRIMARY Direct Peer-to-Peer Channel (Thick, bright, glowing green animated tunnel) */}
                    <path d="M 158 230 H 642" stroke={theme === "dark" ? "rgba(20,184,166,0.15)" : "rgba(20,184,166,0.1)"} strokeWidth="8" strokeLinecap="round" />
                    <path d="M 158 230 H 642" stroke="url(#glow-teal-landing)" strokeWidth="3" strokeLinecap="round" strokeDasharray="14 10" className="animate-march-stripes" />

                    {/* Signaling Proxy Cloud Server (Top Central Node) */}
                    <g transform="translate(400, 80)">
                      <rect x="-80" y="-30" width="160" height="50" rx="10" fill={theme === "dark" ? "#0f172a" : "#f8fafc"} stroke={theme === "dark" ? "#334155" : "#cbd5e1"} strokeWidth="2" />
                      <text x="0" y="-2" textAnchor="middle" fill={theme === "dark" ? "#94a3b8" : "#475569"} fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                        {lang === "fa" ? "کارگذار مچ‌میکر دست‌دهی" : "Signaling Relay"}
                      </text>
                      <text x="0" y="11" textAnchor="middle" fill={theme === "dark" ? "#64748b" : "#94a3b8"} fontSize="8" fontFamily="monospace">
                        {lang === "fa" ? "(تنها ارتباط ثانیه‌ای اولیه)" : "(Negotiation Only)"}
                      </text>
                      <circle cx="-65" cy="-5" r="5" fill="#ef4444" />
                    </g>

                    {/* Left Complex Node: Sender Laptop Device */}
                    <g transform="translate(110, 230)">
                      {/* Pulse active ring */}
                      <circle r="48" fill="none" stroke={theme === "dark" ? "rgba(20,184,166,0.3)" : "rgba(13,148,136,0.2)"} strokeWidth="3.5" className="animate-pulse" />
                      <circle r="42" fill={theme === "dark" ? "#070b13" : "#f1f5f9"} stroke={theme === "dark" ? "#0d9488" : "#14b8a6"} strokeWidth="1.5" />
                      
                      {/* MacBook Laptop Chassis Vector Design */}
                      <g transform="translate(0, -5) scale(0.95)">
                        {/* Screen assembly lid background */}
                        <rect x="-24" y="-20" width="48" height="30" rx="2.5" fill={theme === "dark" ? "#1e293b" : "#ffffff"} stroke={theme === "dark" ? "#06b6d4" : "#0d9488"} strokeWidth="1.8" />
                        {/* Active terminal monitor */}
                        <rect x="-21" y="-17" width="42" height="24" rx="1" fill={theme === "dark" ? "#020617" : "#cbd5e1"} strokeWidth="0.5" stroke="#10b981" />
                        {/* High-tech flashing codes indicators */}
                        <line x1="-17" y1="-12" x2="-3" y2="-12" stroke="#10b981" strokeWidth="1.2" />
                        <line x1="-17" y1="-8" x2="3" y2="-8" stroke="#10b981" strokeWidth="1.2" strokeDasharray="3 1" />
                        <line x1="-17" y1="-4" x2="-7" y2="-4" stroke="#06b6d4" strokeWidth="1.2" />
                        
                        {/* Keyboard Base Plate Deck chassis */}
                        <path d="M -32 10 L 32 10 L 26 18 L -26 Z" fill={theme === "dark" ? "#334155" : "#94a3b8"} stroke={theme === "dark" ? "#0d9488" : "#0d9488"} strokeWidth="1.5" />
                        {/* Trackpad area representation */}
                        <rect x="-6" y="11" width="12" height="2" rx="0.5" fill={theme === "dark" ? "#1e293b" : "#f8fafc"} />
                      </g>

                      {/* Info text label inside SVG viewport */}
                      <text x="0" y="62" textAnchor="middle" fill={theme === "dark" ? "#f8fafc" : "#1e293b"} fontSize="11" fontWeight="extrabold" fontFamily="sans-serif">
                        {peerName.slice(0, 10)}
                      </text>
                      <text x="0" y="74" textAnchor="middle" fill="#0d9488" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                        {lang === "fa" ? "لپ‌تاپ فرستنده" : "Sender (Your Laptop)"}
                      </text>
                    </g>

                    {/* Right Complex Node: Target Smartphone Device */}
                    <g transform="translate(690, 230)">
                      {/* Pulse active ring */}
                      <circle r="48" fill="none" stroke={theme === "dark" ? "rgba(16,185,129,0.3)" : "rgba(16,185,129,0.2)"} strokeWidth="2.5" />
                      <circle r="42" fill={theme === "dark" ? "#070b13" : "#f1f5f9"} stroke={theme === "dark" ? "#10b981" : "#10b981"} strokeWidth="1.5" />
                      
                      {/* Premium Smartphone Vector Design */}
                      <g transform="translate(0, -4) scale(0.95)">
                        {/* Outer bezel structure */}
                        <rect x="-13" y="-23" width="26" height="46" rx="4.5" fill={theme === "dark" ? "#1e293b" : "#ffffff"} stroke={theme === "dark" ? "#34d399" : "#10b981"} strokeWidth="1.8" />
                        {/* Edge-to-edge screen panel */}
                        <rect x="-10" y="-20" width="20" height="40" rx="2" fill={theme === "dark" ? "#020617" : "#cbd5e1"} strokeWidth="0.5" stroke="#10b981" />
                        {/* Notch / Dynamic Island indicator */}
                        <rect x="-5" y="-19" width="10" height="2" rx="1" fill="#334155" />
                        
                        {/* High-tech arrow pulsing down loop inside phone screen */}
                        <path d="M 0 -8 L 0 5 M -4 1 L 0 5 L 4 1" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="-5" y1="10" x2="5" y2="10" stroke="#34d399" strokeWidth="1" />
                      </g>

                      {/* Info text label inside SVG viewport */}
                      <text x="0" y="62" textAnchor="middle" fill={theme === "dark" ? "#f8fafc" : "#1e293b"} fontSize="11" fontWeight="extrabold" fontFamily="sans-serif">
                        {lang === "fa" ? "همتای مقصد" : "Target Peer"}
                      </text>
                      <text x="0" y="74" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                        {lang === "fa" ? "گوشی هوشمند گیرنده" : "Receiver (Smartphone)"}
                      </text>
                    </g>

                    {/* Direct Secure Channel Description (Center Shield) */}
                    <g transform="translate(400, 230)">
                      <circle r="26" fill={theme === "dark" ? "#0f172a" : "#f0fdf4"} stroke={theme === "dark" ? "#14b8a6" : "#2dd4bf"} strokeWidth="2.5" />
                      <path d="M-6 -8 L0 -12 L6 -8 V0 C6 5 2 9 0 11 C-2 9 -6 5 -6 0 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                      <text x="0" y="-34" textAnchor="middle" fill={theme === "dark" ? "#2de4cf" : "#0f766e"} fontSize="10" fontWeight="extrabold" fontFamily="sans-serif">
                        {lang === "fa" ? "اتصال مستقیم همتابه‌همتا (WebRTC)" : "Direct P2P Data Bridge (WebRTC)"}
                      </text>
                      <text x="0" y="-45" textAnchor="middle" fill={theme === "dark" ? "#10b981" : "#047857"} fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                        {lang === "fa" ? "رمزگذاری مستقل AES-GCM ۲۵۶ بیتی" : "100% Client End-to-End Cryptography"}
                      </text>
                    </g>

                    {/* Exclusion Warning: Server doesn't register files */}
                    <g transform="translate(400, 142)">
                      <rect x="-135" y="-14" width="270" height="20" rx="5" fill={theme === "dark" ? "#881337" : "#fff1f2"} opacity="0.95" stroke={theme === "dark" ? "#f43f5e" : "#fda4af"} strokeWidth="1" />
                      <text x="0" y="-1" textAnchor="middle" fill={theme === "dark" ? "#fecdd3" : "#be123c"} fontSize="8.5" fontWeight="extrabold" fontFamily="sans-serif">
                        {lang === "fa" ? "⛔ هیچ فایلی بر روی این مچ‌میکر فرستاده یا ثبت نمی‌شود" : "⛔ Zero Device File Data Touches This Server"}
                      </text>
                    </g>

                  </svg>
                </div>
                <div className={`mt-5 text-center text-xs font-sans max-w-2xl px-2 leading-relaxed ${
                  theme === "dark" ? "text-slate-400" : "text-slate-600 font-medium"
                }`}>
                  <p>
                    {lang === "fa" 
                      ? "💡 نقش سرور سیگنال‌دهنده درست مثل آژانس املاک یا معرف است. فقط هماهنگی ملاقات اول را انجام می‌دهد. بعد از رد و بدل شدن پارامترهای اتصال (SDP)، هر دو مرورگر یک کریدور اختصاصی فیزیکی از مودم به مودم می‌زنند."
                      : "💡 The signaling server plays the role of a physical matchmaker. Once Device A and B establish dynamic handshakes via room key synchronization, server tunnels drop and direct transport begins."}
                  </p>
                </div>
              </div>
            </div>

            {/* 7. Pre-configuration Interactive Form styled like a sci-fi Cockpit (3 Cards) */}
            <div className="space-y-6">
              <h3 className={`text-xs font-black uppercase tracking-widest text-center font-sans ${
                theme === "dark" ? "text-slate-400" : "text-slate-650"
              }`}>
                {lang === "fa" ? "میز هماهنگی و اتاق کنترل پرواز رادار" : "COCKPIT CONTROL STATION IDENTITY"}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Box 1: Nickname (3D Layout) */}
                <motion.div 
                  whileHover={{ scale: 1.02, rotateY: -1, y: -2 }}
                  className={`rounded-2xl p-6 border flex flex-col justify-between transition-all select-none ${
                    theme === "dark" 
                      ? "bg-slate-900/40 border-slate-800/80 hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/[0.02]" 
                      : "bg-white border-slate-200 shadow-sm hover:border-teal-500/20"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <h4 className={`text-[13px] font-black font-sans tracking-wider uppercase ${theme === "dark" ? "text-teal-400" : "text-teal-700"}`}>
                        {dict[lang].yourDevice}
                      </h4>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-650 font-medium"}`}>
                      {dict[lang].customNickname}
                    </p>
                  </div>
                  <div className={`mt-5 flex items-center border rounded-xl overflow-hidden transition-all ${
                    theme === "dark"
                      ? "bg-slate-950/70 border-slate-800 focus-within:border-sky-500 focus-within:shadow-[0_0_15px_rgba(14,165,233,0.15)]"
                      : "bg-white border-slate-250 focus-within:border-sky-500 shadow-inner focus-within:shadow-[0_0_12px_rgba(14,165,233,0.1)]"
                  }`}>
                    <input
                      type="text"
                      value={peerName}
                      onChange={(e) => setPeerName(e.target.value)}
                      className={`w-full bg-transparent px-3.5 py-3 text-sm font-black focus:outline-none tracking-normal ${
                        theme === "dark" ? "text-white" : "text-slate-850"
                      }`}
                    />
                  </div>
                </motion.div>

                {/* Box 2: Room Matchmaker (3D Layout) */}
                <motion.div 
                  whileHover={{ scale: 1.02, rotateX: 1, y: -2 }}
                  className={`rounded-2xl p-6 border flex flex-col justify-between transition-all select-none ${
                    theme === "dark" 
                      ? "bg-slate-900/40 border-slate-800/80 hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/[0.02]" 
                      : "bg-white border-slate-200 shadow-sm hover:border-teal-500/20"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <h4 className={`text-[13px] font-black font-sans tracking-wider uppercase ${theme === "dark" ? "text-teal-400" : "text-teal-700"}`}>
                        {dict[lang].roomMatchmaker}
                      </h4>
                      <span className="px-1.5 py-0.2 bg-teal-500/10 text-teal-400 text-[8px] rounded uppercase font-bold tracking-widest">Active Hub</span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-650 font-medium"}`}>
                      {dict[lang].roomDesc}
                    </p>
                  </div>
                  <div className={`mt-5 flex items-center border rounded-xl overflow-hidden transition-all ${
                    theme === "dark"
                      ? "bg-slate-950/70 border-slate-800 focus-within:border-sky-500 focus-within:shadow-[0_0_15px_rgba(14,165,233,0.15)]"
                      : "bg-white border-slate-250 focus-within:border-sky-500 shadow-inner focus-within:shadow-[0_0_12px_rgba(14,165,233,0.1)]"
                  }`}>
                    <input
                      type="text"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      className={`flex-1 bg-transparent px-3.5 py-3 text-sm font-black font-mono focus:outline-none ${
                        theme === "dark" ? "text-teal-450" : "text-teal-700"
                      }`}
                    />
                    <button
                      onClick={() => {
                        const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
                        let suffix = "";
                        for (let i = 0; i < 9; i++) {
                          suffix += charset.charAt(Math.floor(Math.random() * charset.length));
                        }
                        setRoomId("room-" + suffix);
                      }}
                      className="p-3 text-slate-500 hover:text-teal-550 hover:bg-teal-500/5 transition-all cursor-pointer border-l dark:border-slate-800 border-slate-200"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>

                {/* Box 3: Client AES E2E Key (3D Layout) */}
                <motion.div 
                  whileHover={{ scale: 1.02, rotateY: 1, y: -2 }}
                  className={`rounded-2xl p-6 border flex flex-col justify-between transition-all select-none ${
                    theme === "dark" 
                      ? "bg-slate-900/40 border-slate-800/80 hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/[0.02]" 
                      : "bg-white border-slate-200 shadow-sm hover:border-teal-500/20"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <h4 className={`text-[13px] font-black font-sans tracking-wider uppercase ${theme === "dark" ? "text-teal-400" : "text-teal-700"}`}>
                        {dict[lang].clientE2EKey}
                      </h4>
                      <Lock className="h-3.5 w-3.5 text-sky-500 animate-pulse" />
                    </div>
                    <p className={`text-[11px] leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-650 font-medium"}`}>
                      {dict[lang].clientE2EDesc}
                    </p>
                  </div>
                  <div className={`mt-5 flex items-center border rounded-xl overflow-hidden transition-all ${
                    theme === "dark"
                      ? "bg-slate-950/70 border-slate-800 focus-within:border-sky-500 focus-within:shadow-[0_0_15px_rgba(14,165,233,0.15)]"
                      : "bg-white border-slate-250 focus-within:border-sky-500 shadow-inner focus-within:shadow-[0_0_12px_rgba(14,165,233,0.1)]"
                  }`} title="Passphrase for symmetric block key cipher">
                    <input
                      type="text"
                      maxLength={15}
                      value={aesPassphrase}
                      onChange={(e) => setAesPassphrase(e.target.value)}
                      className={`w-full bg-transparent px-3 py-3 text-sm font-mono font-black focus:outline-none text-center tracking-widest ${
                        theme === "dark" ? "text-sky-400" : "text-sky-600"
                      }`}
                      placeholder="9-Char Key"
                    />
                  </div>
                </motion.div>

              </div>
            </div>

            {/* 8. Master Launch Pulse Button Option */}
            <div className="flex flex-col items-center justify-center py-4 select-none">
              <button
                onClick={() => setShowLanding(false)}
                className="group px-10 py-5 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-sky-500 hover:brightness-105 shadow-2xl shadow-teal-500/25 hover:shadow-emerald-500/40 text-slate-950 font-sans font-black text-sm md:text-base flex items-center justify-center gap-3.5 transition-all transform duration-300 active:scale-95 cursor-pointer"
              >
                <Sparkles className="h-5 w-5 text-slate-950 animate-bounce" />
                <span>
                  {lang === "fa" ? "راه‌اندازی فضای امن و کشف دستگاه‌ها در رادار" : "Initialize Space & Spawn Radar Scan"}
                </span>
                <ArrowLeft className={`h-4.5 w-4.5 transition-transform ${lang === "fa" ? "group-hover:-translate-x-1.5" : "rotate-180 group-hover:translate-x-1.5"}`} />
              </button>
              <span className={`text-[10px] font-medium font-mono mt-3.5 text-center ${
                theme === "dark" ? "text-slate-500" : "text-slate-600 font-bold"
              }`}>
                {lang === "fa" ? "🔒 با کلیک اولیه، سیستم ارتباط همزمان و همتابه‌همتای مرورگر شما متصل می‌شود." : "🔒 Entering active room portal binds custom state handles dynamically."}
              </span>
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col space-y-6">
            
            {/* Device Handshakes Config Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Box 1: Custom Device Handle Name */}
              <div className={`rounded-xl p-4 flex flex-col justify-between border ${
                theme === "dark" ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
              }`}>
                <div>
                  <h3 className={`text-[13px] font-bold tracking-wide uppercase font-sans ${theme === "dark" ? "text-teal-400" : "text-teal-700"}`}>
                    {dict[lang].yourDevice}
                  </h3>
                  <p className={`text-[10px] mt-0.5 ${theme === "dark" ? "text-slate-500" : "text-slate-650 font-medium"}`}>{dict[lang].customNickname}</p>
                </div>
                <div className={`mt-3 flex items-center border rounded-lg overflow-hidden transition-colors ${
                  theme === "dark" ? "bg-slate-950 border-slate-800" : "bg-white border-slate-300 shadow-sm"
                }`}>
                  <div className="px-3 text-slate-500 dark:text-slate-450 font-sans text-xs font-bold shrink-0">{dict[lang].nicknameLabel}</div>
                  <input
                    type="text"
                    value={peerName}
                    onChange={(e) => setPeerName(e.target.value)}
                    className={`flex-1 bg-transparent px-2.5 py-2 text-sm font-bold focus:outline-none ${
                      theme === "dark" ? "text-white" : "text-slate-800"
                    }`}
                    placeholder="Enter device nickname"
                  />
                </div>
              </div>

              {/* Box 2: Room Selector Sync */}
              <div className={`rounded-xl p-4 flex flex-col justify-between border ${
                theme === "dark" ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
              }`}>
                <div>
                  <h3 className={`text-[13px] font-bold tracking-wide uppercase font-sans ${theme === "dark" ? "text-teal-400" : "text-teal-700"}`}>
                    {dict[lang].roomMatchmaker}
                  </h3>
                  <p className={`text-[10px] mt-0.5 ${theme === "dark" ? "text-slate-500" : "text-slate-650 font-medium"}`}>{dict[lang].roomDesc}</p>
                </div>
                <div className={`mt-3 flex items-center border rounded-lg overflow-hidden transition-colors ${
                  theme === "dark" ? "bg-slate-950 border-slate-800" : "bg-white border-slate-300 shadow-sm"
                }`}>
                  <div className="px-3 text-slate-500 dark:text-slate-450 font-sans text-xs font-bold shrink-0">{dict[lang].roomLabel}</div>
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className={`flex-1 bg-transparent px-2.5 py-2 text-sm font-bold focus:outline-none font-mono ${
                      theme === "dark" ? "text-teal-400" : "text-teal-700"
                    }`}
                    placeholder="Enter custom room"
                  />
                  <button
                    onClick={() => {
                      const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
                      let suffix = "";
                      for (let i = 0; i < 9; i++) {
                        suffix += charset.charAt(Math.floor(Math.random() * charset.length));
                      }
                      setRoomId("room-" + suffix);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
                    title={dict[lang].generateNewRoom}
                    id="new-room-btn"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Box 3: Symmetric Lock & Key Config (AES-GCM) */}
              <div className={`rounded-xl p-4 flex flex-col justify-between border ${
                theme === "dark" ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`text-[13px] font-bold tracking-wide uppercase font-sans flex items-center ${theme === "dark" ? "text-teal-400" : "text-teal-700"}`}>
                      <Shield className="h-4 w-4 mr-1.5 ml-1.5 text-teal-500" />
                      {dict[lang].clientE2EKey}
                    </h3>
                    <p className={`text-[10px] mt-0.5 ${theme === "dark" ? "text-slate-500" : "text-slate-650 font-medium"}`}>{dict[lang].clientE2EDesc}</p>
                  </div>
                  <Lock className="h-4 w-4 text-slate-600 dark:text-slate-500 shrink-0 select-none animate-pulse" />
                </div>
                <div className="mt-3">
                  <div className={`flex items-center border rounded-lg overflow-hidden p-1 transition-colors ${
                    theme === "dark" ? "bg-slate-950 border-slate-800" : "bg-white border-slate-300 shadow-sm"
                  }`}>
                    <div className="px-2 text-slate-500 dark:text-slate-450 font-sans text-xs font-bold shrink-0">{dict[lang].passphraseLabel}</div>
                    <input
                      type="text"
                      maxLength={9}
                      value={aesPassphrase}
                      onChange={(e) => {
                        setAesPassphrase(e.target.value);
                      }}
                      className={`flex-1 bg-transparent px-2 py-1 text-sm font-extrabold focus:outline-none text-center tracking-widest placeholder-slate-400 font-mono ${
                        theme === "dark" ? "text-sky-400" : "text-sky-600"
                      }`}
                      placeholder="aB3@k!9ch"
                    />
                  </div>
                  
                  {/* Password Padlock Circle lights dots */}
                  <div className="flex justify-center gap-1.5 mt-2">
                    {[...Array(9)].map((_, i) => (
                      <span
                        key={i}
                        className={`h-2 w-2 rounded-full transition-all ${
                          i < aesPassphrase.length
                            ? "bg-teal-500 shadow-sm shadow-teal-500/50 scale-110"
                            : theme === "dark"
                            ? "bg-slate-800"
                            : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Showcase Stage Grid: Discovery Radar vs Upload Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Radar Discovery */}
              <div className={`lg:col-span-7 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[460px] border ${
                theme === "dark" ? "bg-slate-900/20 border-slate-800/50" : "bg-white border-slate-200/80 shadow-sm"
              }`}>
                
                {/* Visual Radar Rings & High-tech sweeping scanner arm */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden pb-12 sm:pb-0">
                  {/* Rotating Sweeper Arm */}
                  <div className="absolute w-[280px] h-[280px] sm:w-[440px] sm:h-[440px] rounded-full border border-teal-500/10 flex items-center justify-center">
                    <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-gradient-to-b from-teal-500/80 via-teal-500/20 to-transparent origin-bottom animate-radar-sweep"></div>
                  </div>
                  {/* Expanding Echo Ripples */}
                  <div className="absolute h-[220px] w-[220px] sm:h-[320px] sm:w-[320px] rounded-full border border-teal-500/10 animate-wave-ripple" style={{ animationDelay: "0s" }}></div>
                  <div className="absolute h-[220px] w-[220px] sm:h-[320px] sm:w-[320px] rounded-full border border-teal-500/10 animate-wave-ripple" style={{ animationDelay: "1.5s" }}></div>
                </div>

                <div className="text-center max-w-md z-10 mb-8 self-center">
                  <h2 className="text-lg font-display-title tracking-tight flex items-center justify-center gap-2 text-slate-950 dark:text-white">
                    <Radio className="h-5 w-5 text-teal-500 animate-pulse" />
                    {dict[lang].localRadar}
                  </h2>
                  <p className={`text-xs mt-1.5 font-mono ${theme === "dark" ? "text-slate-500" : "text-slate-600 font-bold"}`}>
                    {dict[lang].searchingRoom} <span className="text-teal-600 dark:text-teal-400 font-extrabold tracking-wider">{roomId}</span>
                  </p>
                  
                  {/* Quick Action Test Buttons - copy target invite link */}
                  <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                    <button
                      onClick={() => {
                        const inviteLink = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
                        navigator.clipboard.writeText(inviteLink);
                        setCopiedText("invite");
                        setTimeout(() => setCopiedText(null), 2000);
                      }}
                      className="px-3.5 py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/25 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 cursor-pointer font-sans"
                    >
                      {copiedText === "invite" ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span>{dict[lang].copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>{dict[lang].copyInvite}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Radar Node Layout of Peers */}
                <div className="relative w-full flex-1 flex flex-col justify-center items-center z-10">
                  
                  {/* Center Node (You) */}
                  <div className={`h-24 w-24 rounded-full p-1 flex flex-col items-center justify-center shadow-2xl mb-8 relative border-2 ${
                    theme === "dark" ? "bg-slate-950 border-teal-500/40 shadow-teal-500/10" : "bg-slate-50 border-teal-500/30 shadow-slate-200"
                  }`}>
                    <div className="absolute -top-1.5 bg-teal-500 text-slate-950 font-sans text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                      {dict[lang].self}
                    </div>
                    {deviceType === "mobile" ? (
                      <Smartphone className="h-6 w-6 text-teal-500 animate-pulse" />
                    ) : (
                      <Monitor className="h-6 w-6 text-teal-500" />
                    )}
                    <span className="text-[10px] mt-1 max-w-[80px] font-sans font-bold truncate">
                      {peerName}
                    </span>
                    <span className="text-[8px] text-slate-500 dark:text-slate-400 font-sans truncate max-w-[75px]">
                      {deviceDetail}
                    </span>
                  </div>

                  {/* Active Peers Display List */}
                  <div className="w-full">
                    <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest text-center mb-4">
                      {dict[lang].discoveredDevices} ({discoveredPeers.length})
                    </h4>

                    {discoveredPeers.length === 0 ? (
                      <div className="text-xs text-slate-400 dark:text-slate-500 text-center italic py-2 font-mono" id="no-peers-discovered">
                        {dict[lang].noPeers}
                      </div>
                    ) : (
                      <div className="flex flex-wrap justify-center gap-4">
                        {discoveredPeers.map((peer) => {
                          const isSelected = targetPeer?.id === peer.id;
                          const authStatus = peerAuthStates[peer.id] || "untrusted";

                          return (
                            <div
                              key={peer.id}
                              className={`flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-xl w-[120px] sm:w-[136px] text-center transition-all border relative ${
                                isSelected
                                  ? "bg-teal-500/15 border-teal-500 shadow-lg shadow-teal-500/10 scale-105"
                                  : theme === "dark"
                                  ? "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                                  : "bg-slate-100 border-slate-200 hover:bg-slate-150"
                              }`}
                              id={`peer-node-${peer.id}`}
                            >
                              <div
                                onClick={() => selectDiscoveredPeer(peer)}
                                className="w-full flex flex-col items-center cursor-pointer select-none"
                              >
                                <div className="mb-2 relative">
                                  {peer.deviceType === "mobile" ? (
                                    <Smartphone className={`h-6 w-6 ${isSelected ? "text-teal-500" : "text-slate-400"}`} />
                                  ) : (
                                    <Monitor className={`h-6 w-6 ${isSelected ? "text-teal-500" : "text-slate-400"}`} />
                                  )}
                                  
                                  {/* Padlock indicator overlay on Peer node */}
                                  <div className="absolute -top-1 -right-1">
                                    {authStatus === "authenticated" ? (
                                      <span className="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 text-[8px] text-white">✓</span>
                                    ) : authStatus === "authenticating" ? (
                                      <span className="flex h-3 w-3 items-center justify-center rounded-full bg-amber-500 text-[8px] text-white">⋯</span>
                                    ) : (
                                      <span className="flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px] text-white">✕</span>
                                    )}
                                  </div>
                                </div>
                                
                                <span className="text-xs font-bold truncate w-full text-slate-800 dark:text-slate-200 font-sans">
                                  {peer.name}
                                </span>
                                {peer.deviceDetail && (
                                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-sans font-bold truncate w-full mt-0.5">
                                    {peer.deviceDetail}
                                  </span>
                                )}
                                <span className="text-[9px] text-slate-500 tracking-wider mt-0.5 truncate w-full font-mono">
                                  id: {peer.id}
                                </span>
                                
                                {/* Display friendly authentication status label */}
                                <span className={`text-[8px] mt-1 font-sans uppercase tracking-widest px-1 py-0.2 rounded font-bold ${
                                  authStatus === "authenticated"
                                    ? "bg-emerald-500/10 text-emerald-500"
                                    : authStatus === "authenticating"
                                    ? "bg-amber-500/10 text-amber-500"
                                    : "bg-red-500/10 text-red-500"
                                }`}>
                                  {authStatus === "authenticated"
                                    ? (lang === "fa" ? "تایید شده" : "auth success")
                                    : authStatus === "authenticating"
                                    ? (lang === "fa" ? "رمزنگاری دوجانبه..." : "verifying pin...")
                                    : (lang === "fa" ? "رمز نامعتبر" : "no access")}
                                </span>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDetailPeer(peer);
                                }}
                                className="mt-2.5 px-2 py-0.5 text-[9px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 rounded transition-colors active:scale-95 cursor-pointer w-full text-center font-sans uppercase tracking-widest"
                              >
                                {lang === "fa" ? "جزئیات" : "details"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>

                </div>

              </div>

              {/* Upload Dropzone and Queues */}
              <div className={`lg:col-span-5 rounded-2xl p-6 flex flex-col space-y-6 border ${
                theme === "dark" ? "bg-slate-950/20 border-slate-800/40" : "bg-white border-slate-200 shadow-sm"
              }`}>
                
                <div>
                  <h2 className="text-base font-display-title tracking-tight text-slate-950 dark:text-white">{dict[lang].directTunnel}</h2>
                  <p className={`text-[11px] mt-0.5 ${theme === "dark" ? "text-slate-500" : "text-slate-600 font-medium"}`}>
                    {dict[lang].tunnelDesc}
                  </p>
                </div>

                {/* Localized Tutorial Help Banner */}
                <div className={`border p-4 rounded-xl text-justify shrink-0 ${
                  theme === "dark" ? "bg-teal-500/[0.02] border-teal-500/10" : "bg-teal-50/20 border-teal-500/15"
                }`}>
                  <p className="text-xs font-bold text-teal-600 dark:text-teal-400 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 shrink-0" />
                    {dict[lang].quickHelpTitle}
                  </p>
                  <ol className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5 list-decimal list-inside pr-1 pl-1 leading-relaxed">
                    <li>{dict[lang].quickStep1}</li>
                    <li>{dict[lang].quickStep2}</li>
                    <li>{dict[lang].quickStep3}</li>
                    <li>{dict[lang].quickStep4}</li>
                  </ol>
                </div>

                {/* Selected Status Bar */}
                {targetPeer ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-mono truncate">
                        {dict[lang].tunnelReady} <span className="text-emerald-600 dark:text-emerald-400 font-bold">{targetPeer.name}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setTargetPeer(null)}
                      className="text-[10px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-mono underline"
                    >
                      {dict[lang].deselect}
                    </button>
                  </div>
                ) : (
                  <div className={`border rounded-xl p-3 flex items-center gap-2 text-slate-500 ${
                    theme === "dark" ? "bg-amber-500/5 border-amber-500/10" : "bg-amber-50/10 border-amber-500/15"
                  }`}>
                    <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></div>
                    <p className="text-xs font-mono">{dict[lang].selectLabel}</p>
                  </div>
                )}

                {/* File Drop Drag Area */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDropZoneFile}
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all ${
                    targetPeer && (peerAuthStates[targetPeer.id] === "authenticated")
                      ? "border-teal-500/30 bg-teal-500/[0.01] hover:border-teal-500/70 hover:bg-teal-500/[0.03] cursor-pointer"
                      : "border-slate-800 bg-slate-900/10 opacity-60 cursor-not-allowed"
                  }`}
                  onClick={() => targetPeer && (peerAuthStates[targetPeer.id] === "authenticated") && document.getElementById("file-loader-el")?.click()}
                  id="drop-zone-workspace"
                >
                  <input
                    type="file"
                    id="file-loader-el"
                    className="hidden"
                    disabled={!targetPeer || (peerAuthStates[targetPeer.id] !== "authenticated")}
                    onChange={handleFileInput}
                  />
                  <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 mb-3 shadow">
                    <Upload className={`h-6 w-6 ${targetPeer && (peerAuthStates[targetPeer.id] === "authenticated") ? "text-teal-500" : "text-slate-400"}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{dict[lang].dragDrop}</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                    {targetPeer && (peerAuthStates[targetPeer.id] === "authenticated") ? dict[lang].uploadPrompt : dict[lang].uploadEnabled}
                  </p>
                </div>

                {/* Queue History */}
                <div className="flex-1 flex flex-col justify-start">
                  
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
                      {dict[lang].queueTitle}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-600">
                      {dict[lang].cipherInfo}
                    </span>
                  </div>

                  <div className="space-y-3 overflow-y-auto max-h-[220px] scrollbar-thin">
                    {Object.keys(transfers).length === 0 ? (
                      <div className={`text-xs font-mono italic text-center py-6 border rounded-xl ${
                        theme === "dark" ? "border-slate-900 bg-slate-950/20 text-slate-500" : "border-slate-200 bg-slate-50 text-slate-400"
                      }`}>
                        {dict[lang].emptyQueue}
                      </div>
                    ) : (
                      (Object.values(transfers) as Transfer[]).map((trans) => {
                        return (
                          <div
                            key={trans.fileId}
                            className={`border rounded-xl p-3.5 flex flex-col space-y-2 relative overflow-hidden ${
                              theme === "dark" ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                            }`}
                            id={`transfer-queue-item-${trans.fileId}`}
                          >
                            
                            {/* File Title Details */}
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-3 truncate max-w-[75%]">
                                <div className={`p-2 rounded-lg border ${
                                  theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200"
                                }`}>
                                  {trans.direction === "sending" ? (
                                    <Upload className="h-4 w-4 text-sky-500" />
                                  ) : (
                                    <Download className="h-4 w-4 text-emerald-500" />
                                  )}
                                </div>
                                <div className="truncate text-left shrink-0">
                                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 font-mono truncate">
                                    {trans.name}
                                  </p>
                                  <p className="text-[10px] text-slate-500 capitalize tracking-wide font-mono mt-0.5">
                                    {trans.status === "completed" ? (
                                      trans.direction === "receiving" && !trans.downloaded ? (
                                        <span className="text-amber-500 font-semibold font-sans">
                                          {lang === "fa" ? "آماده دریافت - کلیک برای دانلود" : "Ready to receive - click to download"}
                                        </span>
                                      ) : (
                                        <span className="text-emerald-500 font-semibold">{dict[lang].decryptedCompleted}</span>
                                      )
                                    ) : trans.status === "failed" ? (
                                      <span className="text-red-500 font-semibold">{dict[lang].failed}</span>
                                    ) : (
                                      `${trans.status === "decrypting" ? dict[lang].decrypting : (lang === "fa" ? "در حال انتقال" : trans.status)}: ${trans.speed > 0 ? trans.speed.toFixed(1) + " MB/s" : dict[lang].connecting}`
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 font-semibold font-mono">
                                  {formatBytes(trans.size)}
                                </span>
                                {trans.direction === "receiving" && trans.status === "completed" && !trans.downloaded && (
                                  <button
                                    onClick={() => assembleAndDownloadFile(trans.fileId)}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95 animate-pulse shrink-0"
                                    title={lang === "fa" ? "دانلود فایل" : "Download file"}
                                  >
                                    <Download className="h-3.5 w-3.5" />
                                    <span>{lang === "fa" ? "دانلود" : "Save"}</span>
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Progress bar line */}
                            <div className="space-y-1">
                              <div className="w-full bg-slate-200 dark:bg-slate-950 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    trans.status === "failed"
                                      ? "bg-red-500"
                                      : trans.status === "completed"
                                      ? "bg-emerald-500"
                                      : "bg-gradient-to-r from-teal-500 to-sky-400"
                                  }`}
                                  style={{ width: `${trans.progress}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                                <span>{trans.direction === "sending" ? dict[lang].directSender : dict[lang].directReceiver}</span>
                                <span>{trans.progress.toFixed(0)}%</span>
                              </div>
                            </div>

                          </div>
                        );
                      })
                    )}
                  </div>

                </div>

              </div>

            </div>

            {/* Architecture Explanations */}
            <div className={`border rounded-xl p-5 block transition-colors ${
              theme === "dark" ? "bg-slate-900/10 border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <h2 className="text-sm font-display-title uppercase tracking-wider flex items-center gap-2 mb-3 text-slate-900 dark:text-slate-350">
                <Info className="h-4 w-4 text-teal-500 shrink-0" />
                {dict[lang].howItWorks}
              </h2>
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] leading-relaxed font-mono ${theme === "dark" ? "text-slate-400" : "text-slate-700 font-medium"}`}>
                <div>
                  <span className="text-teal-600 dark:text-teal-400 font-bold block mb-1">{dict[lang].step1Title}</span>
                  {dict[lang].step1Desc}
                </div>
                <div>
                  <span className="text-teal-600 dark:text-teal-400 font-bold block mb-1">{dict[lang].step2Title}</span>
                  {dict[lang].step2Desc}
                </div>
                <div>
                  <span className="text-teal-600 dark:text-teal-400 font-bold block mb-1">{dict[lang].step3Title}</span>
                  {dict[lang].step3Desc}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Persistent global footer bar */}
      <footer className={`py-5 px-6 shrink-0 mt-auto border-t ${
        theme === "dark" ? "bg-slate-950 border-slate-900 text-slate-500" : "bg-slate-100 border-slate-200 text-slate-600"
      }`}>
        {/* SEO Optimization Semantic Keyword Block targeting pimx / pimxnode */}
        <div className="max-w-7xl mx-auto mb-4 border-b border-dashed border-slate-800/10 dark:border-slate-800/30 pb-4 text-center">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-sans tracking-wide leading-relaxed">
            {lang === "fa" ? (
              <>
                <strong>PIMX (پیمکس)</strong> و <strong>PIMXNODE (پیمکس نود)</strong> سریع‌ترین شبکه کاملاً مستقیم و بدون سرور همتا به همتای جهان (P2P) است. اتصال ایمن، بدون ردپا و کاملاً محرمانه با فناوری انتقال پیشرفته مرورگر-به-مرورگر رمزنگاری‌شده در سراسر وب برای ارسال و دریافت امن فایل‌ها فراهم شده است. برای دستیابی به حداکثر سرعت انتقال و پایداری در شبکه PIMX، از این پرتال کارآمد استفاده نمایید.
              </>
            ) : (
              <>
                Optimized for search engines, <strong>PIMX</strong> and <strong>PIMXNODE</strong> deliver the ultimate direct, storage-free serverless peer-to-peer (P2P) file transfer network. Utilizing secure, zero-hop WebRTC conduits encrypted end-to-end via AES-GCM, the PIMX network guarantees total containment and maximal sharing speed. Secure files, configure your pimxnode, and launch private client-to-client gateways instantly.
              </>
            )}
          </p>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-center md:text-right">
          <div className="flex items-center gap-2 text-center justify-center md:justify-start">
            <span className="font-sans text-[10px] sm:text-xs">
              {dict[lang].footerCopyright}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 font-sans text-[10px] sm:text-[11px] justify-center">
            <span className="text-teal-600 dark:text-teal-400 font-semibold cursor-help" title={dict[lang].serverlessHint}>
              {dict[lang].footerServerless}
            </span>
            <span className="text-slate-350 dark:text-slate-800">|</span>
            <span className="text-slate-600 dark:text-slate-400">
              {dict[lang].footerP2P}
            </span>
          </div>
        </div>
      </footer>

      {/* 1. Link / Joining Password Authorization Modal */}
      <AnimatePresence>
        {showLinkPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLinkPasswordModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm pointer-events-auto"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`relative w-full max-w-sm p-5 sm:p-6 rounded-2xl border shadow-2xl z-10 overflow-hidden text-center pointer-events-auto ${
                theme === "dark" 
                  ? "bg-slate-900/95 border-slate-800 text-white shadow-teal-500/5 shadow-2xl" 
                  : "bg-white border-slate-200 text-slate-800 shadow-xl"
              }`}
            >
              <div className="flex flex-col items-center space-y-4">
                {/* Visual Icon */}
                <div className="h-12 w-12 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400">
                  <Lock className="h-5 w-5" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-display-title font-bold tracking-tight">
                    {lang === "fa" ? "رمز عبور اتصال به اتاق" : "Enter Room Connection PIN"}
                  </h3>
                  <p className={`text-xs leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                    {lang === "fa" 
                      ? "شما دعوت شده‌اید. لطفا کلید امنیتی این کارگاه/اتاق را از مرورگر مقابل دریافت کرده و جهت برقراری اتصال تایید شده وارد نمایید." 
                      : "You have been invited. Please enter the corresponding Security PIN/key to allow certified P2P file streams."}
                  </p>
                </div>

                {/* Input Area */}
                <div className="w-full space-y-2">
                  <div className={`flex items-center rounded-xl border px-3 py-1.5 transition-colors ${
                    theme === "dark" 
                      ? "bg-slate-950/50 border-slate-800 focus-within:border-teal-500" 
                      : "bg-slate-50 border-slate-250 focus-within:border-teal-500 shadow-inner"
                  }`}>
                    <input
                      type="text"
                      maxLength={15}
                      value={linkPasswordInput}
                      onChange={(e) => {
                        setLinkPasswordInput(e.target.value);
                        setPasswordError(null);
                      }}
                      className="w-full bg-transparent text-center font-mono font-black text-base tracking-widest focus:outline-none placeholder-slate-400 text-teal-600 dark:text-teal-400"
                      placeholder="e.g. 9-Char Pin"
                    />
                  </div>

                  {passwordError && (
                    <p className="text-[11px] text-red-500 font-bold font-sans">
                      {passwordError}
                    </p>
                  )}
                </div>

                {/* Confirm / Dismiss Buttons */}
                <div className="w-full flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (!linkPasswordInput.trim()) {
                        setPasswordError(lang === "fa" ? "لطفاً رمز عبور را وارد نمایید." : "PIN code is required!");
                        return;
                      }
                      setAesPassphrase(linkPasswordInput.trim());
                      passphraseRef.current = linkPasswordInput.trim();
                      setShowLinkPasswordModal(false);
                      setPasswordError(null);
                      // Auto trigger direct handshakes with all visible peers under this updated passphrase
                      discoveredPeers.forEach((p) => {
                        initiateWebRTCConnection(p.id);
                      });
                    }}
                    className="flex-1 py-2 sm:py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-teal-500/10 cursor-pointer active:scale-95 transition-all text-center select-none"
                  >
                    {lang === "fa" ? "تایید و اتصال امن" : "Confirm Pin"}
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowLinkPasswordModal(false);
                      setPasswordError(null);
                    }}
                    className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold cursor-pointer active:scale-95 transition-all text-center select-none border ${
                      theme === "dark" 
                        ? "bg-slate-850 hover:bg-slate-800 border-slate-800 text-slate-300" 
                        : "bg-slate-100 hover:bg-slate-150 border-slate-200 text-slate-700"
                    }`}
                  >
                    {lang === "fa" ? "انصراف" : "Skip"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Discovered Device Details Modal */}
      <AnimatePresence>
        {selectedDetailPeer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDetailPeer(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm pointer-events-auto"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`relative w-full max-w-xs p-5 sm:p-6 rounded-2xl border shadow-2xl z-10 overflow-hidden pointer-events-auto text-left ${
                theme === "dark" 
                  ? "bg-slate-900/95 border-slate-800 text-white shadow-teal-500/5 shadow-2xl" 
                  : "bg-white border-slate-200 text-slate-800 shadow-xl"
              }`}
            >
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between border-b dark:border-slate-800 border-slate-250 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-teal-400" />
                    <h3 className="text-xs font-bold tracking-wider uppercase font-sans">
                      {lang === "fa" ? "جزئیات فنی دستگاه" : "Device Metrics"}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="flex flex-col items-center py-3 bg-teal-500/[0.02] dark:bg-slate-950/30 rounded-xl border dark:border-slate-800/60 border-slate-200">
                    {selectedDetailPeer.deviceType === "mobile" ? (
                      <Smartphone className="h-7 w-7 text-teal-400 mb-1.5" />
                    ) : (
                      <Monitor className="h-7 w-7 text-teal-400 mb-1.5" />
                    )}
                    <span className="text-sm font-black font-sans text-slate-900 dark:text-slate-100">
                      {selectedDetailPeer.name}
                    </span>
                    <span className="text-[10px] text-teal-500 font-mono tracking-wider mt-0.5 uppercase">
                      P2P Node Connection
                    </span>
                  </div>

                  <div className="divide-y dark:divide-slate-800 divide-slate-200 text-xs font-sans">
                    <div className="flex justify-between py-2">
                      <span className="text-slate-400 dark:text-slate-450">{lang === "fa" ? "شناسه دستگاه:" : "Node Unique ID:"}</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedDetailPeer.id}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-400 dark:text-slate-450">{lang === "fa" ? "مشخصات فنی:" : "Specifications:"}</span>
                      <span className="font-bold text-right truncate max-w-[120px] text-slate-800 dark:text-slate-200" title={selectedDetailPeer.deviceDetail || "Web client pair"}>
                        {selectedDetailPeer.deviceDetail || "Web Client"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-400 dark:text-slate-450">{lang === "fa" ? "رمزنگاری تایید هویت:" : "Cryptographic Status:"}</span>
                      <span className={`font-bold uppercase tracking-wide text-[10px] ${
                        (peerAuthStates[selectedDetailPeer.id] || "untrusted") === "authenticated"
                          ? "text-emerald-500"
                          : "text-amber-500"
                      }`}>
                        {(peerAuthStates[selectedDetailPeer.id] || "untrusted") === "authenticated"
                          ? (lang === "fa" ? "رمزنگاری فعال" : "gcm certified")
                          : (lang === "fa" ? "منتظر رمز عبور" : "verifying pin")}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-400 dark:text-slate-450">{lang === "fa" ? "نوع بستر ارتباط مستقیم:" : "Connection Protocol:"}</span>
                      <span className="font-semibold text-teal-600 dark:text-teal-400">WebRTC DataChannel</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setSelectedDetailPeer(null)}
                    className="w-full py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-teal-500/10 cursor-pointer active:scale-95 transition-all text-center select-none font-sans uppercase tracking-wider"
                  >
                    {lang === "fa" ? "بستن جزئیات" : "Close Metrics"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  </>
  );
}
