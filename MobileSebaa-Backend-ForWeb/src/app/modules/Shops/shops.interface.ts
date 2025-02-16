/* eslint-disable no-unused-vars */
import { Types } from 'mongoose';

// Enum for service categories
export enum ServiceCategory {
  DisplayProblem = 'Display Problem',
  MotherboardProblem = 'Motherboard Problem',
  TouchPadProblem = 'Touch pad Problem',
  NetworkProblem = 'Network Problem',
  GreenLineIssue = 'Green line Issue',
  ChargingProblem = 'Charging Problem',
  CameraProblem = 'Camera Problem',
  BatteryProblem = 'Battery Problem',
  Other = 'Other',
}

// Interface for shop location
export interface TShopLocation {
  lat: string;
  long: string;
}

// Main Shop Interface
export interface TShop {
  createdBy: Types.ObjectId; // Reference to the user creating the shop
  ownerName: string; // Full name of the shop owner
  shopName: string; // Name of the shop
  address: string; // Shop's address
  email: string; // Shop's Email
  userEmail: string; // User's Email

  notes?: string;
  mobile: string; // Primary contact number of the shop
  alterMobile?: string;
  shopLocation: TShopLocation; // Location coordinates
  selectedDivision: string; // Division of the shop
  selectedDistrict: string; // District where the shop is located
  selectedTown: string; // Thana (sub-district) of the shop
  serviceCategory: ServiceCategory[]; // Array of service categories
  isDeleted: boolean; // Flag to indicate if the shop is soft-deleted

  status: 'Approve' | 'Pending' | 'Rejected'; // Enum-like restriction
  addDate: Date;
}
