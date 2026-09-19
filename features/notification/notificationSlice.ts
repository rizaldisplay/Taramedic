import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationType } from '@/components/ui/Notification'; // Sesuaikan path

interface NotificationState {
  show: boolean;
  title: string;
  message: string;
  type: NotificationType;
}

const initialState: NotificationState = {
  show: false,
  title: '',
  message: '',
  type: 'default',
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (state, action: PayloadAction<Omit<NotificationState, 'show'>>) => {
      state.show = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    hideNotification: (state) => {
      state.show = false;
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;