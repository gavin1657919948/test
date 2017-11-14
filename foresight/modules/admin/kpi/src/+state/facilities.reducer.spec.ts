import { facilitiesReducer } from './facilities.reducer';
import { facilitiesInitialState } from './facilities.init';
import { Facilities } from './facilities.interfaces';
import { DataLoaded } from './facilities.actions';

describe('facilitiesReducer', () => {
  it('should work', () => {
    const state: Facilities = {};
    const action: DataLoaded = { type: 'DATA_LOADED', payload: {} };
    const actual = facilitiesReducer(state, action);
    expect(actual).toEqual({});
  });
});
