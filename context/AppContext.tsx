"use client"

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react"
import type {
  User,
  Product,
  CartItem,
  Order,
  OrderStatus,
  PaymentMethod,
} from "@/lib/types"
import { MOCK_USER } from "@/lib/mock-data"

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

interface AppState {
  user: User | null
  cart: {
    storeId: string | null
    items: CartItem[]
  }
  orders: Order[]
  activeOrderId: string | null
}

const initialState: AppState = {
  // TODO: replace with API call (fetch current user session)
  user: MOCK_USER,
  cart: { storeId: null, items: [] },
  orders: [],
  activeOrderId: null,
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

type AppAction =
  | { type: "SET_USER"; payload: User }
  | { type: "CLEAR_USER" }
  | { type: "ADD_TO_CART"; payload: { product: Product; storeId: string } }
  | { type: "REMOVE_FROM_CART"; payload: { productId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "PLACE_ORDER"; payload: { storeName: string; paymentMethod: PaymentMethod } }
  | { type: "UPDATE_ORDER_STATUS"; payload: { orderId: string; status: OrderStatus } }
  | { type: "SET_ACTIVE_ORDER"; payload: { orderId: string | null } }

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload }

    case "CLEAR_USER":
      return { ...state, user: null }

    case "ADD_TO_CART": {
      const { product, storeId } = action.payload
      let items = state.cart.items

      // If adding from a different store, warn and reset cart
      if (state.cart.storeId !== null && state.cart.storeId !== storeId) {
        console.warn(
          `[AppContext] Cart reset: switched from store "${state.cart.storeId}" to "${storeId}".`
        )
        items = []
      }

      const existingIndex = items.findIndex(
        (i) => i.product.id === product.id
      )

      let updatedItems: CartItem[]
      if (existingIndex >= 0) {
        updatedItems = items.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        updatedItems = [...items, { product, quantity: 1, storeId }]
      }

      return {
        ...state,
        cart: { storeId, items: updatedItems },
      }
    }

    case "REMOVE_FROM_CART": {
      const updatedItems = state.cart.items.filter(
        (i) => i.product.id !== action.payload.productId
      )
      return {
        ...state,
        cart: {
          storeId: updatedItems.length === 0 ? null : state.cart.storeId,
          items: updatedItems,
        },
      }
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload
      if (quantity <= 0) {
        // Treat as remove
        const updatedItems = state.cart.items.filter(
          (i) => i.product.id !== productId
        )
        return {
          ...state,
          cart: {
            storeId: updatedItems.length === 0 ? null : state.cart.storeId,
            items: updatedItems,
          },
        }
      }
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        },
      }
    }

    case "CLEAR_CART":
      return { ...state, cart: { storeId: null, items: [] } }

    case "PLACE_ORDER": {
      const { storeName, paymentMethod: _paymentMethod } = action.payload
      const total = state.cart.items.reduce(
        (sum, item) => sum + item.quantity * item.product.price,
        0
      )
      const pickupCode = Math.floor(Math.random() * 90) + 10
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        storeId: state.cart.storeId ?? "",
        storeName,
        items: state.cart.items,
        total,
        status: "pending",
        pickupCode,
        createdAt: Date.now(),
      }
      return {
        ...state,
        orders: [...state.orders, newOrder],
        activeOrderId: newOrder.id,
        cart: { storeId: null, items: [] },
      }
    }

    case "UPDATE_ORDER_STATUS":
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.payload.orderId
            ? { ...o, status: action.payload.status }
            : o
        ),
      }

    case "SET_ACTIVE_ORDER":
      return { ...state, activeOrderId: action.payload.orderId }

    default:
      return state
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  cartCount: number
}

const AppContext = createContext<AppContextValue | null>(null)

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const cartCount = state.cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  return (
    <AppContext.Provider value={{ state, dispatch, cartCount }}>
      {children}
    </AppContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (ctx === null) {
    throw new Error("useApp must be used within AppProvider")
  }
  return ctx
}
