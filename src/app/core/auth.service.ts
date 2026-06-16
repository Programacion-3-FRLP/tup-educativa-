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
}

const firebaseConfig = {
  apiKey: 'AIzaSyCMYA1dQ6HRTPj_5UeuH02W1dwfCCYzCWo',
  authDomain: 'educactiva-a3a00.firebaseapp.com',
  projectId: 'educactiva-a3a00',
  storageBucket: 'educactiva-a3a00.firebasestorage.app',
  messagingSenderId: '712323141237',
  appId: '1:712323141237:web:444d7407f84066ebd8b23c',
  measurementId: 'G-1MS0B9Z6V5',
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

      onAuthStateChanged(auth, (firebaseUser: User | null) => {
        this.currentUser.set(this.mapFirebaseUser(firebaseUser));

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

  private mapFirebaseUser(user: User | null): AuthUser | null {
    if (!user) {
      return null;
    }

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  }
}