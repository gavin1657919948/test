import { Facilities } from './facilities.interfaces';
import { FacilitiesAction } from './facilities.actions';

export function facilitiesReducer(state: Facilities, action: FacilitiesAction): Facilities {
  switch (action.type) {
    case 'DATA_LOADED': {
      return { ...state, ...action.payload };
    }
    default: {
      return state;
    }
  }
}
