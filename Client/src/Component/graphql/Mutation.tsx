import { gql } from "@apollo/client";

export const POST_LOGOUT_MUTATION = gql`
  mutation Mutation {
    logOut
  }
`;
export const SIGNUP_MUTATION = gql`
  mutation Mutation(
    $firstname: String!
    $lastname: String!
    $email: String!
    $password: String!
  ) {
    signUp(
      firstname: $firstname
      lastname: $lastname
      email: $email
      password: $password
    ) {
      user {
        firstname
        email
        createdAt
        lastname
        role
      }
    }
  }
`;

export const ADMIN_LOGIN_MUTATION = gql`
  mutation Mutation($email: String!, $password: String!) {
    adminlogIn(email: $email, password: $password) {
      user {
        role
        firstname
        email
        lastname
      }
    }
  }
`;
export const OTP_LOGIN_MUTATION = gql`
  mutation Mutation($email: String!, $password: String!, $toPhone: String!) {
    sendOTPLogin(email: $email, password: $password, toPhone: $toPhone) {
      otpMsg
      success
    }
  }
`;
export const VERIFY_OTP_MUTATION = gql`
  mutation Mutation($code: String!) {
    verifyOTP(code: $code) {
      otpMsg
      success
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation Mutation(
    $latitude: Float
    $longitude: Float
    $bio: String
    $profilePic: String
  ) {
    updateProfile(
      latitude: $latitude
      longitude: $longitude
      bio: $bio
      profilePic: $profilePic
    ) {
      bio
      latitude
      longitude
      userId
      id
      profilePic
    }
  }
`;

export const JOIN_EVENT_MUTATION = gql`
  mutation Mutation($eventId: ID!) {
    joinEvent(eventId: $eventId) {
      userId
      isArchive
      joinedAt
      eventId
    }
  }
`;

export const Leave_EVENT_MUTATION = gql`
  mutation Mutation($eventId: ID!) {
    leaveEvent(eventId: $eventId)
  }
`;

export const Message_MUTATION = gql`
  mutation Mutation($content: String!, $receiverId: Int!) {
    sendMessage(content: $content, receiverId: $receiverId) {
      id
      receiverId
      senderId
      sender {
        email
        role
      }
      content
    }
  }
`;

export const CreateEvent_Mutation = gql`
  mutation Mutation(
    $title: String!
    $description: String!
    $category: String!
    $eventlocation: String!
    $eventStartDate: String!
    $eventEndDate: String!
    $image: String
  ) {
    createEvent(
      title: $title
      description: $description
      category: $category
      Eventlocation: $eventlocation
      eventStartDate: $eventStartDate
      eventEndDate: $eventEndDate
      image: $image
    ) {
      id
      title
      description
      category
      Eventlocation
      latitude
      longitude
      eventStartDate
      eventEndDate
      image
      attendeeCount
      distance
      createdAt
      updatedAt
    }
  }
`;

export const Update_Event_Mutation = gql`
  mutation Mutation(
    $eventId: ID!
    $title: String!
    $description: String!
    $category: String!
    $eventlocation: String!
    $eventStartDate: String!
    $eventEndDate: String!
    $latitude: Float
    $longitude: Float
    $image: String
  ) {
    updateEvent(
      eventId: $eventId
      title: $title
      description: $description
      category: $category
      Eventlocation: $eventlocation
      eventStartDate: $eventStartDate
      eventEndDate: $eventEndDate
      latitude: $latitude
      longitude: $longitude
      image: $image
    ) {
      id
      title
      description
      category
      Eventlocation
      latitude
      longitude
      eventStartDate
      eventEndDate
      image
      attendeeCount
      isArchive
      distance
      createdAt
      updatedAt
    }
  }
`;
