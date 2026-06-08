import { HTTP_STATUS } from "@/constants";
import { CreateStoreInput, NearbyStoresQuery, UpdateStoreInput } from "@/modules/stores/stores.validation";
import { StoreModel, STORE_STATUSES } from "@/modules/stores/stores.model";
import { ApiError } from "@/utils/ApiError";

const calculateDistanceKm = (
  latitude: number,
  longitude: number,
  storeLatitude?: number,
  storeLongitude?: number
) => {
  if (storeLatitude === undefined || storeLongitude === undefined) {
    return Number.MAX_SAFE_INTEGER;
  }

  const earthRadiusKm = 6371;
  const latitudeDistance = ((storeLatitude - latitude) * Math.PI) / 180;
  const longitudeDistance = ((storeLongitude - longitude) * Math.PI) / 180;
  const firstLatitude = (latitude * Math.PI) / 180;
  const secondLatitude = (storeLatitude * Math.PI) / 180;
  const haversine =
    Math.sin(latitudeDistance / 2) * Math.sin(latitudeDistance / 2) +
    Math.sin(longitudeDistance / 2) *
      Math.sin(longitudeDistance / 2) *
      Math.cos(firstLatitude) *
      Math.cos(secondLatitude);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

export const getPublicStores = () =>
  StoreModel.find({ status: STORE_STATUSES.ACTIVE }).sort({ createdAt: -1 });

export const getNearbyStores = async (query: NearbyStoresQuery) => {
  const stores = await StoreModel.find({ status: STORE_STATUSES.ACTIVE });

  return stores
    .map((store) => ({
      ...store.toObject(),
      distanceKm: calculateDistanceKm(
        query.latitude,
        query.longitude,
        store.latitude,
        store.longitude
      )
    }))
    .filter((store) => store.distanceKm <= query.radiusKm)
    .sort((first, second) => first.distanceKm - second.distanceKm);
};

export const createStore = (payload: CreateStoreInput) => StoreModel.create(payload);

export const updateStore = async (id: string, payload: UpdateStoreInput) => {
  const store = await StoreModel.findByIdAndUpdate(id, payload, { new: true });

  if (!store) {
    throw new ApiError("Store not found", HTTP_STATUS.NOT_FOUND);
  }

  return store;
};

export const deleteStore = async (id: string) => {
  const store = await StoreModel.findByIdAndDelete(id);

  if (!store) {
    throw new ApiError("Store not found", HTTP_STATUS.NOT_FOUND);
  }

  return store;
};
