/**
 * Edit Mode Configuration and Constants
 * This file centralizes the collections and fields that are editable via the frontend.
 */

export const EDITABLE_COLLECTIONS = {
  SETTINGS: 'settings',
  PAGES: 'pages',
  PROJECTS: 'projects',
  CATEGORIES: 'categories',
  CLIENTS: 'clients',
};

export const EDITABLE_DOCUMENTS = {
  GENERAL_SETTINGS: 'general',
  HOME_PAGE: 'home',
  ABOUT_PAGE: 'about',
  WORKS_PAGE: 'works',
  CONTACT_PAGE: 'contact',
};

export const EDIT_MODE_Z_INDEX = {
  TOOLBAR: 2147483647,
  OVERLAY: 2147483646,
  TOOLTIP: 2147483645,
};

export const PRESET_COLORS = [
  '#f25c27', // Brand Orange
  '#000000', // Pure Black
  '#FFFFFF', // Pure White
  '#F3F0EB', // Off White/Paper
  '#1A1A1A', // Soft Black
  '#d64f20', // Dark Orange
  '#333333', // Dark Gray
  '#666666', // Medium Gray
  '#999999', // Light Gray
  '#E5E5E5', // Ultra Light Gray
  '#22c55e', // Success Green
  '#ef4444', // Danger Red
  '#3b82f6', // Info Blue
];
