import {Text, Dimensions, Platform, Linking} from 'react-native';
import {AppVersion} from './staticData';
import {showToast} from '../components/showToast';

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
    const message = `Hello ${name || ''}`;

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
