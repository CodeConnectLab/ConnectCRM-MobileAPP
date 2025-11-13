// import {TEST_URL, LIVE_URL} from '@env';

// const TEST_URL = 'https://api.codeconnect.in/api/v1/';
const TEST_URL = 'https://crm.redkaizen.in/api/v1/';
const LIVE_URL = 'https://crm.redkaizen.in/api/v1/';
const TEST_URL1 = 'https://f067-45-118-156-30.ngrok-free.app/api/v1/';

export const isProduction = false;
export const BASE_URL = !isProduction ? TEST_URL : LIVE_URL;

export const END_POINT = {
  preAuth: {
    login: 'signin',
    register: 'signup',
    requestOTP: 'forget-password/request-otp',
    verifyOTP: 'forget-password/verify-otp',
    resetPassword: 'forget-password/reset-password',
  },
  afterAuth: {
    dashboard: 'dashboard/metrics',
    CallHistory: 'call-history',
    profile: 'users/profile',
    getAllLead: 'lead',
    getFollowup: 'lead/follow-up',
    getImported: 'lead/imported',
    getOutsourced: 'lead/outsourced',
    lead_types: 'lead-types',
    stateList: 'locations/states/',
    callReport: 'call-report',
    bulkUpdate: 'bulkUpdate',
    manageReport: 'product-sale-report',
    getCallList: 'getCallList',
    users: 'users',
    productService: 'product-service',
    geolocation: "geo-location",
    profileUplode: "users/profile-img-uplode",
    calendar: "calendar",
    getNotification: "getNotification",
    seenUpdate : "seenUpdate",
    updateCompanyDetails : 'updateCompanyDetails',
    updateDepartment : 'updateDepartment/'
  },
};
