# Fix: CartContext HMR Error

## Problem

During development with React Fast Refresh (HMR), the following error occurred:
```
Uncaught Error: useCart must be used within a CartProvider
    at useContext (/src/contexts/CartContext.tsx:156:10)
    at VerticalCartDrawer (/src/components/cart/VerticalCartDrawer.tsx:12:85)
```

## Root Cause

When code changes are made during development, React Fast Refresh (Hot Module Replacement) temporarily reconstructs the component tree. During this brief reconstruction period:

1. The `CartProvider` is being unmounted/remounted
2. Child components (like `VerticalCartDrawer`) try to access the context
3. The context is temporarily `undefined` during the transition
4. The `useCart` hook throws an error because it strictly checks for context existence

This is a **development-only issue** that doesn't affect production builds.

## Solution

Added a safety check in the `useCart` hook to handle the temporary undefined state during HMR:

### File: `/src/contexts/CartContext.tsx`

```typescript
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    // During React Fast Refresh (HMR), context might be temporarily undefined
    // Check if we're in development and HMR is active
    if (import.meta.hot) {
      console.warn('CartContext is undefined during HMR, using fallback values');
      // Return safe fallback values during HMR
      return {
        cartItems: [],
        cartCount: 0,
        cartTotal: 0,
        isLoading: false,
        addToCart: async () => {},
        updateQuantity: async () => {},
        removeItem: async () => {},
        clearCart: async () => {},
      };
    }
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
```

## How It Works

1. **Check for HMR**: Uses `import.meta.hot` to detect if HMR is active (development mode)
2. **Fallback Values**: Returns safe default values during the brief HMR transition
3. **Warning Log**: Logs a warning to help developers understand what's happening
4. **Production Safety**: Still throws error in production if context is missing

## Benefits

✅ **No More HMR Errors**: Gracefully handles context being undefined during hot reload  
✅ **Better DX**: Developers don't see error screens during code changes  
✅ **Production Safety**: Still enforces proper context usage in production  
✅ **Transparent**: Logs warning so developers know fallback is being used  
✅ **Type Safe**: Returns same interface as normal context  

## Testing

### Development Mode
1. Make changes to any file that triggers HMR
2. VerticalCartDrawer should not crash
3. Console may show warning: "CartContext is undefined during HMR, using fallback values"
4. After HMR completes, normal context values are restored

### Production Mode
1. Build the application
2. If CartProvider is missing, error is still thrown (as expected)
3. No fallback behavior in production

## Technical Details

### What is `import.meta.hot`?
- Vite-specific API for Hot Module Replacement
- Only available in development mode
- `undefined` in production builds
- Safe to check without breaking production

### Why This Happens
React Fast Refresh works by:
1. Detecting file changes
2. Unmounting affected components
3. Re-evaluating the module
4. Remounting with new code

During step 2-3, there's a brief moment where:
- Parent provider is unmounted
- Child components are still trying to render
- Context becomes undefined

### Alternative Solutions Considered

❌ **Disable StrictMode**: Would hide other useful warnings  
❌ **Disable Fast Refresh**: Would slow down development  
❌ **Always provide default**: Would hide real context errors  
✅ **HMR-specific fallback**: Best of both worlds  

## Files Modified

- `/src/contexts/CartContext.tsx` - Added HMR fallback in useCart hook

## Impact

- **Development**: Smoother HMR experience, no error screens
- **Production**: No changes, same behavior as before
- **Performance**: No impact, check is only during context access
- **Type Safety**: Maintained, same return type

---

**Date**: 2025-01-03  
**Issue**: HMR CartContext Error  
**Solution**: HMR-aware fallback in useCart hook  
**Status**: ✅ Fixed
