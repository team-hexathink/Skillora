import type { User, UserType, WorkerProfile, EmployerProfile } from '../types';
import { WORKERS, EMPLOYERS } from '../constants';

const DB_KEY = 'globalfair_work_db';
const SESSION_KEY = 'globalfair_work_session';

interface Database {
  users: Record<string, User>;
  profiles: {
    workers: Record<string, WorkerProfile>;
    employers: Record<string, EmployerProfile>;
  };
}

// Helper to get the database from localStorage
const getDB = (): Database => {
  const dbString = localStorage.getItem(DB_KEY);
  if (dbString) {
    try {
      return JSON.parse(dbString);
    } catch (e) {
      console.error("Failed to parse DB from localStorage", e);
      // If parsing fails, return a fresh DB
      return { users: {}, profiles: { workers: {}, employers: {} } };
    }
  }
  return { users: {}, profiles: { workers: {}, employers: {} } };
};

// Helper to save the database to localStorage
const saveDB = (db: Database) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

// --- Core Database Functions ---

export const seedDatabase = () => {
  const db = getDB();
  // Check if already seeded to avoid overwriting data
  if (Object.keys(db.users).length > 0) {
    return;
  }
  
  // Seed workers
  WORKERS.forEach(worker => {
    db.users[worker.username] = { username: worker.username, password: 'password123', type: 'worker' };
    db.profiles.workers[worker.username] = worker;
  });

  // Seed employers
  EMPLOYERS.forEach(employer => {
    db.users[employer.username] = { username: employer.username, password: 'password123', type: 'employer' };
    db.profiles.employers[employer.username] = employer;
  });
  
  saveDB(db);
  console.log("Database seeded with initial data.");
};

export const signUp = (username: string, password: string): { success: boolean, message?: string } => {
  const db = getDB();
  if (db.users[username]) {
    return { success: false, message: 'Username already exists.' };
  }
  db.users[username] = { username, password }; // type is not known yet
  saveDB(db);
  return { success: true };
};

export const login = (username: string, password: string): { success: boolean, message?: string } => {
  const db = getDB();
  const user = db.users[username];
  if (!user) {
    return { success: false, message: 'User not found.' };
  }
  if (user.password !== password) {
    return { success: false, message: 'Incorrect password.' };
  }
  return { success: true };
};

export const getUser = (username: string): User | undefined => {
  const db = getDB();
  return db.users[username];
};

export const saveUserProfile = (username: string, profileData: Partial<WorkerProfile & EmployerProfile>, userType: UserType) => {
    const db = getDB();
    const user = db.users[username];
    if (!user) {
        console.error("Cannot save profile for non-existent user:", username);
        return;
    }
    
    user.type = userType;

    if (userType === 'worker') {
        const fullProfile = { ...profileData, id: Object.keys(db.profiles.workers).length + 1 } as WorkerProfile;
        db.profiles.workers[username] = fullProfile;
    } else {
        const fullProfile = { ...profileData, id: Object.keys(db.profiles.employers).length + 1 } as EmployerProfile;
        db.profiles.employers[username] = fullProfile;
    }
    
    saveDB(db);
};

export const getUserProfile = (username: string): WorkerProfile | EmployerProfile | undefined => {
    const db = getDB();
    const user = db.users[username];
    if (!user || !user.type) return undefined;
    
    if (user.type === 'worker') {
        return db.profiles.workers[username];
    } else {
        return db.profiles.employers[username];
    }
};

export const getWorkers = (): WorkerProfile[] => {
    const db = getDB();
    return Object.values(db.profiles.workers);
};

export const getEmployers = (): EmployerProfile[] => {
    const db = getDB();
    return Object.values(db.profiles.employers);
};


// --- Session Management ---

export const setCurrentUser = (user: User) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const getCurrentUser = (): User | null => {
    const userString = sessionStorage.getItem(SESSION_KEY);
    if (userString) {
        try {
            return JSON.parse(userString);
        } catch (e) {
            return null;
        }
    }
    return null;
};

export const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
};
