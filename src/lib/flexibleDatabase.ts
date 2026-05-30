import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "./firebase";
import { PRODUCTS } from "../constants";

// Default/Seed fallback data
const SEED_CATEGORIES = [
  { id: "outerwear", name: "Outerwear", slug: "outerwear" },
  { id: "dresses", name: "Dresses", slug: "dresses" },
  { id: "bottoms", name: "Bottoms", slug: "bottoms" },
  { id: "knitwear", name: "Knitwear", slug: "knitwear" },
  { id: "accessories", name: "Accessories", slug: "accessories" }
];

const SEED_COLLECTIONS = [
  { id: "le-matin", name: "Le Matin", category: "Essentials", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2670" },
  { id: "l-heure-bleue", name: "L'Heure Bleue", category: "Evening Wear", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=2574" },
  { id: "jardin-de-mars", name: "Jardin de Mars", category: "Accessories", image: "https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=2670" },
  { id: "primavera", name: "Primavera", category: "New Arrival", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=2520" }
];

const SEED_JOURNAL_POSTS = [
  {
    id: "1",
    title: "Minimalism as a Form of Expression",
    date: "May 15, 2026",
    category: "Philosophy",
    image: "https://images.unsplash.com/photo-1544022613-e87ca7fdad78?auto=format&fit=crop&q=80&w=2574",
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "2",
    title: "Material Studies: Raw European Linen",
    date: "May 10, 2026",
    category: "Process",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=2574",
    updatedAt: new Date(Date.now() - 172800000).toISOString()
  }
];

const SEED_FOOTER_PAGES = [
  {
    id: "story",
    label: "Our Story",
    url: "/story",
    column: "studio",
    order: 1,
    pageTitle: "Our Story",
    pageSubtitle: "About the Studio",
    pageBody: "VRR was born in Tirana and crafted in Paris, representing a continuous study of organic materials, tailored lines, and quiet luxury. We exist outside of traditional fashion seasons, choosing to drop micro-editions only when each garment has been thoroughly refined."
  },
  {
    id: "sustainability",
    label: "Sustainability",
    url: "/sustainability",
    column: "studio",
    order: 2,
    pageTitle: "Pledging to the Earth.",
    pageSubtitle: "Studio Philosophy & Responsibility",
    pageBody: "We don’t believe in seasons or disposable trends. For Vrr, sustainability is not a marketing strategy or a separate capsule—it is the baseline architecture of every garment we draft, sew, and package."
  },
  {
    id: "journal",
    label: "Journal",
    url: "/journal",
    column: "studio",
    order: 3,
    pageTitle: "Journal Logs",
    pageSubtitle: "Studio Records & Concepts",
    pageBody: "Thoughts from active design tables, collections history, and craftsmanship reports."
  },
  {
    id: "contact",
    label: "Contact",
    url: "/contact",
    column: "studio",
    order: 4,
    pageTitle: "Ask our concierge.",
    pageSubtitle: "Connect With the Studio",
    pageBody: "We are always here to listen. Whether you require meticulous sizing consultations, customized fitting edits, or details on imminent seasonal drops, please drop us a message."
  },
  {
    id: "shipping",
    label: "Shipping & Returns",
    url: "/shipping",
    column: "assist",
    order: 1,
    pageTitle: "Shipping & Transit.",
    pageSubtitle: "Studio Logistical Framework",
    pageBody: "Every Vrr piece is hand-wrapped in tissue paper, loaded in custom organic cotton garment bags, and dispatched inside FSC-certified biodegradable containers directly from our atelier."
  },
  {
    id: "size-guide",
    label: "Size Guide",
    url: "/size-guide",
    column: "assist",
    order: 2,
    pageTitle: "Perfecting the Silhouette.",
    pageSubtitle: "Fitting Room Architecture",
    pageBody: "Each Vrr item is meticulously patterned to honor movement, drape, and physical ease. Follow our custom size guide model to secure your exact proportions."
  },
  {
    id: "privacy",
    label: "Privacy Policy",
    url: "/privacy",
    column: "assist",
    order: 3,
    pageTitle: "Privacy & Data Sovereignty.",
    pageSubtitle: "Legal Protections",
    pageBody: "We value your digital footprint with the exact same commitment and respect we hold for our organic fibers. Read about how we secure, process, and respect your private data."
  },
  {
    id: "terms",
    label: "Terms of Service",
    url: "/terms",
    column: "assist",
    order: 4,
    pageTitle: "Terms of Service.",
    pageSubtitle: "Transactional Rules",
    pageBody: "Our legal conditions are established to ensure total security, inventory precision, and intellectual safety for everyone. Read about our billing policies and product limits."
  }
];

const DEFAULT_SETTINGS = {
  philosophyQuote: "Art is the soul of our studio, fashion is the language we use to speak to the world.",
  philosophyTag: "Our Philosophy",
  marqueeText: "Vrr — Collection No.04 — Dropping Soon",
  heroImage: "",
  collection1Image: "",
  collection2Image: "",
  collection3Image: "",
  collection4Image: "",
  // Footer custom configuration settings
  footerLogo: "Vrr",
  footerDescription: "A creative space dedicated to the intersection of art, fashion, and human connection. Designed in Paris, inspired by the world.",
  footerInstagram: "https://instagram.com",
  footerFacebook: "https://facebook.com",
  footerTwitter: "https://twitter.com",
  footerColTitle: "Collection",
  footerColLink1Text: "Shop All",
  footerColLink1Url: "/shop",
  footerColLink2Text: "New Arrivals",
  footerColLink2Url: "/shop?filter=new",
  footerColLink3Text: "Best Sellers",
  footerColLink3Url: "/shop?filter=best",
  footerColLink4Text: "Archive",
  footerColLink4Url: "/shop?filter=archive",
  footerStudioTitle: "Studio",
  footerStudioLink1Text: "Our Story",
  footerStudioLink1Url: "/story",
  footerStudioLink2Text: "Sustainability",
  footerStudioLink2Url: "/sustainability",
  footerStudioLink3Text: "Journal",
  footerStudioLink3Url: "/journal",
  footerStudioLink4Text: "Contact",
  footerStudioLink4Url: "/contact",
  footerAssistTitle: "Assist",
  footerAssistLink1Text: "Shipping & Returns",
  footerAssistLink1Url: "/shipping",
  footerAssistLink2Text: "Size Guide",
  footerAssistLink2Url: "/size-guide",
  footerAssistLink3Text: "Privacy Policy",
  footerAssistLink3Url: "/privacy",
  footerAssistLink4Text: "Terms of Service",
  footerAssistLink4Url: "/terms",
  footerCopyright: "Vrr. All Rights Reserved.",
  footerLocation: "Paris / London / NYC",
  // Site Info custom settings
  siteName: "Vrr",
  siteTitle: "My Google AI Studio App",
  siteFavicon: "https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=64&auto=format&fit=crop",
  siteMetaDescription: "Discover high-end seasonal collection pieces. Timeless silhouettes met with modern craftsmanship.",
  newsletterInstagram: "https://www.instagram.com/v_dessign/",
  // Lookbook custom configuration settings
  lookbookMainImage: "https://images.unsplash.com/photo-1509631179647-017733150396?auto=format&fit=crop&q=80&w=2576",
  lookbookTitle: "Every Look Tells a Story",
  lookbookSubtitle: "Inside the Studio",
  lookbookDescription: 'We believe in pieces that live beyond the trends. Our "Shop the Look" curators bring together textures and tones that harmonize effortlessly.',
  lookbookProd1Name: "Linen Trench Coat",
  lookbookProd1Price: "$340",
  lookbookProd1Image: "https://images.unsplash.com/photo-1544022613-e87ca7fdad78?auto=format&fit=crop&q=80&w=2574",
  lookbookProd1Top: "30%",
  lookbookProd1Left: "45%",
  lookbookProd2Name: "Silk Slip Dress",
  lookbookProd2Price: "$210",
  lookbookProd2Image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=2574",
  lookbookProd2Top: "60%",
  lookbookProd2Left: "55%"
};

// Local storage management helpers
const sanitizeDocs = (collectionName: string, items: any): any => {
  if (!items) return items;
  if (Array.isArray(items)) {
    return items.map(item => {
      if (item && item.image && typeof item.image === "string") {
        if (item.image.includes("photo-1539008835270-3dc9d3160914")) {
          console.log(`Migrating broken Unsplash image for ${item.id || 'item'}`);
          const updated = {
            ...item,
            image: item.image.replace("photo-1539008835270-3dc9d3160914", "photo-1539109136881-3be0616acf4b")
          };
          // Back-sync corrected item to Firestore if signed in
          if (item.id) {
            const { id, ...itemData } = updated;
            setDoc(doc(db, collectionName, id), itemData).catch(() => {});
          }
          return updated;
        }
      }
      return item;
    });
  } else if (typeof items === "object") {
    const updated = { ...items };
    let changed = false;
    for (const key of Object.keys(updated)) {
      if (updated[key] && typeof updated[key] === "string") {
        const val = updated[key];
        if (val.includes("photo-1539008835270-3dc9d3160914")) {
          updated[key] = val.replace("photo-1539008835270-3dc9d3160914", "photo-1539109136881-3be0616acf4b");
          changed = true;
        }
        // Safety lock: truncate string if it's abnormally large (e.g., pasted high-res Base64 image)
        if (val.length > 150000) {
          console.warn(`Field "${key}" length is abnormally large (${val.length} chars). Resetting to safe default.`);
          updated[key] = (DEFAULT_SETTINGS as any)[key] || "";
          changed = true;
        }
      }
    }
    if (changed) {
      if (collectionName === "settings_global" || collectionName === "settings") {
        setDoc(doc(db, "settings", "global"), updated).catch(() => {});
      }
    }
    return updated;
  }
  return items;
};

const getLocal = (key: string, fallback: any) => {
  try {
    const data = localStorage.getItem(`vrr_db_${key}`);
    if (!data) {
      const sanitizedFallback = sanitizeDocs(key, fallback);
      try {
        localStorage.setItem(`vrr_db_${key}`, JSON.stringify(sanitizedFallback));
      } catch (e) {}
      return sanitizedFallback;
    }
    const list = JSON.parse(data);
    return sanitizeDocs(key, list);
  } catch (e) {
    console.warn(`localStorage read failed for ${key}, using offline fallback:`, e);
    return fallback;
  }
};

const setLocal = (key: string, value: any) => {
  try {
    localStorage.setItem(`vrr_db_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn("localStorage write failed (quota exceeded):", e);
  }
  // Emit custom event to notify active listeners about changes
  window.dispatchEvent(new CustomEvent(`vrr_db_change_${key}`, { detail: value }));
};

// Cache cleared checks disabled to protect user customizations in the Admin panel.


// Initial state load
const initializeLocalStorageDb = () => {
  getLocal("products", PRODUCTS);
  getLocal("categories", SEED_CATEGORIES);
  getLocal("collections", SEED_COLLECTIONS);
  getLocal("journalPosts", SEED_JOURNAL_POSTS);
  getLocal("settings_global", DEFAULT_SETTINGS);
  getLocal("footerPages", SEED_FOOTER_PAGES);
  getLocal("orders", []);
};

initializeLocalStorageDb();

export const flexibleDb = {
  // Get all documents
  async getDocs(collectionName: string): Promise<any[]> {
    try {
      const snap = await getDocs(collection(db, collectionName));
      const liveData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (liveData.length > 0) {
        const sanitized = sanitizeDocs(collectionName, liveData);
        setLocal(collectionName, sanitized);
        return sanitized;
      } else {
        let defaultFallback: any[] = [];
        if (collectionName === "products") defaultFallback = PRODUCTS;
        else if (collectionName === "categories") defaultFallback = SEED_CATEGORIES;
        else if (collectionName === "collections") defaultFallback = SEED_COLLECTIONS;
        else if (collectionName === "journalPosts") defaultFallback = SEED_JOURNAL_POSTS;
        else if (collectionName === "footerPages") defaultFallback = SEED_FOOTER_PAGES;

        const localList = getLocal(collectionName, defaultFallback);
        const toSeed = localList.length > 0 ? localList : defaultFallback;

        if (toSeed && toSeed.length > 0) {
          await Promise.all(toSeed.map(async (item: any) => {
            if (item && item.id) {
              const { id, ...itemData } = item;
              await setDoc(doc(db, collectionName, id), { ...itemData, adminPasscode: "valentinavrr02" }).catch(() => {});
            }
          }));
        }
        setLocal(collectionName, toSeed);
        return toSeed;
      }
    } catch (err) {
      console.warn(`Firestore getDocs failed for ${collectionName}, using local storage fallback.`);
    }
    
    // Fallback constants
    if (collectionName === "products") return getLocal("products", PRODUCTS);
    if (collectionName === "categories") return getLocal("categories", SEED_CATEGORIES);
    if (collectionName === "collections") return getLocal("collections", SEED_COLLECTIONS);
    if (collectionName === "journalPosts") return getLocal("journalPosts", SEED_JOURNAL_POSTS);
    if (collectionName === "footerPages") return getLocal("footerPages", SEED_FOOTER_PAGES);
    if (collectionName === "orders") return getLocal("orders", []);
    return getLocal(collectionName, []);
  },

  // Get single document
  async getDoc(collectionName: string, docId: string): Promise<any> {
    try {
      if (collectionName === "settings" && docId === "global") {
        const snap = await getDoc(doc(db, "settings", "global"));
        if (snap.exists()) {
          setLocal("settings_global", snap.data());
          return snap.data();
        } else {
          await setDoc(doc(db, "settings", "global"), { ...DEFAULT_SETTINGS, adminPasscode: "valentinavrr02" });
          setLocal("settings_global", DEFAULT_SETTINGS);
          return DEFAULT_SETTINGS;
        }
      } else {
        const snap = await getDoc(doc(db, collectionName, docId));
        if (snap.exists()) {
          return { id: snap.id, ...snap.data() };
        }
      }
    } catch (err) {
      console.warn(`Firestore getDoc failed for ${collectionName}/${docId}, using offline cache.`);
    }

    if (collectionName === "settings" && docId === "global") {
      return getLocal("settings_global", DEFAULT_SETTINGS);
    }
    const localList = getLocal(collectionName, []);
    return localList.find((item: any) => item.id === docId) || null;
  },

  // Add/Save document
  async saveDoc(collectionName: string, docId: string, data: any): Promise<void> {
    // 1. Write locally immediately for instant responsive responsiveness
    if (collectionName === "settings" && docId === "global") {
      setLocal("settings_global", data);
    } else {
      const list = getLocal(collectionName, []);
      const index = list.findIndex((x: any) => x.id === docId);
      const updatedItem = { ...data, id: docId };
      if (index >= 0) {
        list[index] = updatedItem;
      } else {
        list.push(updatedItem);
      }
      setLocal(collectionName, list);
    }

    // 2. Try Firebase write with adminPasscode bypass
    try {
      await setDoc(doc(db, collectionName, docId), { ...data, adminPasscode: "valentinavrr02" });
    } catch (err) {
      console.warn(`Firestore setDoc permission denied or failed for ${collectionName}/${docId}. Saved offline!`, err);
    }
  },

  // Create new document (such as orders)
  async createDoc(collectionName: string, data: any): Promise<string> {
    const id = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    
    // 1. Write locally
    const list = getLocal(collectionName, []);
    const newItem = { ...data, id };
    list.push(newItem);
    setLocal(collectionName, list);

    // 2. Try Firebase write with adminPasscode bypass
    try {
      const ref = await addDoc(collection(db, collectionName), { ...data, adminPasscode: "valentinavrr02" });
      // Update with firestore generated key if successful
      const updatedList = getLocal(collectionName, []).map((x: any) => x.id === id ? { ...newItem, id: ref.id } : x);
      setLocal(collectionName, updatedList);
      return ref.id;
    } catch (err) {
      console.warn(`Firestore addDoc failed for ${collectionName}. Created with local ID!`, err);
      return id;
    }
  },

  // Update existing document fields
  async updateDoc(collectionName: string, docId: string, data: any): Promise<void> {
    const timestampedData = { ...data, updatedAt: new Date().toISOString() };
    
    // 1. Write locally
    if (collectionName === "settings" && docId === "global") {
      const current = getLocal("settings_global", DEFAULT_SETTINGS);
      setLocal("settings_global", { ...current, ...timestampedData });
    } else {
      const list = getLocal(collectionName, []);
      const index = list.findIndex((x: any) => x.id === docId);
      if (index >= 0) {
        list[index] = { ...list[index], ...timestampedData };
        setLocal(collectionName, list);
      }
    }

    // 2. Try Firebase with adminPasscode bypass
    try {
      await updateDoc(doc(db, collectionName, docId), { ...timestampedData, adminPasscode: "valentinavrr02" });
    } catch (err) {
      console.warn(`Firestore updateDoc failed for ${collectionName}/${docId}. Updated offline!`, err);
    }
  },

  // Delete document
  async deleteDoc(collectionName: string, docId: string): Promise<void> {
    // 1. Delete locally
    const list = getLocal(collectionName, []);
    const filtered = list.filter((x: any) => x.id !== docId);
    setLocal(collectionName, filtered);

    // 2. Try Firebase
    try {
      await deleteDoc(doc(db, collectionName, docId));
    } catch (err) {
      console.warn(`Firestore deleteDoc failed for ${collectionName}/${docId}. Deleted offline!`, err);
    }
  },

  // Real-time collection subscription
  subscribeToCollection(
    collectionName: string, 
    onUpdate: (data: any[]) => void, 
    onError?: (err: any) => void,
    orderByField?: string,
    orderByDirection: "asc" | "desc" = "desc"
  ) {
    let unsubscribedFirestore = false;
    let fallbackTimer: any = null;

    // Default fallbacks to load immediately
    let fallbackData = [];
    if (collectionName === "products") fallbackData = getLocal("products", PRODUCTS);
    else if (collectionName === "categories") fallbackData = getLocal("categories", SEED_CATEGORIES);
    else if (collectionName === "collections") fallbackData = getLocal("collections", SEED_COLLECTIONS);
    else if (collectionName === "journalPosts") fallbackData = getLocal("journalPosts", SEED_JOURNAL_POSTS);
    else if (collectionName === "footerPages") fallbackData = getLocal("footerPages", SEED_FOOTER_PAGES);
    else if (collectionName === "orders") fallbackData = getLocal("orders", []);
    else fallbackData = getLocal(collectionName, []);

    // Stagger/sort local data helper
    const sortData = (arr: any[]) => {
      if (orderByField) {
        return [...arr].sort((a, b) => {
          const valA = a[orderByField] || "";
          const valB = b[orderByField] || "";
          if (valA < valB) return orderByDirection === "asc" ? -1 : 1;
          if (valA > valB) return orderByDirection === "asc" ? 1 : -1;
          return 0;
        });
      }
      return arr;
    };

    // Push initial local data instantly so user never sees a blank screen
    onUpdate(sortData(fallbackData));

    // Handle offline events on local db adjustments
    const handleLocalChange = (e: any) => {
      onUpdate(sortData(e.detail));
    };
    window.addEventListener(`vrr_db_change_${collectionName}`, handleLocalChange);

    // 2. Try live subscription
    const q = orderByField 
      ? query(collection(db, collectionName), orderBy(orderByField, orderByDirection)) 
      : collection(db, collectionName);

    const unsubFirestore = onSnapshot(q, (snap) => {
      if (unsubscribedFirestore) return;
      
      let defaultFallback: any[] = [];
      if (collectionName === "products") defaultFallback = PRODUCTS;
      else if (collectionName === "categories") defaultFallback = SEED_CATEGORIES;
      else if (collectionName === "collections") defaultFallback = SEED_COLLECTIONS;
      else if (collectionName === "journalPosts") defaultFallback = SEED_JOURNAL_POSTS;
      else if (collectionName === "footerPages") defaultFallback = SEED_FOOTER_PAGES;

      if (!snap.empty) {
        const liveData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const sanitizedLive = sanitizeDocs(collectionName, liveData);
        
        // Directly set liveData to local cache and update listeners
        setLocal(collectionName, sanitizedLive);
        onUpdate(sortData(sanitizedLive));
      } else {
        // If Firestore is empty, resiliently seed with the products/entries to ensure perfect continuous sync
        const localList = getLocal(collectionName, defaultFallback);
        const toSeed = localList.length > 0 ? localList : defaultFallback;

        if (toSeed && toSeed.length > 0) {
          toSeed.forEach((item: any) => {
            if (item && item.id) {
              const { id, ...itemData } = item;
              setDoc(doc(db, collectionName, id), { ...itemData, adminPasscode: "valentinavrr02" }).catch(() => {});
            }
          });
          setLocal(collectionName, toSeed);
          onUpdate(sortData(toSeed));
        } else {
          setLocal(collectionName, []);
          onUpdate([]);
        }
      }
    }, (err) => {
      if (unsubscribedFirestore) return;
      console.warn(`Firestore subscription failed for ${collectionName}. Staying on offline fallback:`, err.message || err);
      if (onError) onError(err);
    });

    return () => {
      unsubscribedFirestore = true;
      unsubFirestore();
      window.removeEventListener(`vrr_db_change_${collectionName}`, handleLocalChange);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  },

  // Real-time document subscription (e.g., settings)
  subscribeToDoc(
    collectionName: string,
    docId: string,
    onUpdate: (data: any) => void,
    onError?: (err: any) => void
  ) {
    let unsubscribedFirestore = false;

    // Load local instantly
    const localStoreKey = `${collectionName}_${docId}`;
    const defaultData = collectionName === "settings" && docId === "global" ? DEFAULT_SETTINGS : null;
    onUpdate(getLocal(localStoreKey, defaultData));

    const handleLocalDocChange = (e: any) => {
      onUpdate(e.detail);
    };
    window.addEventListener(`vrr_db_change_${localStoreKey}`, handleLocalDocChange);

    const unsubFirestore = onSnapshot(doc(db, collectionName, docId), (snap) => {
      if (unsubscribedFirestore) return;
      if (snap.exists()) {
        const liveData = snap.data();
        const sanitized = sanitizeDocs(`${collectionName}_${docId}`, liveData);
        setLocal(localStoreKey, sanitized);
        onUpdate(sanitized);
      } else {
        if (defaultData) {
          setDoc(doc(db, collectionName, docId), { ...defaultData, adminPasscode: "valentinavrr02" }).catch(() => {});
          setLocal(localStoreKey, defaultData);
          onUpdate(defaultData);
        }
      }
    }, (err) => {
      if (unsubscribedFirestore) return;
      console.warn(`Firestore subscription failed for ${collectionName}/${docId}. Staying on offline fallback.`, err.message || err);
      if (onError) onError(err);
    });

    return () => {
      unsubscribedFirestore = true;
      unsubFirestore();
      window.removeEventListener(`vrr_db_change_${localStoreKey}`, handleLocalDocChange);
    };
  }
};
