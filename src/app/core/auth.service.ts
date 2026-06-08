import { Injectable, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

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
  user = signal<User | null>(null);

  private authReady: Promise<void>;

  constructor() {
    this.authReady = new Promise((resolve) => {
      let initialized = false;

      onAuthStateChanged(auth, (user: User | null) => {
        this.user.set(user);

        if (!initialized) {
          initialized = true;
          resolve();
        }
      });
    });
  }

  loginWithGoogle() {
    return signInWithPopup(auth, provider);
  }

  logout(): Promise<void> {
    return signOut(auth);
  }

  listenAuthState(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  async waitForAuthState(): Promise<User | null> {
    await this.authReady;
    return this.user();
  }

  isAuthenticated(): boolean {
    return !!this.user();
  }
}