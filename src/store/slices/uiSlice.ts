import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  rightPanelTab: 'components' | 'styles' | 'settings';
  previewMode: boolean;
  mobilePreview: boolean;
  notification: {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  };
  confirmDialog: {
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  };
}

const initialState: UiState = {
  sidebarOpen: true,
  rightPanelOpen: true,
  rightPanelTab: 'components',
  previewMode: false,
  mobilePreview: false,
  notification: {
    show: false,
    message: '',
    type: 'info',
  },
  confirmDialog: {
    show: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleRightPanel: (state) => {
      state.rightPanelOpen = !state.rightPanelOpen;
    },
    setRightPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.rightPanelOpen = action.payload;
    },
    setRightPanelTab: (state, action: PayloadAction<'components' | 'styles' | 'settings'>) => {
      state.rightPanelTab = action.payload;
    },
    togglePreviewMode: (state) => {
      state.previewMode = !state.previewMode;
    },
    setPreviewMode: (state, action: PayloadAction<boolean>) => {
      state.previewMode = action.payload;
    },
    toggleMobilePreview: (state) => {
      state.mobilePreview = !state.mobilePreview;
    },
    setMobilePreview: (state, action: PayloadAction<boolean>) => {
      state.mobilePreview = action.payload;
    },
    showNotification: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' }>) => {
      state.notification = {
        show: true,
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    hideNotification: (state) => {
      state.notification.show = false;
    },
    showConfirmDialog: (state, action: PayloadAction<{
      title: string;
      message: string;
      onConfirm: () => void;
      onCancel: () => void;
    }>) => {
      state.confirmDialog = {
        show: true,
        title: action.payload.title,
        message: action.payload.message,
        onConfirm: action.payload.onConfirm,
        onCancel: action.payload.onCancel,
      };
    },
    hideConfirmDialog: (state) => {
      state.confirmDialog.show = false;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleRightPanel,
  setRightPanelOpen,
  setRightPanelTab,
  togglePreviewMode,
  setPreviewMode,
  toggleMobilePreview,
  setMobilePreview,
  showNotification,
  hideNotification,
  showConfirmDialog,
  hideConfirmDialog,
} = uiSlice.actions;

export default uiSlice.reducer;