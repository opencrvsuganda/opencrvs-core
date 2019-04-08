import { IFormData, Event } from '../forms'
import { GO_TO_TAB, Action as NavigationAction } from 'src/navigation'
import { storage } from 'src/storage'
import { loop, Cmd, LoopReducer, Loop } from 'redux-loop'
import { v4 as uuid } from 'uuid'

const SET_INITIAL_DRAFTS = 'DRAFTS/SET_INITIAL_DRAFTS'
const STORE_DRAFT = 'DRAFTS/STORE_DRAFT'
const MODIFY_DRAFT = 'DRAFTS/MODIFY_DRAFT'
const WRITE_DRAFT = 'DRAFTS/WRITE_DRAFT'
const DELETE_DRAFT = 'DRAFTS/DELETE_DRAFT'
const GET_DRAFTS_SUCCESS = 'DRAFTS/GET_DRAFTS_SUCCESS'
const GET_DRAFTS_FAILED = 'DRAFTS/GET_DRAFTS_FAILED'

export interface IDraft {
  id: string
  data: IFormData
  savedOn?: number
  modifiedOn?: number
  eventType?: string
  review?: boolean
  event: Event
  status?: string
}

interface IStoreDraftAction {
  type: typeof STORE_DRAFT
  payload: { draft: IDraft }
}

interface IModifyDraftAction {
  type: typeof MODIFY_DRAFT
  payload: {
    draft: IDraft
  }
}

interface IWriteDraftAction {
  type: typeof WRITE_DRAFT
  payload: {
    draft: IDraftsState
  }
}

interface ISetInitialDraftsAction {
  type: typeof SET_INITIAL_DRAFTS
}

interface IDeleteDraftAction {
  type: typeof DELETE_DRAFT
  payload: {
    draft: IDraft
  }
}

interface IGetStorageDraftsSuccessAction {
  type: typeof GET_DRAFTS_SUCCESS
  payload: string
}

interface IGetStorageDraftsFailedAction {
  type: typeof GET_DRAFTS_FAILED
}

type Action =
  | IStoreDraftAction
  | IModifyDraftAction
  | ISetInitialDraftsAction
  | IWriteDraftAction
  | NavigationAction
  | IDeleteDraftAction
  | IGetStorageDraftsSuccessAction
  | IGetStorageDraftsFailedAction

interface IUserData {
  userID: string
  drafts: IDraft[]
  userPIN: number
}

export interface IDraftsState {
  userID: string
  initialDraftsLoaded: boolean
  drafts: IDraft[]
}

const initialState = {
  userID: '',
  initialDraftsLoaded: false,
  drafts: []
}

export function createDraft(event: Event) {
  return { id: uuid(), data: {}, event }
}
export function createReviewDraft(
  draftId: string,
  formData: IFormData,
  event: Event,
  status?: string
): IDraft {
  return { id: draftId, data: formData, review: true, event, status }
}

export function storeDraft(draft: IDraft): IStoreDraftAction {
  draft.savedOn = Date.now()
  return { type: STORE_DRAFT, payload: { draft } }
}

export function modifyDraft(draft: IDraft): IModifyDraftAction {
  draft.modifiedOn = Date.now()
  return { type: MODIFY_DRAFT, payload: { draft } }
}
export function setInitialDrafts() {
  return { type: SET_INITIAL_DRAFTS }
}

export const getStorageDraftsSuccess = (
  response: string
): IGetStorageDraftsSuccessAction => ({
  type: GET_DRAFTS_SUCCESS,
  payload: response
})

export const getStorageDraftsFailed = (): IGetStorageDraftsFailedAction => ({
  type: GET_DRAFTS_FAILED
})

export function deleteDraft(draft: IDraft): IDeleteDraftAction {
  return { type: DELETE_DRAFT, payload: { draft } }
}

function writeDraft(draft: IDraftsState): IWriteDraftAction {
  return { type: WRITE_DRAFT, payload: { draft } }
}

export const draftsReducer: LoopReducer<IDraftsState, Action> = (
  state: IDraftsState = initialState,
  action: Action
): IDraftsState | Loop<IDraftsState, Action> => {
  switch (action.type) {
    case GO_TO_TAB: {
      const draft = state.drafts.find(({ id }) => id === action.payload.draftId)

      if (!draft || draft.data[action.payload.tabId]) {
        return state
      }
      const modifiedDraft = {
        ...draft,
        data: {
          ...draft.data,
          [action.payload.tabId]: {}
        }
      }
      return loop(state, Cmd.action(modifyDraft(modifiedDraft)))
    }
    case STORE_DRAFT:
      const stateAfterDraftStore = {
        ...state,
        drafts: state.drafts.concat(action.payload.draft)
      }
      return loop(
        stateAfterDraftStore,
        Cmd.action(writeDraft(stateAfterDraftStore))
      )
    case DELETE_DRAFT:
      const deleteIndex = state.drafts.findIndex(draft => {
        return draft.id === action.payload.draft.id
      })
      if (deleteIndex >= 0) {
        state.drafts.splice(deleteIndex, 1)
      }
      const stateAfterDraftDeletion = {
        ...state,
        drafts: state.drafts
      }
      return loop(
        stateAfterDraftDeletion,
        Cmd.action(writeDraft(stateAfterDraftDeletion))
      )
    case MODIFY_DRAFT:
      const stateAfterDraftModification = {
        ...state,
        drafts: state.drafts.map(draft => {
          if (draft.id === action.payload.draft.id) {
            return action.payload.draft
          }
          return draft
        })
      }
      return loop(
        stateAfterDraftModification,
        Cmd.action(writeDraft(stateAfterDraftModification))
      )
    case WRITE_DRAFT:
      if (state.initialDraftsLoaded && state.drafts) {
        writeDraftByUser(state.userID, action.payload.draft.drafts)
      }
      return state
    case SET_INITIAL_DRAFTS:
      return loop(
        {
          ...state
        },
        Cmd.run<IGetStorageDraftsSuccessAction | IGetStorageDraftsFailedAction>(
          getDraftsOfCurrentUser,
          {
            successActionCreator: getStorageDraftsSuccess,
            failActionCreator: getStorageDraftsFailed,
            args: []
          }
        )
      )
    case GET_DRAFTS_SUCCESS:
      const idDrafts = JSON.parse(action.payload) as IUserWiseDrafts
      return {
        ...state,
        userID: idDrafts.userID,
        drafts: idDrafts.drafts,
        initialDraftsLoaded: true
      }
    default:
      return state
  }
}

interface IUserWiseDrafts {
  userID: string
  drafts: IDraft[]
}

async function getDraftsOfCurrentUser(): Promise<string> {
  const currentUserID = JSON.parse(await storage.getItem('USER_DETAILS'))
    .userMgntUserID
  const allUserData = JSON.parse(
    await storage.getItem('USER_DATA')
  ) as IUserData[]
  if (!allUserData || !allUserData.length) {
    // No user-data at all
    return `"userID": "${currentUserID}", "drafts":"[]"`
  }

  const currentUserData = allUserData.find(
    uData => uData.userID === currentUserID
  )
  const currentUserDrafts = currentUserData ? currentUserData.drafts : []
  return JSON.stringify({
    userID: currentUserID,
    drafts: currentUserDrafts
  })
}

async function writeDraftByUser(userID: string, newDrafts: IDraft[]) {
  const str = await storage.getItem('USER_DATA')
  const allUserData: IUserData[] =
    str === '[]' || str === '{}' || str === '' || str === 'null'
      ? []
      : (JSON.parse(str) as IUserData[])
  const currentUserData = allUserData.find(uData => uData.userID === userID)

  if (currentUserData) {
    currentUserData.drafts = newDrafts
  } else {
    allUserData.push({
      userID,
      userPIN: 1234,
      drafts: newDrafts
    })
  }

  storage.setItem('USER_DATA', JSON.stringify(allUserData))
}
