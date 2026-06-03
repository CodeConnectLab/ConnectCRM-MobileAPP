import {Text, Dimensions, Platform, Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppVersion} from './staticData';
import {showToast} from '../components/showToast';
import {API} from '../API';
import {END_POINT} from '../API/UrlProvider';

export const screenWidth = Dimensions.get('window').width;

export const validateEmail = email => {
  // Regular expression for validating email addresses
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

export const formatTimestamp = timestamp => {
  const date = new Date(timestamp);
  const today = new Date();

  // Check if the date is today
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    // Return only time (e.g., "3:45 PM")
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  // Check if the year matches the current year
  if (date.getFullYear() === today.getFullYear()) {
    // Return "Month Day" (e.g., "Nov 20")
    return date.toLocaleString('en-US', {month: 'short', day: 'numeric'});
  }

  // Otherwise, return "Year Month Day" (e.g., "2024 Nov 20")
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatCreatedAt = createdAt => {
  const date = new Date(createdAt);

  // Define month names
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Extract parts of the date
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Get hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Determine AM/PM
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert to 12-hour format

  // Format the date
  return `${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;
};

export const VersionView = (
  appVersionText = {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 14.63,
    textAlign: 'center',
    color: '#1F3132',
  },
) => {
  return (
    <Text style={appVersionText}>
      {AppVersion.msg + '\n'}
      {AppVersion.version}
    </Text>
  );
};

export const openWhatsApp = (contactNumber, name) => {
  try {
    let number = contactNumber || '';
    const message = `Hi, ${name || ''}`;

    if (!number.startsWith('+91')) {
      number = `+91${number}`;
    }

    let whatsappUrl = '';
    if (Platform.OS === 'android') {
      whatsappUrl = `whatsapp://send?phone=${number}&text=${message}`;
    } else {
      whatsappUrl = `whatsapp://app?phone=${number}&text=${message}`;
    }

    Linking.openURL(whatsappUrl).catch(() => {
      showToast(
        'WhatsApp is not installed or installed but could not be opened.',
      );
    });
  } catch (error) {
    showToast(
      'WhatsApp is not installed or installed but could not be opened.',
    );
  }
};

export const openDialer = contactNumber => {
  let number = contactNumber || '';
  if (!number.startsWith('+91')) {
    number = `+91${number}`;
  }
  const url = `tel:${number}`;
  Linking.canOpenURL(url)
    .then(supported => {
      if (supported) {
        Linking.openURL(url).catch(err => {
          console.error('Error opening URL:', err);
          showToast('Error', 'Unable to open dialer. Please try again.');
        });
      } else {
        showToast(
          'Dialer Not Available',
          'It seems like your device does not have a compatible dialer app. Please check your phone settings.',
        );
      }
    })
    .catch(err => console.error('Error checking URL support:', err));
};

// export const openDialer = contactNumber => {
//   let number = contactNumber || '';
//   if (!number.startsWith('+91')) {
//     number = `+91${number}`;
//   }

//   // const formattedNumber = contactNumber.replace(/[^0-9+]/g, ''); // Removes invalid characters
//   const url = `tel:${number}`;
//   Linking.canOpenURL(url)
//     .then(supported => {
//       console.log('Opening dialer:', supported);
//       if (supported) {
//         return Linking.openURL(url);
//       } else {
//         showToast('Dialer app is not available on this device.');
//       }
//     })
//     .catch(err => console.error('Error opening dialer', err));
// };

export const openEmail = EmailID => {
  const email = EmailID || ''; // Email address
  const subject = ''; // Subject
  const body = ''; // Email body

  // mailto link
  const mailto = `mailto:${email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;

  Linking.openURL(mailto)
    .then(() => {
      console.log('Email client opened.');
    })
    .catch(err => {
      showToast('Unable to open email client.');
      console.error('Error opening email client:', err);
    });
};

export const getLastDateOfCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDayOfNextMonth = new Date(year, month + 1, 1);
  const lastDayOfCurrentMonth = new Date(firstDayOfNextMonth - 1);

  const formattedDate = lastDayOfCurrentMonth.toISOString().split('T')[0];

  return formattedDate;
};

export const getFirstDateOfCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDayOfCurrentMonth = new Date(year, month, 1);
  const formattedDate = firstDayOfCurrentMonth.toISOString().split('T')[0];

  return formattedDate;
};

// ============================================================================
//  Lead-contact tracking
// ============================================================================
//
//  When the employee taps a Call / WhatsApp / Email button, we fire a
//  fire-and-forget POST to /lead/:id/touch BEFORE the native intent opens.
//  The backend stores it with a clientNonce so retries / offline-queue flushes
//  don't double-count. The nonce is also stashed in AsyncStorage keyed by
//  leadId, so the QuickUpdate popup can include it in the subsequent lead PUT —
//  that lets the backend grade the engagement as "Verified" (tap + comment by
//  same user within 30 min) rather than just "Low confidence".

const LEAD_TOUCH_QUEUE_KEY = '@lead_touch_pending_queue';
const LEAD_TOUCH_NONCE_PREFIX = '@lead_touch_nonce_';

/** RFC4122-ish v4. Good enough as an idempotency key — does not need cryptographic strength. */
const generateNonce = () => {
  const hex = '0123456789abcdef';
  let out = '';
  for (let i = 0; i < 32; i++) {
    out += hex[(Math.random() * 16) | 0];
    if (i === 7 || i === 11 || i === 15 || i === 19) out += '-';
  }
  return out;
};

/** Remember the last touch nonce for a given lead so QuickUpdate can attach it. */
export const rememberLastTouchNonce = async (leadId, nonce) => {
  if (!leadId || !nonce) return;
  try {
    await AsyncStorage.setItem(
      LEAD_TOUCH_NONCE_PREFIX + leadId,
      JSON.stringify({nonce, at: Date.now()}),
    );
  } catch (_) {
    /* non-fatal */
  }
};

/** Retrieve the most recent touch nonce for a lead. Returns null if older than 30 min. */
export const consumeLastTouchNonce = async leadId => {
  if (!leadId) return null;
  try {
    const raw = await AsyncStorage.getItem(LEAD_TOUCH_NONCE_PREFIX + leadId);
    if (!raw) return null;
    const {nonce, at} = JSON.parse(raw);
    if (Date.now() - at > 30 * 60 * 1000) return null;
    return nonce;
  } catch (_) {
    return null;
  }
};

/** Persist failed touches so we can replay them when the network returns. */
const enqueueTouchForRetry = async payload => {
  try {
    const raw = await AsyncStorage.getItem(LEAD_TOUCH_QUEUE_KEY);
    const queue = raw ? JSON.parse(raw) : [];
    queue.push(payload);
    // Keep the queue bounded — 100 most-recent are plenty for a phone.
    const trimmed = queue.slice(-100);
    await AsyncStorage.setItem(LEAD_TOUCH_QUEUE_KEY, JSON.stringify(trimmed));
  } catch (_) {
    /* swallow — touch retry is best-effort */
  }
};

/**
 * Send (or queue) a touch event for a lead.
 *
 *   logLeadTouch({ leadId, channel: 'CALL', sessionId: authData.sessionId, firstName })
 *
 * Returns the nonce immediately so callers can stash it; the network call is
 * non-blocking — we don't await it because we want the dialer/WhatsApp to open
 * instantly.
 */
export const logLeadTouch = ({
  leadId,
  channel,
  sessionId,
  appVersion = AppVersion.version,
}) => {
  if (!leadId || !channel) return null;
  const nonce = generateNonce();
  const payload = {
    channel,
    source: 'MOBILE',
    intentAt: new Date().toISOString(),
    clientNonce: nonce,
    meta: {
      appVersion: appVersion || '',
      platform: Platform.OS,
    },
  };
  const endpoint = `${END_POINT.afterAuth.leadTouch}/${leadId}/touch`;

  // Stash nonce so the follow-up QuickUpdate can include it.
  rememberLastTouchNonce(leadId, nonce);

  API.postAuthAPI(payload, endpoint, sessionId, null, res => {
    if (!res?.status) {
      // Network or server hiccup — queue for retry on next app foreground.
      enqueueTouchForRetry({leadId, payload});
    }
  });

  return nonce;
};

/** Flush any touches that failed to send while offline. Safe to call any time. */
export const flushPendingLeadTouches = async sessionId => {
  try {
    const raw = await AsyncStorage.getItem(LEAD_TOUCH_QUEUE_KEY);
    if (!raw) return;
    const queue = JSON.parse(raw);
    if (!Array.isArray(queue) || queue.length === 0) return;

    // Clear first — if a retry fails we'll re-enqueue from the helper.
    await AsyncStorage.removeItem(LEAD_TOUCH_QUEUE_KEY);

    queue.forEach(({leadId, payload}) => {
      const endpoint = `${END_POINT.afterAuth.leadTouch}/${leadId}/touch`;
      API.postAuthAPI(payload, endpoint, sessionId, null, res => {
        if (!res?.status) enqueueTouchForRetry({leadId, payload});
      });
    });
  } catch (_) {
    /* swallow */
  }
};
