import { useReducer, useEffect, useCallback } from 'react';
import { DEFAULT_BLOCKS } from '../blocks/blockTypes';

const STORAGE_KEY = 'pagecraft_v1';

// ── Reducer ──────────────────────────────────────────────────────────────────
const blocksReducer = (state, action) => {
  switch (action.type) {

    case 'ADD_BLOCK': {
      // If insertAfter index given, splice; else append
      const newBlocks = [...state.blocks];
      const idx = action.afterIndex !== undefined ? action.afterIndex + 1 : newBlocks.length;
      newBlocks.splice(idx, 0, action.block);
      return { ...state, blocks: newBlocks };
    }

    case 'REMOVE_BLOCK':
      return {
        ...state,
        blocks: state.blocks.filter(b => b.id !== action.id),
        selectedId: state.selectedId === action.id ? null : state.selectedId,
      };

    case 'UPDATE_BLOCK':
      return {
        ...state,
        blocks: state.blocks.map(b => b.id === action.id ? { ...b, ...action.updates } : b),
      };

    case 'REORDER_BLOCKS': {
      // Move block from dragIndex to dropIndex
      const blocks = [...state.blocks];
      const [removed] = blocks.splice(action.dragIndex, 1);
      blocks.splice(action.dropIndex, 0, removed);
      return { ...state, blocks };
    }

    case 'MOVE_UP': {
      const idx = state.blocks.findIndex(b => b.id === action.id);
      if (idx <= 0) return state;
      const blocks = [...state.blocks];
      [blocks[idx - 1], blocks[idx]] = [blocks[idx], blocks[idx - 1]];
      return { ...state, blocks };
    }

    case 'MOVE_DOWN': {
      const idx = state.blocks.findIndex(b => b.id === action.id);
      if (idx >= state.blocks.length - 1) return state;
      const blocks = [...state.blocks];
      [blocks[idx], blocks[idx + 1]] = [blocks[idx + 1], blocks[idx]];
      return { ...state, blocks };
    }

    case 'DUPLICATE_BLOCK': {
      const idx = state.blocks.findIndex(b => b.id === action.id);
      if (idx === -1) return state;
      const clone = { ...state.blocks[idx], id: `block_${Date.now()}_copy` };
      const blocks = [...state.blocks];
      blocks.splice(idx + 1, 0, clone);
      return { ...state, blocks };
    }

    case 'SELECT_BLOCK':
      return { ...state, selectedId: action.id };

    case 'DESELECT':
      return { ...state, selectedId: null };

    case 'CLEAR_CANVAS':
      return { ...state, blocks: [], selectedId: null };

    case 'LOAD_BLOCKS':
      return { ...state, blocks: action.blocks, selectedId: null };

    case 'SET_PAGE_TITLE':
      return { ...state, pageTitle: action.title };

    case 'TOGGLE_PREVIEW':
      return { ...state, preview: !state.preview, selectedId: null };

    default:
      return state;
  }
};

// ── Hook ─────────────────────────────────────────────────────────────────────
const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return null;
};

const initialState = () => {
  const saved = loadFromStorage();
  return {
    blocks:    saved?.blocks    ?? DEFAULT_BLOCKS,
    pageTitle: saved?.pageTitle ?? 'My Personal Page',
    selectedId: null,
    preview:    false,
  };
};

export const useBlocks = () => {
  const [state, dispatch] = useReducer(blocksReducer, null, initialState);

  // Auto-save to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        blocks:    state.blocks,
        pageTitle: state.pageTitle,
        savedAt:   new Date().toISOString(),
      }));
    } catch { /* storage full */ }
  }, [state.blocks, state.pageTitle]);

  const addBlock      = useCallback((block, afterIndex) => dispatch({ type: 'ADD_BLOCK', block, afterIndex }), []);
  const removeBlock   = useCallback((id)                => dispatch({ type: 'REMOVE_BLOCK', id }), []);
  const updateBlock   = useCallback((id, updates)       => dispatch({ type: 'UPDATE_BLOCK', id, updates }), []);
  const reorderBlocks = useCallback((dragIndex, dropIndex) => dispatch({ type: 'REORDER_BLOCKS', dragIndex, dropIndex }), []);
  const moveUp        = useCallback((id)                => dispatch({ type: 'MOVE_UP', id }), []);
  const moveDown      = useCallback((id)                => dispatch({ type: 'MOVE_DOWN', id }), []);
  const duplicateBlock= useCallback((id)                => dispatch({ type: 'DUPLICATE_BLOCK', id }), []);
  const selectBlock   = useCallback((id)                => dispatch({ type: 'SELECT_BLOCK', id }), []);
  const deselect      = useCallback(()                  => dispatch({ type: 'DESELECT' }), []);
  const clearCanvas   = useCallback(()                  => dispatch({ type: 'CLEAR_CANVAS' }), []);
  const setPageTitle  = useCallback((title)             => dispatch({ type: 'SET_PAGE_TITLE', title }), []);
  const togglePreview = useCallback(()                  => dispatch({ type: 'TOGGLE_PREVIEW' }), []);

  return {
    blocks:    state.blocks,
    pageTitle: state.pageTitle,
    selectedId: state.selectedId,
    preview:   state.preview,
    addBlock, removeBlock, updateBlock, reorderBlocks,
    moveUp, moveDown, duplicateBlock,
    selectBlock, deselect, clearCanvas, setPageTitle, togglePreview,
  };
};
