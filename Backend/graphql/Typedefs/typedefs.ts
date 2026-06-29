export const typeDefs = `#graphql
enum Role{
    ADMIN
    USER
}
scalar DateTime
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
    emailVerified:Boolean
    isActive: Boolean

    profile:Profile
    avatar:String

    interests:[UserInterest]
    attendees:[EventParticipant]

    createdAt:String
    updatedAt:String
}

type Profile{
    id:ID!
    profilePic:String
    bio:String

    latitude:Float
    longitude:Float

    userId:Int!
    user: User!

    createdAt:String!
    updatedAt:String!
}

type Interest{
    id:ID!
    name:String!
}
# Junction table
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

#   eventStartDate: String!
#   eventEndDate: String!
  eventStartDate:DateTime!
  eventEndDate:DateTime!
 
  image: String
  attendeeCount:Int!
  isArchive: Boolean!

  distance: Float
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

type Message{
    id: Int!
    content:String!
    senderId:Int!
    receiverId:Int!
    sender:User!
    receiver:User!
    createdAt:String!
}

type Query{
    currentUser:User!

    getUserProfile(userId:ID!):Profile

    getAllInterests:[Interest!]!


    # getEvents: [Event!]!
    getEvents(category:String, search:String,fromDate:String,toDate:String,latitude: Float,longitude: Float):[Event!]!

    getEvent(eventId:ID!):Event

    nearbyEvents(latitude:Float! longitude:Float! radiusKm:Float! category:String, serach:String):[Event!]!    

    #Events - authenticated user will access
    userJoinedEvents:[Event]!
    eventParticipants(eventId:ID!):[User!]!

    # Chats
    getMessages(receiverId:Int!):[Message] #return array of message objects

    #Admin 
    adminGetUsers(search:String):[User!]!
    adminGetEvents: [Event!]!
}


type Mutation{
    signUp(firstname:String!,lastname:String!,email:String!,password:String!):AuthResponse!
    adminlogIn(email:String!,password:String!):AuthResponse!
    googleLogin(idToken:String!):AuthResponse!
    sendOTPLogin(email:String!,password:String!,toPhone:String!):OtpResponse!
    verifyOTP(code:String!):OtpResponse!
    retreshTokenAPI:Boolean!
    logOut:Boolean


    # update Profile
    updateProfile(latitude:Float,longitude:Float,bio:String,profilePic:String):Profile!
    deleteProfile:Boolean!
    editUserProfile(firstname:String,lastname:String,avatar:String,email:String):User!

    #Interests
    addInterest(interestId:ID!):UserInterest!
    removeInterest(interestId:ID!):Boolean!


    # Events - ADMIN create only
    createEvent( title:String!,description:String!,category:String!,Eventlocation:String!,latitude:Float,longitude:Float,eventStartDate:String!,eventEndDate:String!,image:String): Event!

    updateEvent(eventId:ID!, title:String!,description:String!,category:String!,Eventlocation:String!,latitude:Float,longitude:Float,eventStartDate:String,eventEndDate:String,image:String): Event!

    deleteEvent(eventId:ID!):Boolean!

    # Events - authenticated USER
    joinEvent(eventId:ID!):EventParticipant!
    leaveEvent(eventId:ID!):Boolean!
    archiveEvent(eventId:ID!):Boolean!

    #Message
    sendMessage(content:String!,receiverId:Int!):Message!
}
`;
