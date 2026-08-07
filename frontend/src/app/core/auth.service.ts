import { Injectable, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: string;
}

const firebaseConfig = {
  apiKey: "AIzaSyD4-eJe9vDq8ai0PccQv2_NVjd4z1Tf4PE",
  authDomain: "tup-educativa.firebaseapp.com",
  projectId: "tup-educativa",
  storageBucket: "tup-educativa.firebasestorage.app",
  messagingSenderId: "444274662932",
  appId: "1:444274662932:web:fc7bf722ba782379335101",
  measurementId: "G-RDKS6PJXPD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUser = signal<AuthUser | null>(null);
  readonly user = this.currentUser.asReadonly();

  private authReady: Promise<void>;

  constructor() {
    this.authReady = new Promise((resolve) => {
      let initialized = false;

      onAuthStateChanged(auth, async (firebaseUser: User | null) => {
        let role = 'Usuario';
        if (firebaseUser) {
          try {
            const tokenResult = await firebaseUser.getIdTokenResult();
            if (tokenResult.claims['role'] === 'admin') {
              role = 'Administrador';
            }
          } catch (e) {
            console.error('Error getting token result', e);
          }
        }

        this.currentUser.set(this.mapFirebaseUser(firebaseUser, role));

        if (!initialized) {
          initialized = true;
          resolve();
        }
      });
    });
  }

  async loginWithGoogle(): Promise<void> {
    await signInWithPopup(auth, provider);
  }

  logout(): Promise<void> {
    return signOut(auth);
  }

  async waitForAuthState(): Promise<AuthUser | null> {
    await this.authReady;
    return this.user();
  }

  isAuthenticated(): boolean {
    return !!this.user();
  }

  async getToken(): Promise<string | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    return currentUser.getIdToken();
  }

  private mapFirebaseUser(user: User | null, role: string = 'Usuario'): AuthUser | null {
    if (!user) {
      return null;
    }

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: role
    };
  }
}