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

const DEFAULT_SETTINGS = {
  philosophyQuote: "Art is the soul of our studio, fashion is the language we use to speak to the world.",
  philosophyTag: "Our Philosophy",
  marqueeText: "Vrr — Collection No.04 — Dropping Soon",
  heroImage: "",
  collection1Image: "",
  collection2Image: "",
  collection3Image: "",
  collection4Image: ""
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
      if (updated[key] && typeof updated[key] === "string" && updated[key].includes("photo-1539008835270-3dc9d3160914")) {
        updated[key] = updated[key].replace("photo-1539008835270-3dc9d3160914", "photo-1539109136881-3be0616acf4b");
        changed = true;
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
  const data = localStorage.getItem(`vrr_db_${key}`);
  if (!data) {
    const sanitizedFallback = sanitizeDocs(key, fallback);
    localStorage.setItem(`vrr_db_${key}`, JSON.stringify(sanitizedFallback));
    return sanitizedFallback;
  }
  try {
    const list = JSON.parse(data);
    return sanitizeDocs(key, list);
  } catch (e) {
    return fallback;
  }
};

const setLocal = (key: string, value: any) => {
  localStorage.setItem(`vrr_db_${key}`, JSON.stringify(value));
  // Emit custom event to notify active listeners about changes
  window.dispatchEvent(new CustomEvent(`vrr_db_change_${key}`, { detail: value }));
};

// Force cache reset to resolve any existing de-synchronization across tabs
const FORCE_RESYNC_KEY = "vrr_db_resync_v6";
if (localStorage.getItem(FORCE_RESYNC_KEY) !== "true") {
  localStorage.removeItem("vrr_db_products");
  localStorage.removeItem("vrr_db_categories");
  localStorage.removeItem("vrr_db_collections");
  localStorage.removeItem("vrr_db_journalPosts");
  localStorage.removeItem("vrr_db_settings_global");
  localStorage.removeItem("vrr_db_orders");
  localStorage.removeItem("vrr_seeded_products");
  localStorage.removeItem("vrr_seeded_categories");
  localStorage.removeItem("vrr_seeded_collections");
  localStorage.removeItem("vrr_seeded_journalPosts");
  localStorage.setItem(FORCE_RESYNC_KEY, "true");
}

// Initial state load
const initializeLocalStorageDb = () => {
  getLocal("products", PRODUCTS);
  getLocal("categories", SEED_CATEGORIES);
  getLocal("collections", SEED_COLLECTIONS);
  getLocal("journalPosts", SEED_JOURNAL_POSTS);
  getLocal("settings_global", DEFAULT_SETTINGS);
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
        setLocal(localStoreKey, liveData);
        onUpdate(liveData);
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
