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
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
    interests: [
      {
        userId: number;
        interestId: number;
        interest: {
          name: string;
        };
      },
    ];
  };
}
export interface Get_PersonalisedEvent_Interface {
  getPersonalisedEvents: [
    {
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
    },
  ];
}
export interface SignupResponseData {
  signUp: {
    user: {
      id: string;
      email: string;
      firstname: string;
      lastname: string;
    };
  };
}

export interface googleLogin_Interface {
  googleLogin: {
    user: {
      email: string;
      firstname: string;
      googleId: string;
      lastname: string;
      id: number;
    };
  };
}
export interface Get_EVENTS_TYPE {
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
  getEvents: [Get_EVENTS_TYPE];
}

export interface NEARBY_EVENT_Interface {
  nearbyEvents: [
    {
      id: string;
      Eventlocation: string;
      attendeeCount: number;
      eventStartDate: string;
      eventEndDate: string;
      image: string;
      categroy: string;
      distance: number;
      title: string;
    },
  ];
}

export interface Admin_Login_Interface {
  adminlogIn: {
    user: {
      role: string;
      firstname: string;
      email: string;
      lastname: string;
    };
  };
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

// ADMIN
export interface Post_CreateEvent_Interface {
  createEvent: {
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
    distance: number;
    createdAt: string;
    updatedAt: string;
  };
}
export interface EditIdContextType {
  editId: string | null;
  setUpdateId: (id: string | null) => void;
  ismaplatitude: number | null;
  ismaplongitude: number | null;
  setmaplatlongFunc: (lat: number | null, long: number | null) => void;
}
export interface GET_ADMIN_USERS_Interface {
  adminGetUsers: [
    {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      googleId: null;
      phone: string;
      createdAt: string;
      avatar: string;
      attendees: [
        {
          eventId: number;
        },
      ];
    },
  ];
}

export interface AddInterest_Interface {
  addInterest: {
    interest: {
      name: string;
      id: string;
    };
  };
}

export interface Get_All_Interests_Interface {
  getAllInterests: [
    {
      id: string;
      name: string;
    },
  ];
}

export interface Interest_Interface {
  interestId: string;
}
export interface Update_Profile_Interface {
  editUserProfile: {
    email: string;
    firstname: string;
    lastname: string;
    updatedAt: string;
    avatar: string;
    id: string;
    interests: [Interest_Interface];
  };
}
