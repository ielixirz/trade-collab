import {
  fromTask, put, percentage, getDownloadURL, getMetadata,
} from 'rxfire/storage';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import 'firebase/storage';

import { FirebaseApp } from '../firebase';

const storage = FirebaseApp.storage();

export const PutFile = (StorageRefPath, File) => {
  const RefPath = storage.ref(StorageRefPath);

  return put(RefPath, File);
};

export const GetTaskProgress = ObserablePut => fromTask(ObserablePut).pipe(
  map(snapshot => snapshot.bytesTransferred),
);

export const GetPercentage = ObserablePut => percentage(ObserablePut).pipe(
  map(snapshot => snapshot.progress),
);

export const GetDownloadURL = ObserablePut => ObserablePut.pipe(
  map(snapshot => snapshot.downloadURL),
);

export const GetTotalFileSize = ObserablePut => ObserablePut.pipe(
  map(snapshot => snapshot.totalBytes),
);

export const GetStorageRefPathFromURL = Url => storage.refFromURL(Url);

export const GetURLFromStorageRefPath = StorageRefPath => getDownloadURL(StorageRefPath);

export const GetMetaDataFromStorageRefPath = (StorageRefPath) => {
  const RefPath = storage.ref(StorageRefPath);
  return getMetadata(RefPath);
};

export const GetMetaDataFromURL = (Url) => {
  const StorageRefPath = storage.refFromURL(Url);

  return GetMetaDataFromStorageRefPath(StorageRefPath);
};

export const DeleteFileFromStorageRefPath = StorageRefPath => from(StorageRefPath.delete());

export const DeleteFileFromURL = (Url) => {
  const StorageRefPath = storage.refFromURL(Url);

  return from(StorageRefPath.delete());
};
