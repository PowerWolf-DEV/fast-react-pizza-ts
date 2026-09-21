import { describe, it, expect } from 'vitest';
import userReducer, { updateName, fetchAddress } from './userSlice';

describe('userSlice', () => {
  const initialState = {
    username: '',
    status: 'idle' as const,
    position: null,
    address: '',
    error: '',
  };

  describe('reducers', () => {
    it('should update username', () => {
      const state = userReducer(initialState, updateName('Test User'));
      expect(state.username).toBe('Test User');
    });
  });

  describe('fetchAddress thunk', () => {
    it('should set status to loading when pending', () => {
      const state = userReducer(initialState, fetchAddress.pending('', undefined));
      expect(state.status).toBe('loading');
    });

    it('should update position and address when fulfilled', () => {
      const payload = {
        position: { latitude: 10, longitude: 20 },
        address: 'Test Address',
      };
      const state = userReducer(initialState, fetchAddress.fulfilled(payload, '', undefined));
      expect(state.status).toBe('idle');
      expect(state.position).toEqual({ latitude: 10, longitude: 20 });
      expect(state.address).toBe('Test Address');
      expect(state.error).toBe('');
    });

    it('should set error when rejected', () => {
      const state = userReducer(initialState, fetchAddress.rejected(new Error('test'), '', undefined, 'Permission denied'));
      expect(state.status).toBe('error');
      expect(state.error).toBe('Permission denied');
    });
  });
});