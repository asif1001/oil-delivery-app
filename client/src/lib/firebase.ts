import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  where,
  writeBatch,
  addDoc,
  Timestamp
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { deleteObject } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyChkqfXWJqQr3wbN8jL3qAkmKQEz5Mdr7o",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "oil-delivery-6bcc4"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "oil-delivery-6bcc4",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "oil-delivery-6bcc4"}.firebasestorage.app`,
  messagingSenderId: "136339484143",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:136339484143:web:7b9c14cd8f5a5c8d5e7b8f",
  measurementId: "G-KM58SN9WYL"
};

// Initialize Firebase with enhanced error handling
let app;
try {
  // Validate required config
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
    console.error('Missing Firebase configuration:', {
      hasApiKey: !!firebaseConfig.apiKey,
      hasProjectId: !!firebaseConfig.projectId,
      hasAppId: !!firebaseConfig.appId
    });
    throw new Error('Firebase configuration is incomplete');
  }
  
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  console.log('Firebase initialized successfully with project:', firebaseConfig.projectId);
  console.log('Firebase config used:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    hasApiKey: !!firebaseConfig.apiKey,
    hasAppId: !!firebaseConfig.appId
  });
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Create a minimal error display instead of crashing
  document.body.innerHTML = `
    <div style="
      min-height: 100vh; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      background: linear-gradient(to bottom right, #3b82f6, #8b5cf6);
      font-family: system-ui, -apple-system, sans-serif;
    ">
      <div style="
        background: white; 
        padding: 2rem; 
        border-radius: 0.5rem; 
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        text-align: center;
        max-width: 400px;
      ">
        <h1 style="color: #dc2626; margin: 0 0 1rem 0;">Configuration Error</h1>
        <p style="color: #374151; margin: 0 0 1rem 0;">
          Firebase configuration is missing or invalid. Please check the deployment setup.
        </p>
        <p style="color: #6b7280; font-size: 0.875rem; margin: 0;">
          Contact administrator for assistance.
        </p>
      </div>
    </div>
  `;
  throw error;
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service  
export const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

// Watermark utility function to add branch name and timestamp to image
const addWatermarkToImage = async (imageUrl: string, branchName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.crossOrigin = 'anonymous';
    img.setAttribute('crossorigin', 'anonymous');
    
    img.onload = () => {
      try {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the original image
        ctx!.drawImage(img, 0, 0);
        
        // Prepare watermark text
        const now = new Date();
        const timestamp = now.toLocaleDateString() + ', ' + now.toLocaleTimeString();
        const watermarkText = `${branchName} | ${timestamp}`;
        
        // Set up text styling
        const fontSize = Math.max(16, canvas.width * 0.03);
        ctx!.font = `bold ${fontSize}px Arial`;
        ctx!.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx!.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        ctx!.lineWidth = 2;
        
        // Position text at bottom-left with padding
        const x = 20;
        const y = canvas.height - 20;
        
        // Draw text with outline
        ctx!.strokeText(watermarkText, x, y);
        ctx!.fillText(watermarkText, x, y);
        
        // Convert to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const newImageUrl = URL.createObjectURL(blob);
            resolve(newImageUrl);
          } else {
            reject(new Error('Failed to create watermarked image blob'));
          }
        }, 'image/jpeg', 0.9);
        
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image for watermarking'));
    img.src = imageUrl;
  });
};

// Function to update photos with correct watermarks after transaction is saved
// Function to download all photos in a date range as ZIP
export const downloadPhotosInDateRange = async (startDate: string, endDate: string): Promise<void> => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include full end date

    console.log('📅 Fetching transactions from', start, 'to', end);

    // Get all transactions and filter manually since Firestore date queries can be problematic
    const allTransactionsQuery = query(collection(db, 'transactions'));
    const allSnapshot = await getDocs(allTransactionsQuery);
    const allTransactions = allSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];

    console.log('📊 Total transactions found:', allTransactions.length);

    // Filter transactions by date manually to handle different timestamp fields
    const transactions = allTransactions.filter(transaction => {
      const transactionDate = new Date(
        transaction.timestamp?.toDate?.() || 
        transaction.timestamp || 
        transaction.createdAt?.toDate?.() ||
        transaction.createdAt ||
        transaction.actualDeliveryStartTime || 
        0
      );
      
      const isInRange = transactionDate >= start && transactionDate <= end;
      if (isInRange) {
        console.log('✅ Found transaction in range:', {
          id: transaction.id,
          date: transactionDate,
          photos: transaction.photos ? Object.keys(transaction.photos).length : 0
        });
      }
      return isInRange;
    });

    console.log(`📦 Found ${transactions.length} transactions with photos`);

    if (transactions.length === 0) {
      throw new Error('No transactions found in the selected date range');
    }

    // Collect all photos with metadata
    const photoData: Array<{
      url: string;
      filename: string;
      transactionId: string;
      branchName: string;
      photoType: string;
      timestamp: string;
    }> = [];

    for (const transaction of transactions) {
      if (transaction.photos) {
        for (const [photoType, photoUrl] of Object.entries(transaction.photos)) {
          if (typeof photoUrl === 'string' && photoUrl) {
            const transactionDate = new Date(
              transaction.timestamp?.toDate?.() || 
              transaction.timestamp || 
              transaction.createdAt?.toDate?.() ||
              transaction.createdAt ||
              transaction.actualDeliveryStartTime || 
              0
            );
            const timestamp = transactionDate.toISOString().split('T')[0]; // YYYY-MM-DD format
            
            const filename = `${timestamp}_${transaction.branchName || 'Unknown'}_${photoType}_${transaction.id}.jpg`
              .replace(/[^a-zA-Z0-9._-]/g, '_'); // Clean filename
            
            photoData.push({
              url: photoUrl,
              filename,
              transactionId: transaction.id,
              branchName: transaction.branchName || 'Unknown',
              photoType,
              timestamp
            });
          }
        }
      }
    }

    console.log(`🖼️ Collected ${photoData.length} photos for download`);

    if (photoData.length === 0) {
      throw new Error('No photos found in the selected date range');
    }

    // Create and download ZIP file
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    // Add photos to ZIP
    for (const photo of photoData) {
      try {
        console.log(`📥 Downloading: ${photo.filename}`);
        const response = await fetch(photo.url);
        const blob = await response.blob();
        zip.file(photo.filename, blob);
      } catch (error) {
        console.error(`❌ Failed to download ${photo.filename}:`, error);
        // Continue with other photos
      }
    }

    // Generate ZIP file
    console.log('🗜️ Generating ZIP file...');
    const zipBlob = await zip.generateAsync({ type: 'blob' });

    // Download ZIP file
    const zipFilename = `photos_${startDate}_to_${endDate}.zip`;
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = zipFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('✅ ZIP download completed');

  } catch (error) {
    console.error('❌ Photo download error:', error);
    throw error;
  }
};

// Function to delete all photos in a date range
export const deletePhotosInDateRange = async (startDate: string, endDate: string): Promise<number> => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include full end date

    console.log('🗑️ Fetching transactions for deletion from', start, 'to', end);

    // Get all transactions and filter manually 
    const allTransactionsQuery = query(collection(db, 'transactions'));
    const allSnapshot = await getDocs(allTransactionsQuery);
    const allTransactions = allSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];

    // Filter transactions by date manually to handle different timestamp fields
    const transactions = allTransactions.filter(transaction => {
      const transactionDate = new Date(
        transaction.timestamp?.toDate?.() || 
        transaction.timestamp || 
        transaction.createdAt?.toDate?.() ||
        transaction.createdAt ||
        transaction.actualDeliveryStartTime || 
        0
      );
      
      return transactionDate >= start && transactionDate <= end;
    });

    console.log(`🔍 Found ${transactions.length} transactions to process`);

    let deletedCount = 0;

    for (const transaction of transactions) {
      if (transaction.photos) {
        for (const [photoType, photoUrl] of Object.entries(transaction.photos)) {
          if (typeof photoUrl === 'string' && photoUrl) {
            try {
              // Extract file path from Firebase Storage URL
              const url = new URL(photoUrl);
              const pathMatch = url.pathname.match(/\/o\/(.+?)\?/);
              if (pathMatch) {
                const filePath = decodeURIComponent(pathMatch[1]);
                
                // Check if path is in either delivery-photos or loading-photos folder
                if (filePath.startsWith('delivery-photos/') || filePath.startsWith('loading-photos/')) {
                  const fileRef = ref(storage, filePath);
                  
                  console.log(`🗑️ Deleting from storage: ${filePath}`);
                  await deleteObject(fileRef);
                  deletedCount++;
                } else {
                  console.log(`⚠️ Skipping file not in expected folders: ${filePath}`);
                }
              }
            } catch (error) {
              console.error(`❌ Failed to delete photo from ${photoType}:`, error);
              // Continue with other photos
            }
          }
        }

        // Update transaction to remove photo URLs
        try {
          const transactionRef = doc(db, 'transactions', transaction.id);
          await updateDoc(transactionRef, { photos: {} });
          console.log(`✅ Cleared photo references from transaction ${transaction.id}`);
        } catch (error) {
          console.error(`❌ Failed to update transaction ${transaction.id}:`, error);
        }
      }
    }

    console.log(`✅ Deleted ${deletedCount} photos from Firebase Storage`);
    return deletedCount;

  } catch (error) {
    console.error('❌ Photo deletion error:', error);
    throw error;
  }
};

export const updatePhotosWithCorrectWatermarks = async (
  transaction: any,
  branchName: string
): Promise<any> => {
  try {
    console.log('🔄 Starting post-transaction watermark update for:', branchName);
    
    const photos = transaction.photos;
    const updatedPhotos: any = {};
    
    // Update each photo with correct watermark  
    for (const [photoType, photoUrl] of Object.entries(photos)) {
      if (typeof photoUrl === 'string') {
        console.log(`🖼️ Re-watermarking ${photoType} with correct branch: ${branchName}`);
        
        try {
          // Add correct watermark directly to the Firebase Storage URL
          const watermarkedImageUrl = await addWatermarkToImage(photoUrl, branchName);
          
          // Convert watermarked image to blob for upload
          const watermarkedResponse = await fetch(watermarkedImageUrl);
          const watermarkedBlob = await watermarkedResponse.blob();
          
          // Upload new watermarked image
          const newPhotoUrl = await uploadPhotoToFirebaseStorage(watermarkedBlob);
          updatedPhotos[photoType] = newPhotoUrl;
          
          // Clean up temporary URL
          URL.revokeObjectURL(watermarkedImageUrl);
          
          console.log(`✅ Updated ${photoType} with correct watermark`);
          
        } catch (photoError) {
          console.error(`❌ Failed to update ${photoType}:`, photoError);
          // Keep original photo if watermarking fails
          updatedPhotos[photoType] = photoUrl;
        }
      } else {
        // Keep photos that don't need updating
        updatedPhotos[photoType] = photoUrl;
      }
    }
    
    // Update transaction with new photo URLs
    const updatedTransaction = {
      ...transaction,
      photos: updatedPhotos
    };
    
    // Update in Firestore
    const transactionRef = doc(db, 'transactions', transaction.id || `${transaction.loadSessionId}_${Date.now()}`);
    await updateDoc(transactionRef, { photos: updatedPhotos });
    
    console.log('✅ All photos updated with correct watermarks');
    return updatedTransaction;
    
  } catch (error) {
    console.error('❌ Failed to update photos with correct watermarks:', error);
    // Return original transaction if update fails
    return transaction;
  }
};

// Add retry logic for Firebase operations
const retryOperation = async (operation: () => Promise<any>, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      console.log(`Attempt ${i + 1} failed:`, error.code);
      
      if (error.code === 'unavailable' && i < maxRetries - 1) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        continue;
      }
      throw error;
    }
  }
};

/**
 * Upload a photo to Firebase Storage
 * @param file - The image file or blob to upload
 * @param folder - The folder path in storage (e.g., 'photos', 'delivery-photos')
 * @returns Promise<string> - The download URL of the uploaded image
 */
// Compress image before upload to reduce storage size while maintaining quality
const compressImage = async (file: Blob, quality: number = 0.8, maxWidth: number = 1200): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        }
      }, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export const uploadPhotoToFirebaseStorage = async (file: File | Blob, folder: string = 'photos'): Promise<string> => {
  try {
    // Compress image before upload to reduce storage size
    const compressedFile = await compressImage(file, 0.8, 1200);
    
    // Generate unique filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${timestamp}-${Math.random().toString(36).substr(2, 9)}.jpg`;
    const filePath = `${folder}/${filename}`;
    
    // Create storage reference
    const storageRef = ref(storage, filePath);
    
    // Upload compressed file
    console.log('Uploading compressed photo to Firebase Storage...');
    const snapshot = await uploadBytes(storageRef, compressedFile);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Compressed photo uploaded successfully:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading photo to Firebase Storage:', error);
    throw new Error('Failed to upload photo. Please try again.');
  }
};

// Function to get photo statistics in a date range
export const getPhotoStatistics = async (startDate: string, endDate: string): Promise<{ photoCount: number, transactionCount: number }> => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    console.log('🔍 Getting photo statistics from', start, 'to', end);

    // Get all transactions without date filter first to debug
    const allTransactionsQuery = query(collection(db, 'transactions'));
    const allSnapshot = await getDocs(allTransactionsQuery);
    const allTransactions = allSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];

    console.log('📊 Total transactions in database:', allTransactions.length);
    
    // Log first few transactions to see their structure
    if (allTransactions.length > 0) {
      console.log('📄 Sample transaction structure:', {
        timestamp: allTransactions[0].timestamp,
        createdAt: allTransactions[0].createdAt,
        actualDeliveryStartTime: allTransactions[0].actualDeliveryStartTime,
        photos: allTransactions[0].photos ? Object.keys(allTransactions[0].photos) : 'No photos'
      });
    }

    // Filter transactions by date manually to handle different timestamp fields
    const transactions = allTransactions.filter(transaction => {
      const transactionDate = new Date(
        transaction.timestamp?.toDate?.() || 
        transaction.timestamp || 
        transaction.createdAt?.toDate?.() ||
        transaction.createdAt ||
        transaction.actualDeliveryStartTime || 
        0
      );
      
      const isInRange = transactionDate >= start && transactionDate <= end;
      if (isInRange) {
        console.log('✅ Transaction in range:', {
          id: transaction.id,
          date: transactionDate,
          photos: transaction.photos ? Object.keys(transaction.photos).length : 0
        });
      }
      return isInRange;
    });

    let photoCount = 0;
    for (const transaction of transactions) {
      if (transaction.photos) {
        photoCount += Object.keys(transaction.photos).length;
      }
    }

    console.log(`📸 Found ${photoCount} photos in ${transactions.length} transactions`);

    return {
      photoCount,
      transactionCount: transactions.length
    };
  } catch (error) {
    console.error('Error getting photo statistics:', error);
    return { photoCount: 0, transactionCount: 0 };
  }
};



// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Save user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    }, { merge: true });
    
    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Get user data from Firestore with retry logic
export const getUserData = async (uid: string) => {
  return retryOperation(async () => {
    console.log('Fetching user data for UID:', uid);
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('Found user data:', userData);
      return userData;
    }
    console.log('No user document found for UID:', uid);
    return null;
  });
};

// Alias for getUserData for compatibility
export const getUserByUid = getUserData;

// Email/password authentication with retry logic
export const signInWithEmail = async (email: string, password: string) => {
  return retryOperation(async () => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Check if user exists in Firestore, if not create them
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // Create new user record with role based on email
      const role = email.toLowerCase().includes('admin') ? 'admin' : 'driver';
      
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        role: role,
        displayName: user.displayName || email.split('@')[0],
        photoURL: user.photoURL,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        active: true
      });
    } else {
      // Update last login time for existing user
      await setDoc(doc(db, 'users', user.uid), {
        lastLoginAt: new Date(),
      }, { merge: true });
    }
    
    return user;
  });
};

// Create user with email and password (for first-time login)
export const createUserWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Determine role based on email - admin emails contain 'admin'
    const role = email.toLowerCase().includes('admin') ? 'admin' : 'driver';
    
    // Save user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      role: role,
      displayName: user.displayName || email.split('@')[0],
      photoURL: user.photoURL,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      active: true
    }, { merge: true });
    
    return user;
  } catch (error) {
    console.error('Error creating user with email:', error);
    throw error;
  }
};

// Get deliveries for a specific driver
export const getUserDeliveries = async (driverId: string) => {
  try {
    // In a real app, this would query Firestore
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('Error getting user deliveries:', error);
    return [];
  }
};

// Get complaints for a specific driver
export const getUserComplaints = async (driverId: string) => {
  try {
    // In a real app, this would query Firestore
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('Error getting user complaints:', error);
    return [];
  }
};

// Admin functions
export const getAllDeliveries = async () => {
  try {
    // In a real app, this would query Firestore
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('Error getting all deliveries:', error);
    return [];
  }
};

export const getAllComplaints = async () => {
  try {
    // In a real app, this would query Firestore
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('Error getting all complaints:', error);
    return [];
  }
};

export const getAllUsers = async () => {
  try {
    const usersCollection = collection(db, 'users');
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};

// Create new driver account (for admin)
export const createDriverAccount = async (driverData: any) => {
  try {
    // Create Firebase Auth user with email and password
    const result = await createUserWithEmailAndPassword(auth, driverData.email, driverData.password);
    const user = result.user;
    
    // Create user document in Firestore with all driver data
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      role: 'driver',
      displayName: driverData.displayName, // This is the full name/username
      photoURL: user.photoURL,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      active: true,
      empNo: driverData.empNo,
      driverLicenceNo: driverData.driverLicenceNo,
      tankerLicenceNo: driverData.tankerLicenceNo || driverData.driverLicenceNo, // backward compatibility
      licenceExpiryDate: driverData.licenceExpiryDate
    });
    
    return user;
  } catch (error: any) {
    console.error('Error creating driver account:', error);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email is already registered. Please use a different email address.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password is too weak. Please choose a stronger password.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address format.');
    }
    throw error;
  }
};

// Update driver data (for admin)
export const updateDriverData = async (uid: string, updateData: any) => {
  try {
    // Update Firestore document
    await updateDoc(doc(db, 'users', uid), {
      ...updateData,
      updatedAt: new Date()
    });
    
    // If email is being updated, we need to update Firebase Auth as well
    // Note: This would require Firebase Admin SDK on backend for security
    // For now, we'll just update Firestore
    
    return true;
  } catch (error: any) {
    console.error('Error updating driver data:', error);
    throw error;
  }
};

// Delete driver account (for admin) - removes both Auth and Firestore
export const deleteDriverAccount = async (uid: string) => {
  try {
    // First delete from Firestore
    await deleteDoc(doc(db, 'users', uid));
    
    // Note: Deleting from Firebase Auth requires Admin SDK on backend
    // The backend should handle Firebase Auth user deletion
    // For now, we'll mark as deleted in Firestore
    
    return true;
  } catch (error: any) {
    console.error('Error deleting driver account:', error);
    throw error;
  }
};

// Change driver password (for admin) - requires backend implementation
export const changeDriverPassword = async (uid: string, newPassword: string) => {
  try {
    // This requires Firebase Admin SDK and should be implemented on backend
    // We'll create an API endpoint for this
    const response = await fetch('/api/admin/change-driver-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid,
        newPassword
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to change password');
    }
    
    return true;
  } catch (error: any) {
    console.error('Error changing driver password:', error);
    throw error;
  }
};

// Branch management functions
export const saveBranch = async (branchData: any) => {
  try {
    const branchRef = doc(collection(db, 'branches'));
    const branchWithId = {
      ...branchData,
      id: branchRef.id,
      active: true,
      createdAt: new Date()
    };
    await setDoc(branchRef, branchWithId);
    return branchWithId;
  } catch (error) {
    console.error('Error saving branch:', error);
    throw error;
  }
};

export const getAllBranches = async () => {
  try {
    const branchesCollection = collection(db, 'branches');
    const snapshot = await getDocs(branchesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
  } catch (error) {
    console.error('Error getting all branches:', error);
    return [];
  }
};

export const updateBranch = async (id: string, branchData: any) => {
  try {
    const branchRef = doc(db, 'branches', id);
    await updateDoc(branchRef, branchData);
  } catch (error) {
    console.error('Error updating branch:', error);
    throw error;
  }
};

export const deleteBranch = async (id: string) => {
  try {
    const batch = writeBatch(db);
    
    // Delete the branch
    const branchRef = doc(db, 'branches', id);
    batch.delete(branchRef);
    
    // Delete related transactions
    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('branchId', '==', id)
    );
    const transactionsSnapshot = await getDocs(transactionsQuery);
    transactionsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    // Delete related deliveries
    const deliveriesQuery = query(
      collection(db, 'deliveries'),
      where('branchId', '==', id)
    );
    const deliveriesSnapshot = await getDocs(deliveriesQuery);
    deliveriesSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`Branch ${id} and all related records deleted successfully`);
  } catch (error) {
    console.error('Error deleting branch with cascading delete:', error);
    throw error;
  }
};

// Oil type management functions
export const saveOilType = async (oilTypeData: any) => {
  try {
    const oilTypeRef = doc(collection(db, 'oilTypes'));
    const oilTypeWithId = {
      ...oilTypeData,
      id: oilTypeRef.id,
      active: true,
      createdAt: new Date()
    };
    await setDoc(oilTypeRef, oilTypeWithId);
    return oilTypeWithId;
  } catch (error) {
    console.error('Error saving oil type:', error);
    throw error;
  }
};

export const getAllOilTypes = async () => {
  try {
    const oilTypesCollection = collection(db, 'oilTypes');
    const snapshot = await getDocs(oilTypesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
  } catch (error) {
    console.error('Error getting all oil types:', error);
    return [];
  }
};

export const updateOilType = async (id: string, oilTypeData: any) => {
  try {
    const oilTypeRef = doc(db, 'oilTypes', id);
    await updateDoc(oilTypeRef, oilTypeData);
  } catch (error) {
    console.error('Error updating oil type:', error);
    throw error;
  }
};

export const deleteOilType = async (id: string) => {
  try {
    const batch = writeBatch(db);
    
    // Delete the oil type
    const oilTypeRef = doc(db, 'oilTypes', id);
    batch.delete(oilTypeRef);
    
    // Delete related transactions
    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('oilTypeId', '==', id)
    );
    const transactionsSnapshot = await getDocs(transactionsQuery);
    transactionsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    // Delete related load sessions
    const loadSessionsQuery = query(
      collection(db, 'loadSessions'),
      where('oilTypeId', '==', id)
    );
    const loadSessionsSnapshot = await getDocs(loadSessionsQuery);
    loadSessionsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    // Delete related deliveries
    const deliveriesQuery = query(
      collection(db, 'deliveries'),
      where('oilTypeId', '==', id)
    );
    const deliveriesSnapshot = await getDocs(deliveriesQuery);
    deliveriesSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`Oil type ${id} and all related records deleted successfully`);
  } catch (error) {
    console.error('Error deleting oil type with cascading delete:', error);
    throw error;
  }
};

// Driver management functions
export const updateDriver = async (id: string, driverData: any) => {
  try {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, driverData);
  } catch (error) {
    console.error('Error updating driver:', error);
    throw error;
  }
};

export const deleteDriver = async (id: string) => {
  try {
    const userRef = doc(db, 'users', id);
    await deleteDoc(userRef);
  } catch (error) {
    console.error('Error deleting driver:', error);
    throw error;
  }
};

// Task management functions
export const saveTask = async (taskData: any) => {
  try {
    console.log('Creating task with data:', taskData);
    
    // Validate required fields
    if (!taskData.title || !taskData.dueDate) {
      throw new Error('Title and due date are required');
    }
    
    const taskRef = doc(collection(db, 'tasks'));
    const taskWithId = {
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      status: 'pending',
      assignedTo: taskData.assignedTo || null,
      id: taskRef.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      dueDate: Timestamp.fromDate(taskData.dueDate)
    };
    
    console.log('Saving task to Firestore:', taskWithId);
    await setDoc(taskRef, taskWithId);
    console.log('Task saved successfully');
    
    return {
      ...taskWithId,
      createdAt: taskWithId.createdAt.toDate(),
      updatedAt: taskWithId.updatedAt.toDate(),
      dueDate: taskWithId.dueDate.toDate()
    };
  } catch (error) {
    console.error('Error saving task:', error);
    throw error;
  }
};

export const getAllTasks = async () => {
  try {
    const tasksCollection = collection(db, 'tasks');
    const q = query(tasksCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        // Convert Firestore Timestamps to Date objects
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        dueDate: data.dueDate?.toDate() || new Date()
      };
    });
  } catch (error) {
    console.error('Error getting all tasks:', error);
    return [];
  }
};

export const updateTask = async (id: string, taskData: any) => {
  try {
    const taskRef = doc(db, 'tasks', id);
    const updateData = {
      ...taskData,
      updatedAt: Timestamp.now()
    };
    // Convert dueDate to Timestamp if it's provided and is a Date
    if (taskData.dueDate && taskData.dueDate instanceof Date) {
      updateData.dueDate = Timestamp.fromDate(taskData.dueDate);
    }
    await updateDoc(taskRef, updateData);
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (id: string) => {
  try {
    const taskRef = doc(db, 'tasks', id);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Helper function to get current user ID
const getCurrentUserId = () => {
  return auth.currentUser?.uid || 'anonymous';
};

// Load Session and Transaction Management Functions
export const createLoadSession = async (loadSessionData: any) => {
  try {
    // Always create new load session regardless of existing balance
    const loadSessionRef = doc(collection(db, 'loadSessions'));
    const loadSessionId = `LS_${Date.now()}_${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    const loadSessionWithId = {
      ...loadSessionData,
      id: loadSessionRef.id,
      loadSessionId: loadSessionId,
      status: 'active',
      createdAt: new Date(),
      timestamp: new Date(),
      createdBy: getCurrentUserId(),
      remainingLiters: loadSessionData.totalLoadedLiters,
      loadCount: 1
    };
    
    await setDoc(loadSessionRef, loadSessionWithId);
    
    // Save to transactions collection for tracking
    await saveTransaction({
      type: 'loading',
      loadSessionId: loadSessionId,
      oilTypeId: loadSessionData.oilTypeId,
      oilTypeName: loadSessionData.oilTypeName,
      quantity: loadSessionData.totalLoadedLiters,
      location: loadSessionData.loadLocationId,
      meterReading: loadSessionData.loadMeterReading,
      photos: {
        meterReadingPhoto: loadSessionData.meterReadingPhoto
      },
      timestamp: new Date(),
      driverUid: getCurrentUserId()
    });
    
    console.log('New load session created in Firestore:', loadSessionWithId);
    return loadSessionWithId;
  } catch (error) {
    console.error('Error creating load session:', error);
    throw error;
  }
};

export const saveTransaction = async (transactionData: any) => {
  try {
    const transactionRef = doc(collection(db, 'transactions'));
    const transactionWithId = {
      ...transactionData,
      id: transactionRef.id,
      timestamp: new Date(),
      createdAt: new Date()
    };
    
    await setDoc(transactionRef, transactionWithId);
    console.log('Transaction saved to Firestore:', transactionWithId);
    return transactionWithId;
  } catch (error) {
    console.error('Error saving transaction:', error);
    throw error;
  }
};

export const completeDelivery = async (deliveryData: any) => {
  try {
    // Get branch address from branches collection
    let branchAddress = '';
    if (deliveryData.branchId) {
      try {
        const branchDoc = await getDoc(doc(db, 'branches', deliveryData.branchId));
        if (branchDoc.exists()) {
          const branchData = branchDoc.data();
          branchAddress = branchData.address || branchData.location || '';
        }
      } catch (error) {
        console.error('Error fetching branch address:', error);
      }
    }

    // Calculate actual remaining quantity by checking all transactions for this load session
    const transactionsCollection = collection(db, 'transactions');
    const sessionTransactionsQuery = query(
      transactionsCollection,
      where('loadSessionId', '==', deliveryData.loadSessionId)
    );
    const sessionTransactionsSnapshot = await getDocs(sessionTransactionsQuery);
    
    // Calculate total supplied for this load session
    let totalSupplied = 0;
    sessionTransactionsSnapshot.docs.forEach(doc => {
      const transaction = doc.data();
      if (transaction.type === 'supply') {
        totalSupplied += transaction.quantity || 0;
      }
    });
    
    // Get load session and calculate actual remaining balance
    const loadSessionRef = doc(db, 'loadSessions', deliveryData.loadSessionId);
    const loadSessionDoc = await getDoc(loadSessionRef);
    
    if (loadSessionDoc.exists()) {
      const loadSessionData = loadSessionDoc.data();
      const totalLoaded = loadSessionData.totalLoadedLiters || 0;
      const actualRemainingLiters = totalLoaded - totalSupplied;
      
      // Update status based on actual remaining balance
      const newStatus = actualRemainingLiters <= 0 ? 'completed' : 'active';
      await updateDoc(loadSessionRef, {
        remainingLiters: actualRemainingLiters,
        status: newStatus,
        lastSupplyAt: new Date(),
        totalSupplied: totalSupplied,
        ...(actualRemainingLiters <= 0 && { completedAt: new Date() })
      });
      
      console.log(`Load session ${deliveryData.loadSessionId} updated: ${totalLoaded}L loaded - ${totalSupplied}L supplied = ${actualRemainingLiters}L remaining, status: ${newStatus}`);
    }

    // Save delivery record
    const deliveryRef = doc(collection(db, 'deliveries'));
    const deliveryWithId = {
      ...deliveryData,
      branchAddress,
      id: deliveryRef.id,
      completedAt: new Date(),
      timestamp: new Date(),
      status: 'completed'
    };
    
    await setDoc(deliveryRef, deliveryWithId);
    
    // Save to transactions collection
    await saveTransaction({
      type: 'supply',
      loadSessionId: deliveryData.loadSessionId,
      deliveryOrderId: deliveryData.deliveryOrderId,
      branchId: deliveryData.branchId,
      branchName: deliveryData.branchName,
      branchAddress,
      oilTypeId: deliveryData.oilTypeId,
      oilTypeName: deliveryData.oilTypeName,
      quantity: deliveryData.deliveredLiters,
      startMeterReading: deliveryData.startMeterReading,
      endMeterReading: deliveryData.endMeterReading,
      photos: deliveryData.photos,
      timestamp: new Date(),
      driverUid: getCurrentUserId()
    });
    
    console.log('Delivery completed and saved to Firestore:', deliveryWithId);
    return deliveryWithId;
  } catch (error) {
    console.error('Error completing delivery:', error);
    throw error;
  }
};

export const getActiveLoadSessions = async () => {
  try {
    const loadSessionsCollection = collection(db, 'loadSessions');
    const snapshot = await getDocs(loadSessionsCollection);
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter((session: any) => session.status === 'active')
      .sort((a: any, b: any) => {
        // Sort by creation date, newest first
        const timeA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const timeB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return timeB.getTime() - timeA.getTime();
      });
  } catch (error) {
    console.error('Error getting active load sessions:', error);
    return [];
  }
};

export const getAllTransactions = async () => {
  try {
    const transactionsCollection = collection(db, 'transactions');
    const snapshot = await getDocs(transactionsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => 
      new Date(b.timestamp?.toDate ? b.timestamp.toDate() : b.timestamp).getTime() - 
      new Date(a.timestamp?.toDate ? a.timestamp.toDate() : a.timestamp).getTime()
    ) as any[];
  } catch (error) {
    console.error('Error getting all transactions:', error);
    return [];
  }
};

// Get all oil types from Firestore
export const getOilTypes = async () => {
  try {
    const oilTypesCollection = collection(db, 'oilTypes');
    const snapshot = await getDocs(oilTypesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
  } catch (error) {
    console.error('Error getting oil types:', error);
    return [];
  }
};

// Get all branches from Firestore
export const getBranches = async () => {
  try {
    const branchesCollection = collection(db, 'branches');
    const snapshot = await getDocs(branchesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
  } catch (error) {
    console.error('Error getting branches:', error);
    return [];
  }
};



// Get recent deliveries from Firestore
export const getRecentDeliveries = async (limit = 5) => {
  try {
    const deliveriesCollection = collection(db, 'deliveries');
    const snapshot = await getDocs(deliveriesCollection);
    const deliveries = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Ensure dates are properly formatted for frontend consumption
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : 
                  data.createdAt || new Date().toISOString(),
        completedAt: data.completedAt?.toDate?.() ? data.completedAt.toDate().toISOString() : 
                    data.completedAt || new Date().toISOString(),
        timestamp: data.timestamp?.toDate?.() ? data.timestamp.toDate().toISOString() : 
                  data.timestamp || new Date().toISOString()
      };
    });
    
    // Sort by timestamp and limit results
    return deliveries
      .sort((a: any, b: any) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return timeB - timeA;
      })
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting recent deliveries:', error);
    return [];
  }
};

// Firestore usage and data management functions
export const getFirestoreUsage = async () => {
  try {
    // Get counts from all collections
    const collections = ['users', 'deliveries', 'complaints', 'branches', 'oilTypes', 'tasks', 'loadSessions', 'transactions'];
    const counts = await Promise.all(
      collections.map(async (collectionName) => {
        const snapshot = await getDocs(collection(db, collectionName));
        return {
          collection: collectionName,
          count: snapshot.docs.length
        };
      })
    );

    const totalDocuments = counts.reduce((sum, item) => sum + item.count, 0);
    const estimatedSize = `${(totalDocuments * 2).toFixed(1)} KB`; // rough estimate

    return {
      collections: counts,
      totalDocuments,
      estimatedSize
    };
  } catch (error) {
    console.error('Error getting Firestore usage:', error);
    return {
      collections: [],
      totalDocuments: 0,
      estimatedSize: '0 KB'
    };
  }
};

export const deleteRecordsByDateRange = async (collectionName: string, startDate: Date, endDate: Date) => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(
      collectionRef,
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate)
    );
    
    const snapshot = await getDocs(q);
    let deletedCount = 0;

    // Delete in batches to avoid timeout
    const batch = writeBatch(db);
    snapshot.docs.forEach((document) => {
      batch.delete(document.ref);
      deletedCount++;
    });

    await batch.commit();
    return deletedCount;
  } catch (error) {
    console.error('Error deleting records by date range:', error);
    throw error;
  }
};

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};