export interface PopupContextType {
  isOpen: boolean;
  openPopup: () => void;
  closePopup: () => void;
}
export interface ChatPopupContextType {
  isOpenChat: boolean;
  setIsOpenChat: any;
  closeChatPopup: () => void;
}
export interface verifyOtpType {
  verifyOTP: {
    message: string;
    success: boolean;
  };
}
export interface GET_CURRENT_USER_Interface {
  currentUser: {
    firstname: string;
    email: string;
    lastname: string;
    role: string;
    updatedAt: string;
    createdAt: string;
    id: string;
  };
}
export interface GET_EVENY_TYPE {
  id: string;
  title: string;
  description: string;
  category: string;
  Eventlocation: string;
  latitude: number;
  longitude: number;
  eventStartDate: string;
  eventEndDate: string;
  image: string;
  attendeeCount: number;
  isArchive: boolean;
  distance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Get_EVENTS_TYPE {
  getEvents: [GET_EVENY_TYPE];
}

export interface Otp_Login_Res_Interface {
  sendOTPLogin: {
    otpMsg: string;
    success: boolean;
  };
}
export interface Update_Profile_Interface {
  updateProfile: {
    bio: string;
    latitude: number;
    longitude: number;
    userId: number;
    id: number;
    profilePic: string;
  };
}
export interface GET_User_Profile_Interface {
  getUserProfile: {
    bio: string;
    latitude: number;
    longitude: number;
    profilePic: string;
  };
}
export interface GET_Event_Detail_Interface {
  getEvent: {
    id: string;
    title: string;
    description: string;
    category: string;
    Eventlocation: string;
    latitude: number;
    longitude: number;
    eventStartDate: string;
    eventEndDate: string;
    image: string;
    attendeeCount: number;
    isArchive: boolean;
    distance: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Post_Join_Event_Interface {
  joinEvent: {
    userId: number;
    isArchive: boolean;
    joinedAt: string;
    eventId: number;
  };
}
export interface GET_USER_JOIN_Interface {
  userJoinedEvents: [
    {
      Eventlocation: string;
      category: string;
      attendeeCount: number;
      eventStartDate: string;
      eventEndDate: string;
      id: string;
      image: string;
      title: string;
    },
  ];
}

export interface GET_ATTENDITES_ChatPopup_Interface {
  eventParticipants: [
    {
      lastname: string;
      firstname: string;
      id: string;
      profile: string;
      email: string;
    },
  ];
}

export interface Post_Message_Interface {
  sendMessage: {
    id: number;
    receiverId: number;
    senderId: number;
    sender: {
      email: string;
      role: string;
    };
    content: string;
  };
}
export interface Get_Message_Interface {
  getMessages: [
    {
      id: number;
      content: string;
      senderId: number;
      createdAt: string;
      receiver: {
        firstname: string;
        isActive: boolean;
        id: string;
      };
      sender: {
        firstname: string;
        id: string;
      };
      receiverId: number;
    },
  ];
}
