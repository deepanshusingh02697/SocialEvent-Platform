import { gql } from "@apollo/client";

export const GET_CURRENT_USER_QUERY = gql`
  query Query {
    currentUser {
      id
      firstname
      lastname
      email
      role
      createdAt
      updatedAt
    }
  }
`;
export const GET_EVENT_QUERY = gql`
  query Query($eventId: ID!) {
    getEvent(eventId: $eventId) {
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
export const GET_EVENTS_QUERY = gql`
  query Query($category: String, $search: String, $toDate: String) {
    getEvents(category: $category, search: $search, toDate: $toDate) {
      id
      image
      eventStartDate
      eventEndDate
      distance
      attendeeCount
      Eventlocation
      category
      title
      isArchive
    }
  }
`;
export const GET_USER_PROFILE_QUERY = gql`
  query Query($userId: ID!) {
    getUserProfile(userId: $userId) {
      bio
      latitude
      longitude
      profilePic
    }
  }
`;

export const GET_EVENT_DETAILS_QUERY = gql`
  query Query($eventId: ID!) {
    getEvent(eventId: $eventId) {
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
export const GET_USER_JOIN_QUERY = gql`
  query Query {
    userJoinedEvents {
      Eventlocation
      category
      attendeeCount
      eventStartDate
      eventEndDate
      id
      image
      title
    }
  }
`;

export const GET_ATTENDITES_ChatPopup=gql`
query Query($eventId: ID!) {
  eventParticipants(eventId: $eventId) {
    lastname
    firstname
    id
    profile {
      profilePic
    }
    email
  }
}
`