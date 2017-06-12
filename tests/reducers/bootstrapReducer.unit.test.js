import { BOOTSTRAP_APP } from '../../app/constants';
import { initialState } from '../../app/reducers/rootReducer';
import reduce from '../../app/reducers/bootstrapReducer';

test('hydrates app state', () => {
  const action = {
    type: BOOTSTRAP_APP,
    data: {
      googleApiKey: 'fooBarBaz1234',
      googleSheetId: 'IdFoo456',
    },
    src: 'bootstrap.new',
  };

  expect(reduce(initialState, action)).toMatchObject({
    googleApiKey: 'fooBarBaz1234',
    googleSheetId: 'IdFoo456',
  });
});
