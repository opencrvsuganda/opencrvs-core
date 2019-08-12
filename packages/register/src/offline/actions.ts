import { ILocation } from '@register/offline/reducer'
import { ILanguage, ILanguageState } from '@register/i18n/reducer'
import {
  ILocationDataResponse,
  ILanguagesDataResponse,
  IFacilitiesDataResponse
} from '@register/utils/referenceApi'
import { IUserDetails } from '@register/utils/userUtils'

export const GET_LOCATIONS = 'OFFLINE/GET_LOCATIONS'
type GetLocations = {
  type: typeof GET_LOCATIONS
  payload: string
}

export const LANGUAGES_LOADED = 'OFFLINE/LANGUAGES_LOADED'
export type LanguagesLoadedAction = {
  type: typeof LANGUAGES_LOADED
  payload: ILanguage[]
}

export const LANGUAGES_FAILED = 'OFFLINE/LANGUAGES_FAILED'
export type LanguagesFailedAction = {
  type: typeof LANGUAGES_FAILED
  payload: Error
}

export const LOCATIONS_LOADED = 'OFFLINE/LOCATIONS_LOADED'
export type LocationsLoadedAction = {
  type: typeof LOCATIONS_LOADED
  payload: { [key: string]: ILocation }
}

export const LOCATIONS_FAILED = 'OFFLINE/LOCATIONS_FAILED'
export type LocationsFailedAction = {
  type: typeof LOCATIONS_FAILED
  payload: Error
}

export const FACILITIES_LOADED = 'OFFLINE/FACILITIES_LOADED'
export type FacilitiesLoadedAction = {
  type: typeof FACILITIES_LOADED
  payload: { [key: string]: ILocation }
}

export const FACILITIES_FAILED = 'OFFLINE/FACILITIES_FAILED'
export type FacilitiesFailedAction = {
  type: typeof FACILITIES_FAILED
  payload: Error
}

export const SET_OFFLINE_DATA = 'OFFLINE/SET_OFFLINE_DATA'
type SetOfflineData = {
  type: typeof SET_OFFLINE_DATA
  payload: IUserDetails
}
export const GET_OFFLINE_DATA_SUCCESS = 'OFFLINE/GET_OFFLINE_DATA_SUCCESS'
export type IGetOfflineDataSuccessAction = {
  type: typeof GET_OFFLINE_DATA_SUCCESS
  payload: string
}
export const GET_OFFLINE_DATA_FAILED = 'OFFLINE/GET_OFFLINE_DATA_FAILED'
export type IGetOfflineDataFailedAction = {
  type: typeof GET_OFFLINE_DATA_FAILED
}
export const FORMAT_LOCATIONS = 'OFFLINE/FORMAT_LOCATIONS'
export type IFilterLocationsAction = {
  type: typeof FORMAT_LOCATIONS
  payload: ILanguageState
}
export const LOAD_LOCATIONS = 'OFFLINE/LOAD_LOCATIONS'
export type ILoadLocationsAction = {
  type: typeof LOAD_LOCATIONS
  payload: ILanguageState
}
export type Action =
  | GetLocations
  | LocationsFailedAction
  | LocationsLoadedAction
  | SetOfflineData
  | IGetOfflineDataSuccessAction
  | IGetOfflineDataFailedAction
  | FacilitiesLoadedAction
  | FacilitiesFailedAction
  | LanguagesFailedAction
  | LanguagesLoadedAction
  | IFilterLocationsAction
  | ILoadLocationsAction

export const locationsLoaded = (
  payload: ILocationDataResponse
): LocationsLoadedAction => ({
  type: LOCATIONS_LOADED,
  payload: payload.data
})

export const facilitiesFailed = (error: Error): FacilitiesFailedAction => ({
  type: FACILITIES_FAILED,
  payload: error
})

export const facilitiesLoaded = (
  payload: IFacilitiesDataResponse
): FacilitiesLoadedAction => ({
  type: FACILITIES_LOADED,
  payload: payload.data
})

export const locationsFailed = (error: Error): LocationsFailedAction => ({
  type: LOCATIONS_FAILED,
  payload: error
})

export const setOfflineData = (userDetails: IUserDetails): SetOfflineData => ({
  type: SET_OFFLINE_DATA,
  payload: userDetails
})

export const getOfflineDataSuccess = (
  response: string
): IGetOfflineDataSuccessAction => ({
  type: GET_OFFLINE_DATA_SUCCESS,
  payload: response
})

export const getOfflineDataFailed = (): IGetOfflineDataFailedAction => ({
  type: GET_OFFLINE_DATA_FAILED
})

export const languagesLoaded = (
  payload: ILanguagesDataResponse
): LanguagesLoadedAction => ({
  type: LANGUAGES_LOADED,
  payload: payload.data
})

export const languagesFailed = (error: Error): LanguagesFailedAction => ({
  type: LANGUAGES_FAILED,
  payload: error
})

export const filterLocationsByLanguage = (
  languageState: ILanguageState
): IFilterLocationsAction => ({
  type: FORMAT_LOCATIONS,
  payload: languageState
})

export const loadLocations = (
  languageState: ILanguageState
): ILoadLocationsAction => ({
  type: LOAD_LOCATIONS,
  payload: languageState
})
