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
