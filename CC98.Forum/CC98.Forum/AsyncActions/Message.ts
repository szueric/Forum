import { Action, ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from '../Store';
import * as Actions from '../Actions/Message';
import { RootState } from '../Store';
import * as Utility from '../Utility';
import { MessageInfo } from '../Reducers/Message';

export const refreshCurrentMessageCount: ActionCreator<ThunkAction<Promise<Action>, RootState, void>> = (message: MessageInfo) => async (dispatch, getState) => {
    try {
        let headers = await Utility.formAuthorizeHeader();
        let res = await Utility.cc98Fetch('/me/unread-count', {
            headers
        });
        let data = await res.json() as MessageInfo;
        return dispatch(Actions.changeMessageCount(data));
    } catch(e) {
        console.error(e.message)
    }
}