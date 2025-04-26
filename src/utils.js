import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export const logAction = async (actionType, itemData) => {
  try {
    const assetName = itemData?.name || 'Unknown';
    const logEntry = {
      actionType,
      assetName,
      timestamp: Timestamp.now(),
    };

    if (actionType === 'edit' && itemData.oldItem && itemData.newItem) {
      logEntry.assetName = itemData.newItem.name || itemData.oldItem.name || 'Unknown';
      logEntry.changes = getChanges(itemData.oldItem, itemData.newItem);
    }

    await addDoc(collection(db, 'assetLogs'), logEntry);
  } catch (error) {
    console.error('Error logging action:', error);
  }
};

const getChanges = (oldItem, newItem) => {
  const changes = {};
  for (const key in newItem) {
    if (newItem[key] !== oldItem[key]) {
      changes[key] = {
        from: oldItem[key],
        to: newItem[key],
      };
    }
  }
  return Object.keys(changes).length ? changes : null;
};
