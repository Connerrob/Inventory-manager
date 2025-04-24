import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

// Compare fields safely, normalizing for trimming and type
const getChangedFields = (oldItem, newItem) => {
  const changes = {};
  for (const key in newItem) {
    const oldVal = oldItem[key]?.toString().trim() ?? '';
    const newVal = newItem[key]?.toString().trim() ?? '';

    if (oldVal !== newVal) {
      changes[key] = {
        from: oldVal,
        to: newVal,
      };
    }
  }
  return changes;
};

// Smarter name grabber
const getAssetName = (item) => {
  return (
    item.name ||
    item['Item Name'] ||
    item.itemName ||
    item.newItem?.name ||
    item.newItem?.['Item Name'] ||
    '(Unnamed)'
  );
};

export const logAction = async (action, data) => {
  try {
    const logCollection = collection(db, 'assetLogs');

    let logEntry = {
      actionType: action,
      timestamp: new Date().toISOString(),
    };

    if (action === 'edit') {
      const { oldItem, newItem } = data;
      const changes = getChangedFields(oldItem, newItem);

      logEntry.assetName = getAssetName(newItem);
      if (Object.keys(changes).length === 0) {
        logEntry.note = 'No actual changes detected.';
        logEntry.changes = null;
      } else {
        logEntry.changes = changes;
      }
    } else {
      logEntry.assetName = getAssetName(data);
      logEntry.changes = null;
    }

    await addDoc(logCollection, logEntry);
    console.log(`[Log] ${action} "${logEntry.assetName}"`, logEntry.changes ?? logEntry.note ?? data);
  } catch (error) {
    console.error('Error logging action:', error);
  }
};
