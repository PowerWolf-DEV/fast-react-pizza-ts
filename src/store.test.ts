import { describe, it, expect } from 'vitest';
import store from './store';

describe('store', () => {
  it('should have user and cart reducers', () => {
    const state = store.getState();
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('cart');
  });

  it('should have correct initial user state', () => {
    const state = store.getState();
    expect(state.user).toEqual({
      username: '',
      status: 'idle',
      position: null,
      address: '',
      error: '',
    });
  });

  it('should have correct initial cart state', () => {
    const state = store.getState();
    expect(state.cart).toEqual({ cart: [] });
  });

  it('should dispatch actions correctly', () => {
    store.dispatch({ type: 'user/updateName', payload: 'Test User' });
    expect(store.getState().user.username).toBe('Test User');

    store.dispatch({
      type: 'cart/addItem',
      payload: {
        pizzaId: 1,
        name: 'Test Pizza',
        quantity: 1,
        unitPrice: 10,
        totalPrice: 10,
      },
    });
    expect(store.getState().cart.cart).toHaveLength(1);
  });
});