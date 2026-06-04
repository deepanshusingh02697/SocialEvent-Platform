export const typeDefs = `#graphql
enum Role{
    ADMIN
    USER
}
# User
type User{
    id:ID!
    firstname:String
    lastname:String
    email:String!
    password:String
    role:Role!

    googleId:String

    phone:String
    phoneVerified:Boolean

    interests:[UserInterest]
    attendees:[EventParticipant]

    createdAt:String
    updatedAt:String
}

type Prfile{
    id:ID!
    profilePic:String

    latitude:Float
    logitude:Float

    userId:Int!

    createdAt:String!
    updatedAt:String!
}

type Interest{
    id:ID!
    name:String!
}

type UserInterest{
    userId:Int!
    interestId:Int!

    user: User!

    interest:Interest!
}
# Auth Response
type AuthResponse{
    user:User!
}
type OtpResponse{
    success:Boolean!
    otpMsg:String!
}

# Event
type Event {
  id: ID!
 
  title: String!
  description: String!
 
  category: String!
 
  Eventlocation: String!
  latitude: Float
  longitude: Float

  eventStartDate: String!
  eventEndDate: String!
 
  image: String
  attendeeCount:Int!
  
  isArchive: Boolean!
  participants: [EventParticipant!]
 
  createdAt: String!
  updatedAt: String!
}

type EventParticipant {
  userId: Int!
  eventId: Int!
  isArchive:Boolean!
  joinedAt: String!
  user:User!
  event:Event!
}


type Query{
    currentUser:User!

    # Events
    getEvents: [Event!]!
    getEvent(eventId:ID!):Event

    #Events - authenticated user will access
    userJoinedEvents:[Event]!
    eventParticipants(eventId:ID!):[User!]!
}

type Mutation{
    signUp(firstname:String!,lastname:String!,email:String!,password:String!):AuthResponse!
    logIn(email:String!,password:String!):AuthResponse!
    googleLogin(idToken:String!):AuthResponse!
    sendOTPLogin(email:String!,password:String!,toPhone:String!):OtpResponse!
    verifyOTP(code:String!):OtpResponse!
    retreshTokenAPI:Boolean!
    logOut:Boolean



    # update Profile
    updateProfile(latitude:Float!,longitude:Float!):Prfile!
    deleteProfile:Boolean!


    # Events - ADMIN create only
    createEvent( title:String!,description:String!,category:String!,Eventlocation:String!,latitude:Float,longitude:Float,startDate:String!,endDate:String!,startTime:String!,endTime:String!,image:String!): Event!

    updateEvent(eventId:ID!, title:String!,description:String!,category:String!,Eventlocation:String!,latitude:Float,longitude:Float,startDate:String!,endDate:String!,startTime:String!,endTime:String!): Event!
    deleteEvent(eventId:ID!):Boolean!

    # Events - authenticated USER
    joinEvent(eventId:ID!):EventParticipant!
    archiveEvent(eventId:ID!):Boolean!
}
`;
