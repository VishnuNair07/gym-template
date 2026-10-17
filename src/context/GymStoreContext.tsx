"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  planId: string;
  planName: string;
  status: "Active" | "Expired" | "Pending" | "Frozen";
  joinDate: string;
  expiryDate: string;
  emergencyContact?: string;
  trainerId?: string;
  trainerName?: string;
  attendanceCount: number;
  totalSpent: number;
  notes?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  description: string;
  features: string[];
  popular?: boolean;
  active: boolean;
  memberCount: number;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  avatar?: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  status: "In Gym" | "Completed";
  lockerNumber?: string;
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  specialty: string;
  email: string;
  phone: string;
  rating: number;
  activeClients: number;
  availability: "Morning" | "Evening" | "All Day";
  status: "Active" | "On Leave";
  bio?: string;
}

export interface PaymentTransaction {
  id: string;
  invoiceNumber: string;
  memberId: string;
  memberName: string;
  planName: string;
  amount: number;
  date: string;
  status: "Paid" | "Pending" | "Refunded";
  paymentMethod: "Credit Card" | "UPI / Net Banking" | "Cash" | "Debit Card";
}

export interface FitnessClass {
  id: string;
  title: string;
  trainerId: string;
  trainerName: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  time: string;
  duration: number; // minutes
  capacity: number;
  bookedCount: number;
  room: string;
  category: "HIIT" | "Strength" | "Yoga" | "Spinning" | "CrossFit" | "Pilates";
  enrolledMemberIds: string[];
}

export interface WorkoutPlan {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  goal: "Muscle Building" | "Fat Loss" | "Endurance" | "Athletic Conditioning";
  daysPerWeek: number;
  assignedMembers: number;
  exercises: { name: string; sets: string; reps: string; rest: string }[];
}

export interface DietPlan {
  id: string;
  title: string;
  goal: "Weight Loss" | "Muscle Gain" | "Keto Lean" | "High Protein Balanced";
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
  assignedMembers: number;
  meals: { title: string; items: string; calories: number }[];
}

export interface GymNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  unread: boolean;
  type: "info" | "warning" | "success" | "danger";
}

export interface GymSettings {
  gymName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  taxRate: number;
  openingTime: string;
  closingTime: string;
  autoRenewals: boolean;
  emailAlerts: boolean;
  guestPassEnabled: boolean;
}

const INITIAL_PLANS: MembershipPlan[] = [
  {
    id: "plan-1",
    name: "Standard Monthly",
    price: 49,
    durationMonths: 1,
    description: "Standard gym access with cardio and free weights equipment.",
    features: ["Gym floor access", "Locker room & shower", "1 Free fitness assessment"],
    popular: false,
    active: true,
    memberCount: 84,
  },
  {
    id: "plan-2",
    name: "Pro Performance (Quarterly)",
    price: 129,
    durationMonths: 3,
    description: "Full club access including group classes and steam room access.",
    features: [
      "All standard features",
      "Unlimited group classes",
      "Steam & Sauna access",
      "Quarterly body composition check",
    ],
    popular: true,
    active: true,
    memberCount: 162,
  },
  {
    id: "plan-3",
    name: "Elite Annual Pass",
    price: 449,
    durationMonths: 12,
    description: "VIP access, free guest passes, personal training discounts, and towel service.",
    features: [
      "All Pro Performance features",
      "5 Personal Training sessions included",
      "Free guest passes (2/month)",
      "Daily towel service & locker reserve",
      "Dedicated nutrition consultation",
    ],
    popular: false,
    active: true,
    memberCount: 98,
  },
  {
    id: "plan-4",
    name: "Student & Youth Pass",
    price: 35,
    durationMonths: 1,
    description: "Discounted monthly membership for students with valid student ID.",
    features: ["Gym floor access", "Off-peak hours (10 AM - 4 PM)", "Locker usage"],
    popular: false,
    active: true,
    memberCount: 45,
  },
];

const INITIAL_MEMBERS: Member[] = [
  {
    id: "mem-101",
    name: "Marcus Vance",
    email: "marcus.v@example.com",
    phone: "+1 (555) 234-5678",
    planId: "plan-2",
    planName: "Pro Performance (Quarterly)",
    status: "Active",
    joinDate: "2026-01-15",
    expiryDate: "2026-11-15",
    emergencyContact: "Sarah Vance (+1 555-888-2341)",
    trainerId: "trn-1",
    trainerName: "Coach Dave Miller",
    attendanceCount: 42,
    totalSpent: 387,
    notes: "Prepares for half-marathon, focuses on leg endurance and core.",
  },
  {
    id: "mem-102",
    name: "Sophia Rodriguez",
    email: "sophia.fit@example.com",
    phone: "+1 (555) 345-6789",
    planId: "plan-3",
    planName: "Elite Annual Pass",
    status: "Active",
    joinDate: "2025-11-01",
    expiryDate: "2026-11-01",
    emergencyContact: "Carlos Rodriguez (+1 555-999-1234)",
    trainerId: "trn-2",
    trainerName: "Elena Rostova",
    attendanceCount: 78,
    totalSpent: 449,
    notes: "Personal training Tuesdays and Thursdays.",
  },
  {
    id: "mem-103",
    name: "Liam O'Connor",
    email: "liam.oc@example.com",
    phone: "+1 (555) 456-7890",
    planId: "plan-1",
    planName: "Standard Monthly",
    status: "Expired",
    joinDate: "2026-07-10",
    expiryDate: "2026-10-10",
    emergencyContact: "Mary O'Connor (+1 555-444-5555)",
    attendanceCount: 19,
    totalSpent: 147,
    notes: "Membership expired 7 days ago. Pending renewal follow-up.",
  },
  {
    id: "mem-104",
    name: "Amina Khan",
    email: "amina.k@example.com",
    phone: "+1 (555) 567-8901",
    planId: "plan-2",
    planName: "Pro Performance (Quarterly)",
    status: "Active",
    joinDate: "2026-04-12",
    expiryDate: "2026-10-25",
    emergencyContact: "Tariq Khan (+1 555-333-2211)",
    trainerId: "trn-3",
    trainerName: "Marcus Sterling",
    attendanceCount: 56,
    totalSpent: 258,
    notes: "Upcoming expiration in 8 days.",
  },
  {
    id: "mem-105",
    name: "Brandon Lee",
    email: "brandon.lee@example.com",
    phone: "+1 (555) 678-9012",
    planId: "plan-1",
    planName: "Standard Monthly",
    status: "Frozen",
    joinDate: "2026-03-01",
    expiryDate: "2026-12-01",
    emergencyContact: "Jenny Lee (+1 555-222-1144)",
    attendanceCount: 28,
    totalSpent: 196,
    notes: "Medical freeze requested for shoulder rehab until November.",
  },
  {
    id: "mem-106",
    name: "Emily Watson",
    email: "emily.w@example.com",
    phone: "+1 (555) 789-0123",
    planId: "plan-4",
    planName: "Student & Youth Pass",
    status: "Active",
    joinDate: "2026-09-01",
    expiryDate: "2026-10-22",
    emergencyContact: "George Watson (+1 555-111-9988)",
    attendanceCount: 14,
    totalSpent: 70,
    notes: "University student ID verified.",
  },
  {
    id: "mem-107",
    name: "Daniel Garcia",
    email: "d.garcia@example.com",
    phone: "+1 (555) 890-1234",
    planId: "plan-3",
    planName: "Elite Annual Pass",
    status: "Active",
    joinDate: "2026-02-14",
    expiryDate: "2027-02-14",
    emergencyContact: "Maria Garcia (+1 555-777-6655)",
    trainerId: "trn-1",
    trainerName: "Coach Dave Miller",
    attendanceCount: 92,
    totalSpent: 449,
    notes: "Bodybuilding prep competitor.",
  },
];

const INITIAL_TRAINERS: Trainer[] = [
  {
    id: "trn-1",
    name: "Dave Miller",
    role: "Head Strength Coach",
    specialty: "Powerlifting, Hypertrophy & Olympic Lifting",
    email: "dave.m@gympulse.com",
    phone: "+1 (555) 911-2001",
    rating: 4.9,
    activeClients: 18,
    availability: "Morning",
    status: "Active",
    bio: "12+ years experience in collegiate strength conditioning and bodybuilding mechanics.",
  },
  {
    id: "trn-2",
    name: "Elena Rostova",
    role: "Functional Fitness & Pilates Lead",
    specialty: "Mobility, Core Conditioning & Injury Prevention",
    email: "elena.r@gympulse.com",
    phone: "+1 (555) 911-2002",
    rating: 5.0,
    activeClients: 15,
    availability: "All Day",
    status: "Active",
    bio: "Certified Pilates Master & Sports Physiotherapy background.",
  },
  {
    id: "trn-3",
    name: "Marcus Sterling",
    role: "HIIT & Cardio Specialist",
    specialty: "CrossFit, Endurance & Metabolic Conditioning",
    email: "marcus.s@gympulse.com",
    phone: "+1 (555) 911-2003",
    rating: 4.8,
    activeClients: 22,
    availability: "Evening",
    status: "Active",
    bio: "Former triathlete dedicated to high energy group training and fat loss.",
  },
  {
    id: "trn-4",
    name: "Chloe Bennett",
    role: "Registered Sports Nutritionist",
    specialty: "Macro Planning, Gut Health & Athletic Performance",
    email: "chloe.b@gympulse.com",
    phone: "+1 (555) 911-2004",
    rating: 4.9,
    activeClients: 12,
    availability: "Morning",
    status: "Active",
    bio: "M.S. in Clinical Nutrition crafting tailored metabolic diet strategies.",
  },
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "att-1",
    memberId: "mem-101",
    memberName: "Marcus Vance",
    date: "2026-10-17",
    checkInTime: "06:45 AM",
    checkOutTime: "08:15 AM",
    status: "Completed",
    lockerNumber: "L-14",
  },
  {
    id: "att-2",
    memberId: "mem-102",
    memberName: "Sophia Rodriguez",
    date: "2026-10-17",
    checkInTime: "07:30 AM",
    checkOutTime: "09:00 AM",
    status: "Completed",
    lockerNumber: "L-08",
  },
  {
    id: "att-3",
    memberId: "mem-107",
    memberName: "Daniel Garcia",
    date: "2026-10-17",
    checkInTime: "08:10 AM",
    status: "In Gym",
    lockerNumber: "L-22",
  },
  {
    id: "att-4",
    memberId: "mem-104",
    memberName: "Amina Khan",
    date: "2026-10-17",
    checkInTime: "09:15 AM",
    status: "In Gym",
    lockerNumber: "L-05",
  },
  {
    id: "att-5",
    memberId: "mem-106",
    memberName: "Emily Watson",
    date: "2026-10-16",
    checkInTime: "04:15 PM",
    checkOutTime: "05:30 PM",
    status: "Completed",
    lockerNumber: "L-31",
  },
];

const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: "tx-501",
    invoiceNumber: "INV-2026-0941",
    memberId: "mem-101",
    memberName: "Marcus Vance",
    planName: "Pro Performance (Quarterly)",
    amount: 129,
    date: "2026-10-15",
    status: "Paid",
    paymentMethod: "Credit Card",
  },
  {
    id: "tx-502",
    invoiceNumber: "INV-2026-0942",
    memberId: "mem-102",
    memberName: "Sophia Rodriguez",
    planName: "Elite Annual Pass",
    amount: 449,
    date: "2026-10-12",
    status: "Paid",
    paymentMethod: "UPI / Net Banking",
  },
  {
    id: "tx-503",
    invoiceNumber: "INV-2026-0943",
    memberId: "mem-106",
    memberName: "Emily Watson",
    planName: "Student & Youth Pass",
    amount: 35,
    date: "2026-10-10",
    status: "Paid",
    paymentMethod: "Debit Card",
  },
  {
    id: "tx-504",
    invoiceNumber: "INV-2026-0944",
    memberId: "mem-103",
    memberName: "Liam O'Connor",
    planName: "Standard Monthly (Renewal)",
    amount: 49,
    date: "2026-10-09",
    status: "Pending",
    paymentMethod: "Cash",
  },
  {
    id: "tx-505",
    invoiceNumber: "INV-2026-0945",
    memberId: "mem-107",
    memberName: "Daniel Garcia",
    planName: "Personal Training Session (5-Pack)",
    amount: 220,
    date: "2026-10-05",
    status: "Paid",
    paymentMethod: "Credit Card",
  },
];

const INITIAL_CLASSES: FitnessClass[] = [
  {
    id: "cls-1",
    title: "Morning HIIT Ignition",
    trainerId: "trn-3",
    trainerName: "Marcus Sterling",
    day: "Monday",
    time: "07:00 AM - 07:45 AM",
    duration: 45,
    capacity: 20,
    bookedCount: 16,
    room: "Studio A (Main Turf)",
    category: "HIIT",
    enrolledMemberIds: ["mem-101", "mem-104", "mem-106"],
  },
  {
    id: "cls-2",
    title: "Power Yoga & Core Flow",
    trainerId: "trn-2",
    trainerName: "Elena Rostova",
    day: "Tuesday",
    time: "08:00 AM - 09:00 AM",
    duration: 60,
    capacity: 15,
    bookedCount: 12,
    room: "Studio B (Mind & Body)",
    category: "Yoga",
    enrolledMemberIds: ["mem-102", "mem-104"],
  },
  {
    id: "cls-3",
    title: "Barbell Heavy Hypertrophy",
    trainerId: "trn-1",
    trainerName: "Dave Miller",
    day: "Wednesday",
    time: "05:30 PM - 06:45 PM",
    duration: 75,
    capacity: 12,
    bookedCount: 11,
    room: "Iron Arena Floor",
    category: "Strength",
    enrolledMemberIds: ["mem-101", "mem-107"],
  },
  {
    id: "cls-4",
    title: "High Octane RPM Spinning",
    trainerId: "trn-3",
    trainerName: "Marcus Sterling",
    day: "Thursday",
    time: "06:00 PM - 06:45 PM",
    duration: 45,
    capacity: 25,
    bookedCount: 22,
    room: "Cycle Amphitheater",
    category: "Spinning",
    enrolledMemberIds: ["mem-102", "mem-106"],
  },
  {
    id: "cls-5",
    title: "Dynamic Reformer Pilates",
    trainerId: "trn-2",
    trainerName: "Elena Rostova",
    day: "Saturday",
    time: "09:30 AM - 10:30 AM",
    duration: 60,
    capacity: 10,
    bookedCount: 8,
    room: "Reformer Suite",
    category: "Pilates",
    enrolledMemberIds: ["mem-102"],
  },
];

const INITIAL_WORKOUTS: WorkoutPlan[] = [
  {
    id: "wko-1",
    title: "4-Day Upper/Lower Hypertrophy",
    level: "Intermediate",
    goal: "Muscle Building",
    daysPerWeek: 4,
    assignedMembers: 48,
    exercises: [
      { name: "Barbell Bench Press", sets: "4", reps: "8-10", rest: "90s" },
      { name: "Barbell Back Squat", sets: "4", reps: "6-8", rest: "120s" },
      { name: "Overhead Dumbbell Press", sets: "3", reps: "10-12", rest: "60s" },
      { name: "Romanian Deadlift", sets: "3", reps: "8-10", rest: "90s" },
      { name: "Cable Lat Pulldown", sets: "3", reps: "12", rest: "60s" },
    ],
  },
  {
    id: "wko-2",
    title: "Metabolic Shred & Core Accelerator",
    level: "Advanced",
    goal: "Fat Loss",
    daysPerWeek: 5,
    assignedMembers: 32,
    exercises: [
      { name: "Kettlebell Swing Circuit", sets: "5", reps: "20", rest: "45s" },
      { name: "Burpee Box Jumps", sets: "4", reps: "15", rest: "45s" },
      { name: "Rowing Machine Intervals", sets: "6", reps: "500m", rest: "60s" },
      { name: "Hanging Leg Raises", sets: "4", reps: "15", rest: "45s" },
    ],
  },
  {
    id: "wko-3",
    title: "Foundational Strength & Mobility",
    level: "Beginner",
    goal: "Athletic Conditioning",
    daysPerWeek: 3,
    assignedMembers: 64,
    exercises: [
      { name: "Goblet Squats", sets: "3", reps: "12", rest: "60s" },
      { name: "Dumbbell Chest Supported Row", sets: "3", reps: "10", rest: "60s" },
      { name: "Push-ups / Incline Push-ups", sets: "3", reps: "10-12", rest: "60s" },
      { name: "Plank Hold", sets: "3", reps: "45s", rest: "60s" },
    ],
  },
];

const INITIAL_DIETS: DietPlan[] = [
  {
    id: "diet-1",
    title: "Lean High-Protein Protocol (2,400 kcal)",
    goal: "Muscle Gain",
    calories: 2400,
    protein: 195,
    carbs: 230,
    fats: 65,
    assignedMembers: 52,
    meals: [
      { title: "Breakfast", items: "4 egg whites + 2 whole eggs, 80g oats, blueberries", calories: 580 },
      { title: "Lunch", items: "200g grilled chicken breast, 150g brown rice, steamed broccoli", calories: 650 },
      { title: "Post-Workout", items: "Whey isolate shake + 1 banana + almond butter", calories: 420 },
      { title: "Dinner", items: "200g Atlantic salmon, sweet potato mash, asparagus", calories: 750 },
    ],
  },
  {
    id: "diet-2",
    title: "Metabolic Deficit Cut (1,850 kcal)",
    goal: "Weight Loss",
    calories: 1850,
    protein: 175,
    carbs: 140,
    fats: 50,
    assignedMembers: 39,
    meals: [
      { title: "Breakfast", items: "Greek yogurt bowl, chia seeds, sliced strawberries", calories: 380 },
      { title: "Lunch", items: "Turkey breast wrap with avocado & spinach", calories: 490 },
      { title: "Snack", items: "Protein shake with almond milk", calories: 220 },
      { title: "Dinner", items: "Grilled cod fillet with Mediterranean roasted veggies", calories: 560 },
    ],
  },
];

const INITIAL_NOTIFICATIONS: GymNotification[] = [
  {
    id: "notif-1",
    title: "Membership Expiring Soon",
    message: "Amina Khan's Pro Performance pass expires in 8 days.",
    timestamp: "10 minutes ago",
    unread: true,
    type: "warning",
  },
  {
    id: "notif-2",
    title: "Class Capacity Alert",
    message: "Barbell Heavy Hypertrophy has only 1 open slot left.",
    timestamp: "45 minutes ago",
    unread: true,
    type: "info",
  },
  {
    id: "notif-3",
    title: "Payment Received",
    message: "Marcus Vance paid $129.00 via Credit Card (INV-2026-0941).",
    timestamp: "2 hours ago",
    unread: false,
    type: "success",
  },
  {
    id: "notif-4",
    title: "Locker Maintenance Notice",
    message: "Locker room B dry saunas scheduled for filter cleaning tonight at 10 PM.",
    timestamp: "5 hours ago",
    unread: false,
    type: "info",
  },
];

const INITIAL_SETTINGS: GymSettings = {
  gymName: "Apex Gym & Fitness Club",
  tagline: "High Performance Strength & Wellness",
  email: "admin@apexgym.com",
  phone: "+1 (800) 555-APEX",
  address: "742 Performance Way, Metro Fitness District, CA 90210",
  currency: "USD ($)",
  taxRate: 8.5,
  openingTime: "05:00 AM",
  closingTime: "11:00 PM",
  autoRenewals: true,
  emailAlerts: true,
  guestPassEnabled: true,
};

interface GymStoreContextType {
  members: Member[];
  plans: MembershipPlan[];
  trainers: Trainer[];
  attendance: AttendanceRecord[];
  payments: PaymentTransaction[];
  classes: FitnessClass[];
  workouts: WorkoutPlan[];
  diets: DietPlan[];
  notifications: GymNotification[];
  settings: GymSettings;

  // Member actions
  addMember: (member: Omit<Member, "id" | "attendanceCount" | "totalSpent">) => Member;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  toggleMemberStatus: (id: string) => void;

  // Plan actions
  addPlan: (plan: Omit<MembershipPlan, "id" | "memberCount">) => MembershipPlan;
  updatePlan: (id: string, updates: Partial<MembershipPlan>) => void;
  deletePlan: (id: string) => void;

  // Attendance actions
  checkInMember: (memberId: string, lockerNumber?: string) => AttendanceRecord;
  checkOutMember: (attendanceId: string) => void;

  // Trainer actions
  addTrainer: (trainer: Omit<Trainer, "id">) => Trainer;
  updateTrainer: (id: string, updates: Partial<Trainer>) => void;
  deleteTrainer: (id: string) => void;

  // Payment actions
  addPayment: (payment: Omit<PaymentTransaction, "id" | "invoiceNumber">) => PaymentTransaction;
  updatePaymentStatus: (id: string, status: "Paid" | "Pending" | "Refunded") => void;

  // Class actions
  addClass: (newClass: Omit<FitnessClass, "id" | "bookedCount" | "enrolledMemberIds">) => FitnessClass;
  bookClassMember: (classId: string, memberId: string) => boolean;
  cancelClassBooking: (classId: string, memberId: string) => void;

  // Workout & Diet actions
  addWorkoutPlan: (plan: Omit<WorkoutPlan, "id" | "assignedMembers">) => WorkoutPlan;
  addDietPlan: (plan: Omit<DietPlan, "id" | "assignedMembers">) => DietPlan;

  // Notification actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearAllNotifications: () => void;

  // Settings
  updateSettings: (updates: Partial<GymSettings>) => void;
  resetAllData: () => void;
}

const GymStoreContext = createContext<GymStoreContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = "gym_admin_v2_";

export function GymStoreProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [plans, setPlans] = useState<MembershipPlan[]>(INITIAL_PLANS);
  const [trainers, setTrainers] = useState<Trainer[]>(INITIAL_TRAINERS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [payments, setPayments] = useState<PaymentTransaction[]>(INITIAL_PAYMENTS);
  const [classes, setClasses] = useState<FitnessClass[]>(INITIAL_CLASSES);
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>(INITIAL_WORKOUTS);
  const [diets, setDiets] = useState<DietPlan[]>(INITIAL_DIETS);
  const [notifications, setNotifications] = useState<GymNotification[]>(INITIAL_NOTIFICATIONS);
  const [settings, setSettings] = useState<GymSettings>(INITIAL_SETTINGS);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedMembers = localStorage.getItem(`${STORAGE_KEY_PREFIX}members`);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (savedMembers) setMembers(JSON.parse(savedMembers));

      const savedPlans = localStorage.getItem(`${STORAGE_KEY_PREFIX}plans`);
      if (savedPlans) setPlans(JSON.parse(savedPlans));

      const savedTrainers = localStorage.getItem(`${STORAGE_KEY_PREFIX}trainers`);
      if (savedTrainers) setTrainers(JSON.parse(savedTrainers));

      const savedAttendance = localStorage.getItem(`${STORAGE_KEY_PREFIX}attendance`);
      if (savedAttendance) setAttendance(JSON.parse(savedAttendance));

      const savedPayments = localStorage.getItem(`${STORAGE_KEY_PREFIX}payments`);
      if (savedPayments) setPayments(JSON.parse(savedPayments));

      const savedClasses = localStorage.getItem(`${STORAGE_KEY_PREFIX}classes`);
      if (savedClasses) setClasses(JSON.parse(savedClasses));

      const savedWorkouts = localStorage.getItem(`${STORAGE_KEY_PREFIX}workouts`);
      if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));

      const savedDiets = localStorage.getItem(`${STORAGE_KEY_PREFIX}diets`);
      if (savedDiets) setDiets(JSON.parse(savedDiets));

      const savedNotifications = localStorage.getItem(`${STORAGE_KEY_PREFIX}notifications`);
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));

      const savedSettings = localStorage.getItem(`${STORAGE_KEY_PREFIX}settings`);
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    } catch {
      // Fallback to initial
    }
  }, []);

  // Sync to localStorage
  const save = (key: string, data: unknown) => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, JSON.stringify(data));
    } catch {
      // ignore quota errors
    }
  };

  // Member CRUD
  const addMember = (data: Omit<Member, "id" | "attendanceCount" | "totalSpent">) => {
    const id = `mem-${Date.now().toString().slice(-4)}`;
    const newMember: Member = {
      ...data,
      id,
      attendanceCount: 0,
      totalSpent: 0,
    };
    const updated = [newMember, ...members];
    setMembers(updated);
    save("members", updated);

    // Also increment plan memberCount
    setPlans((prev) =>
      prev.map((p) => (p.id === data.planId ? { ...p, memberCount: p.memberCount + 1 } : p))
    );

    return newMember;
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    const updated = members.map((m) => (m.id === id ? { ...m, ...updates } : m));
    setMembers(updated);
    save("members", updated);
  };

  const deleteMember = (id: string) => {
    const member = members.find((m) => m.id === id);
    const updated = members.filter((m) => m.id !== id);
    setMembers(updated);
    save("members", updated);

    if (member) {
      setPlans((prev) =>
        prev.map((p) =>
          p.id === member.planId ? { ...p, memberCount: Math.max(0, p.memberCount - 1) } : p
        )
      );
    }
  };

  const toggleMemberStatus = (id: string) => {
    const updated = members.map((m) => {
      if (m.id !== id) return m;
      const nextStatus: Member["status"] =
        m.status === "Active" ? "Frozen" : m.status === "Frozen" ? "Active" : "Active";
      return { ...m, status: nextStatus };
    });
    setMembers(updated);
    save("members", updated);
  };

  // Plan CRUD
  const addPlan = (data: Omit<MembershipPlan, "id" | "memberCount">) => {
    const id = `plan-${Date.now().toString().slice(-4)}`;
    const newPlan: MembershipPlan = { ...data, id, memberCount: 0 };
    const updated = [...plans, newPlan];
    setPlans(updated);
    save("plans", updated);
    return newPlan;
  };

  const updatePlan = (id: string, updates: Partial<MembershipPlan>) => {
    const updated = plans.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setPlans(updated);
    save("plans", updated);
  };

  const deletePlan = (id: string) => {
    const updated = plans.filter((p) => p.id !== id);
    setPlans(updated);
    save("plans", updated);
  };

  // Attendance Check-in / Check-out
  const checkInMember = (memberId: string, lockerNumber?: string) => {
    const member = members.find((m) => m.id === memberId);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const dateStr = now.toISOString().split("T")[0];

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now().toString().slice(-4)}`,
      memberId,
      memberName: member?.name || "Unknown Member",
      avatar: member?.avatar,
      date: dateStr,
      checkInTime: timeStr,
      status: "In Gym",
      lockerNumber: lockerNumber || `L-${Math.floor(Math.random() * 50) + 1}`,
    };

    const updated = [newRecord, ...attendance];
    setAttendance(updated);
    save("attendance", updated);

    // increment member attendanceCount
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, attendanceCount: m.attendanceCount + 1 } : m))
    );

    return newRecord;
  };

  const checkOutMember = (attendanceId: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const updated = attendance.map((rec) =>
      rec.id === attendanceId
        ? { ...rec, checkOutTime: timeStr, status: "Completed" as const }
        : rec
    );
    setAttendance(updated);
    save("attendance", updated);
  };

  // Trainer CRUD
  const addTrainer = (data: Omit<Trainer, "id">) => {
    const id = `trn-${Date.now().toString().slice(-4)}`;
    const newTrainer: Trainer = { ...data, id };
    const updated = [...trainers, newTrainer];
    setTrainers(updated);
    save("trainers", updated);
    return newTrainer;
  };

  const updateTrainer = (id: string, updates: Partial<Trainer>) => {
    const updated = trainers.map((t) => (t.id === id ? { ...t, ...updates } : mTrainer(t, updates)));
    setTrainers(updated);
    save("trainers", updated);
  };

  function mTrainer(t: Trainer, updates: Partial<Trainer>): Trainer {
    return { ...t, ...updates };
  }

  const deleteTrainer = (id: string) => {
    const updated = trainers.filter((t) => t.id !== id);
    setTrainers(updated);
    save("trainers", updated);
  };

  // Payment CRUD
  const addPayment = (data: Omit<PaymentTransaction, "id" | "invoiceNumber">) => {
    const id = `tx-${Date.now().toString().slice(-4)}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTx: PaymentTransaction = { ...data, id, invoiceNumber };
    const updated = [newTx, ...payments];
    setPayments(updated);
    save("payments", updated);

    // Update member totalSpent if Paid
    if (data.status === "Paid") {
      setMembers((prev) =>
        prev.map((m) => (m.id === data.memberId ? { ...m, totalSpent: m.totalSpent + data.amount } : m))
      );
    }

    return newTx;
  };

  const updatePaymentStatus = (id: string, status: "Paid" | "Pending" | "Refunded") => {
    const updated = payments.map((tx) => (tx.id === id ? { ...tx, status } : tx));
    setPayments(updated);
    save("payments", updated);
  };

  // Classes & Scheduling
  const addClass = (data: Omit<FitnessClass, "id" | "bookedCount" | "enrolledMemberIds">) => {
    const id = `cls-${Date.now().toString().slice(-4)}`;
    const newClass: FitnessClass = {
      ...data,
      id,
      bookedCount: 0,
      enrolledMemberIds: [],
    };
    const updated = [...classes, newClass];
    setClasses(updated);
    save("classes", updated);
    return newClass;
  };

  const bookClassMember = (classId: string, memberId: string) => {
    let success = false;
    const updated = classes.map((c) => {
      if (c.id === classId) {
        if (c.bookedCount >= c.capacity) return c;
        if (c.enrolledMemberIds.includes(memberId)) return c;
        success = true;
        return {
          ...c,
          bookedCount: c.bookedCount + 1,
          enrolledMemberIds: [...c.enrolledMemberIds, memberId],
        };
      }
      return c;
    });
    if (success) {
      setClasses(updated);
      save("classes", updated);
    }
    return success;
  };

  const cancelClassBooking = (classId: string, memberId: string) => {
    const updated = classes.map((c) => {
      if (c.id === classId && c.enrolledMemberIds.includes(memberId)) {
        return {
          ...c,
          bookedCount: Math.max(0, c.bookedCount - 1),
          enrolledMemberIds: c.enrolledMemberIds.filter((id) => id !== memberId),
        };
      }
      return c;
    });
    setClasses(updated);
    save("classes", updated);
  };

  // Workout & Diet CRUD
  const addWorkoutPlan = (data: Omit<WorkoutPlan, "id" | "assignedMembers">) => {
    const id = `wko-${Date.now().toString().slice(-4)}`;
    const newPlan: WorkoutPlan = { ...data, id, assignedMembers: 0 };
    const updated = [...workouts, newPlan];
    setWorkouts(updated);
    save("workouts", updated);
    return newPlan;
  };

  const addDietPlan = (data: Omit<DietPlan, "id" | "assignedMembers">) => {
    const id = `diet-${Date.now().toString().slice(-4)}`;
    const newPlan: DietPlan = { ...data, id, assignedMembers: 0 };
    const updated = [...diets, newPlan];
    setDiets(updated);
    save("diets", updated);
    return newPlan;
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, unread: false } : n));
    setNotifications(updated);
    save("notifications", updated);
  };

  const markAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, unread: false }));
    setNotifications(updated);
    save("notifications", updated);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    save("notifications", []);
  };

  // Settings
  const updateSettings = (updates: Partial<GymSettings>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    save("settings", updated);
  };

  const resetAllData = () => {
    localStorage.clear();
    setMembers(INITIAL_MEMBERS);
    setPlans(INITIAL_PLANS);
    setTrainers(INITIAL_TRAINERS);
    setAttendance(INITIAL_ATTENDANCE);
    setPayments(INITIAL_PAYMENTS);
    setClasses(INITIAL_CLASSES);
    setWorkouts(INITIAL_WORKOUTS);
    setDiets(INITIAL_DIETS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSettings(INITIAL_SETTINGS);
  };

  return (
    <GymStoreContext.Provider
      value={{
        members,
        plans,
        trainers,
        attendance,
        payments,
        classes,
        workouts,
        diets,
        notifications,
        settings,
        addMember,
        updateMember,
        deleteMember,
        toggleMemberStatus,
        addPlan,
        updatePlan,
        deletePlan,
        checkInMember,
        checkOutMember,
        addTrainer,
        updateTrainer,
        deleteTrainer,
        addPayment,
        updatePaymentStatus,
        addClass,
        bookClassMember,
        cancelClassBooking,
        addWorkoutPlan,
        addDietPlan,
        markNotificationRead,
        markAllNotificationsRead,
        clearAllNotifications,
        updateSettings,
        resetAllData,
      }}
    >
      {children}
    </GymStoreContext.Provider>
  );
}

export function useGymStore() {
  const context = useContext(GymStoreContext);
  if (!context) {
    throw new Error("useGymStore must be used within a GymStoreProvider");
  }
  return context;
}
